import { BaseComponent } from "./base_component"
import { Node, Output } from "rete"
import { createXYZ } from "ol/tilegrid"
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { currentBbox as bbox, currentExtent as extent, zoomLevel } from "../bounding_box"
import { booleanDataSocket, categoricalDataSocket } from "../socket_types"
import GeoJSON from "ol/format/GeoJSON"
import { BooleanTileGrid, CategoricalTileGrid } from "../tile_grid"

const zoom = zoomLevel

interface CropSpecies {
  LUCODE: string
  LC: string
}

const cropspecies: CropSpecies[] = [
  //TODO : move to a json or an alternative storage
  { LC: "Perennial Crops and Isolated Trees", LUCODE: "TC01" },
  { LC: "Trees and Scrubs, short Woody plants, hedgerows", LUCODE: "WO12" },
  { LC: "Heathland and Bracken", LUCODE: "HE02" },
  { LC: "Sunflower", LUCODE: "AC88" },
  { LC: "Tomato", LUCODE: "AC45" },
  { LC: "Potato", LUCODE: "AC44" },
  { LC: "Chickpea", LUCODE: "LG01" },
  { LC: "Soya", LUCODE: "LG08" },
  { LC: "All", LUCODE: "000" }
]

async function fetchCROMEFromExtent(bbox: string, source: string) {

  const response = await fetch(
    "https://landscapes.wearepal.ai/geoserver/wfs?" +
    new URLSearchParams(
      {
        outputFormat: 'application/json',
        request: 'GetFeature',
        typeName: source,
        srsName: 'EPSG:3857',
        bbox
      }
    )
  )
  if (!response.ok) throw new Error()

  return await response.json()
}

async function renderCategoricalData() {
  // When testing locally, disable CORS in browser settings

  const tileGrid = createXYZ()
  const outputTileRange = tileGrid.getTileRangeForExtentAndZ(extent, zoom)
  const res = await fetchCROMEFromExtent(bbox, 'crome:crop_map_of_england_2020_east_sussex')
  const features = new GeoJSON().readFeatures(res)


  const map: Map<number, string> = new Map()

  cropspecies.forEach((crome, i) => {
    if (crome.LUCODE !== "000") map.set(i + 1, crome.LC)
  })

  const result = new CategoricalTileGrid(
    zoom,
    outputTileRange.minX,
    outputTileRange.minY,
    outputTileRange.getWidth(),
    outputTileRange.getHeight()
  )

  for (let feature of features) {

    const lucode = feature.get("lucode")
    const index = cropspecies.findIndex(x => x.LUCODE === lucode)

    if (index === -1) { continue }

    const geom = feature.getGeometry()

    if (!geom) continue

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
        const tileExtent = tileGrid.getTileCoordExtent([zoom, x, y])
        if (geom.intersectsExtent(tileExtent)) {
          result.set(x, y, index + 1)
        }
      }
    }
  }

  result.setLabels(map)

  return result
}

export class CROMEComponent extends BaseComponent {
  categoricalData: CategoricalTileGrid | null
  outputCache: Map<string, BooleanTileGrid>

  constructor() {
    super("Crop Map of England CROME")
    this.category = "Inputs"
    this.categoricalData = null
    this.outputCache = new Map()
  }

  async builder(node: Node) {

    node.meta.toolTip = "The Crop Map of England (CROME) is a polygon vector dataset mainly containing the crop types of England. The dataset contains approximately 32 million hexagonal cells classifying England into over 15 main crop types, grassland, and non-agricultural land covers, such as Woodland, Water Bodies, Fallow Land and other non-agricultural land covers."

    node.meta.toolTipLink = "https://www.data.gov.uk/dataset/aaedb588-fc86-498f-acab-5fa1b261fdd5/crop-map-of-england-crome-2021"

    cropspecies.forEach(crome =>
      crome.LC === "All" ? node.addOutput(new Output(crome["LUCODE"], crome["LC"], categoricalDataSocket)) : node.addOutput(new Output(crome["LUCODE"], crome["LC"], booleanDataSocket))
    )
  }

  async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {

    if (this.categoricalData === null) {
      this.categoricalData = await renderCategoricalData()
    }
    const categoricalData = this.categoricalData!

    cropspecies.filter(
      crome => node.outputs[crome.LUCODE].connections.length > 0
    ).forEach(crome => {
      if (crome.LUCODE === "000") {

        outputs[crome.LUCODE] = this.categoricalData

      } else {

        const out = outputs[crome.LUCODE] = new BooleanTileGrid(categoricalData.zoom, categoricalData.x, categoricalData.y, categoricalData.width, categoricalData.height)

        out.name = crome.LC

        const key = cropspecies.findIndex(x => x.LUCODE === crome.LUCODE) + 1

        for (let x = categoricalData.x; x < categoricalData.x + categoricalData.width; ++x) {
          for (let y = categoricalData.y; y < categoricalData.y + categoricalData.height; ++y) {
            out.set(x, y, categoricalData.get(x, y) === key)
          }
        }

        this.outputCache.set(crome.LUCODE, out)
      }
    })
  }
}