import { Component, Output } from "rete";
import { setSocket } from "../sockets";
import GeoJSON from "ol/format/GeoJSON";
import {
  createEmpty as createEmptyExtent,
  extend as extendExtent,
} from "ol/extent";
import { createXYZ } from "ol/tilegrid";
import { BooleanTileGrid } from "../TileGrid";

export class InputHabitatComponent extends Component {
  constructor() {
    super("Input habitat");
    this.category = "Inputs & Outputs";

    this.habitats = [
      //TODO : move to a json or an alternative storage
      { agg: 1, AC: "Deciduous Woodland", mode: 1, LC: "Deciduous Woodland" },

      { agg: 2, AC: "Coniferous Woodland", mode: 2, LC: "Coniferous Woodland" },

      { agg: 3, AC: "Arable", mode: 3, LC: "Arable" },

      { agg: 4, AC: "Improved Grassland", mode: 4, LC: "Improved Grassland" },

      {
        agg: 5,
        AC: "Semi-natural Grassland",
        mode: 5,
        LC: "Neutral Grassland",
      },
      {
        agg: 5,
        AC: "Semi-natural Grassland",
        mode: 6,
        LC: "Calcareous Grassland",
      },
      { agg: 5, AC: "Semi-natural Grassland", mode: 7, LC: "Acid Grassland" },
      { agg: 5, AC: "Semi-natural Grassland", mode: 8, LC: "Fen" },

      { agg: 6, AC: "Mountain, Heath and Bog", mode: 9, LC: "Heather" },
      {
        agg: 6,
        AC: "Mountain, Heath and Bog",
        mode: 10,
        LC: "Heather Grassland",
      },
      { agg: 6, AC: "Mountain, Heath and Bog", mode: 11, LC: "Bog" },
      { agg: 6, AC: "Mountain, Heath and Bog", mode: 12, LC: "Inland Rock" },

      { agg: 7, AC: "Saltwater", mode: 13, LC: "Saltwater" },

      { agg: 8, AC: "Freshwater", mode: 14, LC: "Freshwater" },

      { agg: 9, AC: "Coastal", mode: 15, LC: "Supralittoral Rock" },
      { agg: 9, AC: "Coastal", mode: 16, LC: "Supralittoral Sediment" },
      { agg: 9, AC: "Coastal", mode: 17, LC: "Littoral Rock" },
      { agg: 9, AC: "Coastal", mode: 18, LC: "Littoral Sediment" },
      { agg: 9, AC: "Coastal", mode: 19, LC: "Saltmarsh" },

      { agg: 10, AC: "Built-up areas and gardens", mode: 20, LC: "Urban" },
      { agg: 10, AC: "Built-up areas and gardens", mode: 21, LC: "Suburban" },
    ];
  }

  builder(node) {
    this.habitats.forEach((hab) => {
      node.addOutput(new Output(hab["mode"], hab["LC"], setSocket));
    });
  }

  async retrieveLandCoverData(bbox) {
    const response = await fetch(
      "http://localhost:8080/geoserver/wfs?" +
        new URLSearchParams(
          {
            outputFormat: "application/json",
            request: "GetFeature",
            typeName: "ne:lcm_2021",

            bbox: bbox,
          },
          {
            crossDomain: true,
          }
        )
    );

    if (!response.ok) throw new Error();

    return await response.json();
  }

  async worker(node, inputs, outputs) {
    let bbox =
      "-14782.045007023014,6596819.173144216,-7883.035964960155,6612578.505519601,EPSG:3857";

    let out = node.outputs;

    const activeHabitats = this.habitats.filter(
      (habitat) => out[habitat.mode].connections.length > 0
    );

    await this.retrieveLandCoverData(bbox).then((json) => {
      const features = new GeoJSON({
        dataProjection: json.crs?.properties?.name,
        featureProjection: "EPSG:3857",
      }).readFeatures(json);

      const extent = features.reduce(
        (extent, feature) =>
          extendExtent(extent, feature.getGeometry().getExtent()),
        createEmptyExtent()
      );

      let z = 18; //hard coded zoom for now..

      const tileGrid = createXYZ();
      const outputTileRange = tileGrid.getTileRangeForExtentAndZ(extent, z);

      activeHabitats.forEach((ah) => {
        ah.result = new BooleanTileGrid(
          z,
          outputTileRange.minX,
          outputTileRange.minY,
          outputTileRange.getWidth(),
          outputTileRange.getHeight()
        );
      });

      features.forEach((feature) => {
        const mode = feature.values_._mode;

        const index = activeHabitats.findIndex((x) => x.mode == mode);

        if (index != -1) {
          const geom = feature.getGeometry();
          if (geom.getType() === "Point") {
            const [, x, y] = tileGrid.getTileCoordForCoordAndZ(
              geom.getCoordinates(),
              z
            );
            activeHabitats[index].result.set(x, y, true);
          } else {
            const featureTileRange = tileGrid.getTileRangeForExtentAndZ(
              geom.getExtent(),
              z
            );
            for (
              let x = featureTileRange.minX;
              x <= featureTileRange.maxX;
              ++x
            ) {
              for (
                let y = featureTileRange.minY;
                y <= featureTileRange.maxY;
                ++y
              ) {
                const tileExtent = tileGrid.getTileCoordExtent([z, x, y]);
                if (geom.intersectsExtent(tileExtent)) {
                  activeHabitats[index].result.set(x, y, true);
                }
              }
            }
          }
        }
      });

      activeHabitats.forEach((ah) => {
        outputs[ah.mode] = ah.result;
        outputs[ah.mode].name = ah.LC;
      });
    });
  }
}
