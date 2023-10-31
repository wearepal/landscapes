import { BaseComponent } from "./base_component"
import { Node, Output } from "rete"
import { createXYZ } from "ol/tilegrid"
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { currentBbox as bbox, currentExtent as extent, zoomLevel } from "../bounding_box"
import { booleanDataSocket, categoricalDataSocket } from "../socket_types"
import { retrieveModelData } from "../model_retrieval"
import GeoJSON from "ol/format/GeoJSON"
import { BooleanTileGrid, CategoricalTileGrid } from "../tile_grid"

const zoom = zoomLevel

interface CropSpecies {
  agg: number
  LC: string
  mode: number
  LU: string
  LUCODE: string
}

const cropspecies: CropSpecies[] = [
  //TODO : move to a json or an alternative storage
  { agg: 1, LC: "Trees", mode: 1, LC: "Perennial Crops and Isolated Trees", LUCODE: "TC01" },
  { agg: 1, LC: "Trees", mode: 2, LC: "Trees and Scrubs, short Woody plants, hedgerows", LUCODE: "WO12"},
  { agg: 2, LC: "Grassland", mode: 3, LC: "Heathland and Bracken", LUCODE: "HE02"},
  { agg: 2, LC: "Cereal Crops", mode: 4, LC: "Sunflower", LUCODE: "AC88"},
  { agg: 3, LC: "Cereal Crops", mode: 5, LC: "Tomato", LUCODE: "AC45"},
  { agg: 2, LC: "Cereal Crops", mode: 6, LC: "Potato", LUCODE: "AC44"},
  { agg: 3, LC: "Leguminous Crops", mode: 7, LC: "Chickpea", LUCODE: "LG01"},
  { agg: 3, LC: "Leguminous Crops", mode: 8, LC: "Soya", LUCODE: "LG08"},
  { agg: 0, AC: "All", mode: 0, LC: "All" }
]

async function renderCategoricalData() {
  // When testing locally, disable CORS in browser settings

  const tileGrid = createXYZ()
  const outputTileRange = tileGrid.getTileRangeForExtentAndZ(extent, zoom)

  const geotiff = await retrieveModelData(extent, 'crome:2021', outputTileRange)

  const rasters = await geotiff.readRasters()
  const image = await geotiff.getImage()


  const map: Map<number, string> = new Map()

  cropspecies.forEach(crome => {
    if (crome.mode !== 0) map.set(crome.mode, crome.LC)
  })

  const result = new CategoricalTileGrid(
    zoom,
    outputTileRange.minX,
    outputTileRange.minY,
    outputTileRange.getWidth(),
    outputTileRange.getHeight()
  )

  for (let i = 0; i < (rasters[0] as TypedArray).length; i++) {

    let x = (outputTileRange.minX + i % image.getWidth())
    let y = (outputTileRange.minY + Math.floor(i / image.getWidth()))

    result.set(x, y, rasters[0][i])

  }

  result.setLabels(map)

  return result
}

export class CROMEComponent extends BaseComponent {
  categoricalData: CategoricalTileGrid | null
  outputCache: Map<number, BooleanTileGrid>

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
      crome.AC === "All" ? node.addOutput(new Output(crome["mode"].toString(), crome["LC"], categoricalDataSocket)) : node.addOutput(new Output(crome["mode"].toString(), crome["LC"], booleanDataSocket))
    )
  }

  async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
    if (this.categoricalData === null) {
      this.categoricalData = await renderCategoricalData()
    }
    const categoricalData = this.categoricalData!

    cropspecies.filter(
      crome => node.outputs[crome.mode].connections.length > 0
    ).forEach(crome => {
      if (crome.mode === 0) {

        outputs[crome.mode] = this.categoricalData

      } else {
        if (this.outputCache.has(crome.mode)) {
          outputs[crome.mode] = this.outputCache.get(crome.mode)
        }
        else {
          const out = outputs[crome.mode] = new BooleanTileGrid(categoricalData.zoom, categoricalData.x, categoricalData.y, categoricalData.width, categoricalData.height)
          out.name = crome.LC

          for (let x = categoricalData.x; x < categoricalData.x + categoricalData.width; ++x) {
            for (let y = categoricalData.y; y < categoricalData.y + categoricalData.height; ++y) {
              out.set(x, y, categoricalData.get(x, y) === crome.mode)
            }
          }
          this.outputCache.set(crome.mode, out)
        }
      }
    })
  }
}