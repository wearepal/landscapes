import GeoJSON from "ol/format/GeoJSON"
import { createXYZ } from "ol/tilegrid"
import { Node, Output } from "rete"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { booleanDataSocket, categoricalDataSocket } from "../socket_types"
import { BooleanTileGrid, CategoricalTileGrid } from "../tile_grid"
import { BaseComponent } from "./base_component"

// TODO: make this customisable, currently it covers a box between Crawley (NW) and Seaford (SE)
// Crawley: -20839.008676500813, 6640614.986501137
// Seaford: 12889.487811, 6579722.087031
const extent = [-20839.008676500813, 6579722.087031, 12889.487811, 6640614.986501137]
const bbox = `${extent.join(",")},EPSG:3857`
const zoom = 20

interface Habitat {
  agg: number
  AC: string
  mode: number
  LC: string
}

const habitats: Habitat[] = [
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

async function renderCategoricalData() {
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

  const features = new GeoJSON().readFeatures(await response.json())

  const tileGrid = createXYZ()
  const outputTileRange = tileGrid.getTileRangeForExtentAndZ(extent, zoom)
  const result = new CategoricalTileGrid(
    zoom,
    outputTileRange.minX,
    outputTileRange.minY,
    outputTileRange.getWidth(),
    outputTileRange.getHeight()
  )

  for (let feature of features) {
    const geom = feature.getGeometry()
    if (geom === undefined) { continue }

    const featureTileRange = tileGrid.getTileRangeForExtentAndZ(
      geom.getExtent(),
      zoom
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
        const center = tileGrid.getTileCoordCenter([zoom, x, y])
        if (geom.intersectsCoordinate(center)) {
          result.set(x, y, feature.get("_mode"))
        }
      }
    }
  }

  return result
}

export class UkcehLandCoverComponent extends BaseComponent {
  categoricalData: CategoricalTileGrid | null
  outputCache: Map<number, BooleanTileGrid>

  constructor() {
    super("UKCEH Land Cover")
    this.category = "Inputs"
    this.categoricalData = null
    this.outputCache = new Map()
  }

  async builder(node: Node) {
    habitats.forEach(hab =>
      node.addOutput(new Output(hab["mode"].toString(), hab["LC"], booleanDataSocket))
    )
    node.addOutput(new Output("all", "All", categoricalDataSocket))
  }

  async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
    if (this.categoricalData === null) {
      this.categoricalData = await renderCategoricalData()
    }
    const categoricalData = this.categoricalData!

    habitats.filter(
      habitat => node.outputs[habitat.mode].connections.length > 0
    ).forEach(habitat => {
      if (this.outputCache.has(habitat.mode)) {
        outputs[habitat.mode] = this.outputCache.get(habitat.mode)
      }
      else {
        const out = outputs[habitat.mode] = new BooleanTileGrid(categoricalData.zoom, categoricalData.x, categoricalData.y, categoricalData.width, categoricalData.height)
        for (let x = categoricalData.x; x < categoricalData.x + categoricalData.width; ++x) {
          for (let y = categoricalData.y; y < categoricalData.y + categoricalData.height; ++y) {
            out.set(x, y, categoricalData.get(x, y) === habitat.mode)
          }
        }
        this.outputCache.set(habitat.mode, out)
      }
    })
  }
}
