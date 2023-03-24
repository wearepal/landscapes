import GeoJSON from "ol/format/GeoJSON"
import { createXYZ } from "ol/tilegrid"
import { Component, Node, Output } from "rete"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { booleanDataSocket } from "../socketTypes"
import { BooleanTileGrid } from "../tile_grid"
import { BaseComponent } from "./base_component"

interface Habitat {
  agg: number
  AC: string
  mode: number
  LC: string
  result?: BooleanTileGrid // TODO: remove me
}

export class UkcehLandCoverComponent extends BaseComponent {
  habitats: Habitat[]

  constructor() {
    super("UKCEH Land Cover")
    this.category = "Inputs"
    this.habitats = [
      //TODO : move to a json or an alternative storage
      { agg: 1, AC: "Deciduous Woodland", mode: 1, LC: "Deciduous Woodland" },
      { agg: 2, AC: "Coniferous Woodland", mode: 2, LC: "Coniferous Woodland" },
      { agg: 3, AC: "Arable", mode: 3, LC: "Arable" },
      { agg: 4, AC: "Improved Grassland", mode: 4, LC: "Improved Grassland" },
      { agg: 5, AC: "Semi-natural Grassland", mode: 5, LC: "Neutral Grassland" },
      { agg: 5, AC: "Semi-natural Grassland", mode: 6, LC: "Calcareous Grassland" },
      { agg: 5, AC: "Semi-natural Grassland", mode: 7, LC: "Acid Grassland" },
      { agg: 5, AC: "Semi-natural Grassland", mode: 8, LC: "Fen" },
      { agg: 6, AC: "Mountain, Heath and Bog", mode: 9, LC: "Heather" },
      { agg: 6, AC: "Mountain, Heath and Bog", mode: 10, LC: "Heather Grassland" },
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
    ]
  }

  async builder(node: Node) {
    this.habitats.forEach(hab =>
      node.addOutput(new Output(hab["mode"].toString(), hab["LC"], booleanDataSocket))
    )
  }

  async retrieveLandCoverData(bbox: string): Promise<unknown> {
    // When testing locally, disable CORS in browser settings
    const response = await fetch(
      "https://landscapes.wearepal.ai/geoserver/wfs?" +
      new URLSearchParams(
        {
          outputFormat: 'application/json',
          request: 'GetFeature',
          typeName: 'ukceh:lcm_2021',
          srsName: 'EPSG:3857',
          bbox
        }
      )
    )

    if (!response.ok) throw new Error()

    return await response.json()
  }

  async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
    console.log("ukceh worker")
    // TODO: make this customisable, currently it covers a box between Crawley (NW) and Seaford (SE)
    // Crawley: -20839.008676500813, 6640614.986501137
    // Seaford: 12889.487811, 6579722.087031
    const extent = [-20839.008676500813, 6579722.087031, 12889.487811, 6640614.986501137]
    const bbox = `${extent.join(",")},EPSG:3857`

    let out = node.outputs

    const activeHabitats = this.habitats.filter(
      habitat => out[habitat.mode].connections.length > 0
    )

    const json = await this.retrieveLandCoverData(bbox)
    const features = new GeoJSON().readFeatures(json)

    const z = 20 //hard coded zoom for now

    const tileGrid = createXYZ()
    const outputTileRange = tileGrid.getTileRangeForExtentAndZ(extent, z)

    activeHabitats.forEach(ah =>
      ah.result = new BooleanTileGrid(
        z,
        outputTileRange.minX,
        outputTileRange.minY,
        outputTileRange.getWidth(),
        outputTileRange.getHeight()
      )
    )

    for (let feature of features) {
      const mode = feature.get("_mode")

      // Double equals needed because mode is a string and x.mode is a number
      const index = activeHabitats.findIndex(x => x.mode == mode)

      if (index === -1) { continue }

      const geom = feature.getGeometry()
      if (geom === undefined) { continue; }
      const featureTileRange = tileGrid.getTileRangeForExtentAndZ(
        geom.getExtent(),
        z
      )
      for (
        let x = Math.max(featureTileRange.minX, outputTileRange.minX);
        x <= Math.min(featureTileRange.maxX, outputTileRange.maxX);
        ++x
      ) {
        for (
          let y = Math.max(featureTileRange.minY, outputTileRange.minY);
          y <= Math.min(featureTileRange.maxY, outputTileRange.maxY);
          ++y
        ) {
          const tileExtent = tileGrid.getTileCoordExtent([z, x, y])
          if (geom.intersectsExtent(tileExtent)) {
            activeHabitats[index].result?.set(x, y, true)
          }
        }
      }
    }

    activeHabitats.forEach(ah => {
      outputs[ah.mode] = ah.result
      //outputs[ah.mode].name = ah.LC
    })
  }
}
