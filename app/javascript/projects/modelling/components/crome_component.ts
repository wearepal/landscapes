import { BaseComponent } from "./base_component"
import { Node, Output } from "rete"
import { createXYZ } from "ol/tilegrid"
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { booleanDataSocket, categoricalDataSocket } from "../socket_types"
import GeoJSON from "ol/format/GeoJSON"
import { BooleanTileGrid, CategoricalTileGrid } from "../tile_grid"
import { Extent } from "ol/extent"
import { bboxFromExtent } from "../bounding_box"
import { TileRange } from "ol"
import TileGrid from "ol/tilegrid/TileGrid"

interface CropSpecies {
  LUCODE: string
  LC: string
}

const cropspecies: CropSpecies[] = [
  //TODO : move to a json or an alternative storage
{ LC: "Spring Barley", LUCODE: "AC01" }, 
{ LC: "Beet", LUCODE: "AC03" }, 
{ LC: "Borage", LUCODE: "AC04" }, 
{ LC: "Buckwheat", LUCODE: "AC05" }, 
{ LC: "Canary Seed", LUCODE: "AC06" }, 
{ LC: "Carrot", LUCODE: "AC07" }, 
{ LC: "Chicory", LUCODE: "AC09" }, 
{ LC: "Daffodil", LUCODE: "AC10" }, 
{ LC: "Hemp", LUCODE: "AC14" }, 
{ LC: "Lettuce", LUCODE: "AC15" }, 
{ LC: "Spring Linseed ", LUCODE: "AC16" }, 
{ LC: "Maize", LUCODE: "AC17" }, 
{ LC: "Millet", LUCODE: "AC18" }, 
{ LC: "Spring Oats", LUCODE: "AC19" }, 
{ LC: "Onions", LUCODE: "AC20" }, 
{ LC: "Parsley", LUCODE: "AC22" }, 
{ LC: "Parsnips", LUCODE: "AC23" }, 
{ LC: "Spring Rye", LUCODE: "AC24" }, 
{ LC: "Spinach", LUCODE: "AC26" }, 
{ LC: "Strawberry", LUCODE: "AC27" }, 
{ LC: "Spring Triticale", LUCODE: "AC30" }, 
{ LC: "Spring Wheat", LUCODE: "AC32" }, 
{ LC: "Spring Cabbage", LUCODE: "AC34" }, 
{ LC: "Turnip", LUCODE: "AC35" }, 
{ LC: "Spring Oilseed", LUCODE: "AC36" }, 
{ LC: "Brown Mustard", LUCODE: "AC37" }, 
{ LC: "Mustard", LUCODE: "AC38" }, 
{ LC: "Radish", LUCODE: "AC41" }, 
{ LC: "Potato", LUCODE: "AC44" }, 
{ LC: "Tomato", LUCODE: "AC45" }, 
{ LC: "Squash", LUCODE: "AC50" }, 
{ LC: "Siam Pumpkin", LUCODE: "AC52" }, 
{ LC: "Mixed Crop-Group 1", LUCODE: "AC58" }, 
{ LC: "Mixed Crop-Group 2", LUCODE: "AC59" }, 
{ LC: "Mixed Crop-Group 3", LUCODE: "AC60" }, 
{ LC: "Mixed Crop-Group 4", LUCODE: "AC61" }, 
{ LC: "Mixed Crop-Group 5", LUCODE: "AC62" }, 
{ LC: "Winter Barley", LUCODE: "AC63" }, 
{ LC: "Winter Linseed", LUCODE: "AC64" }, 
{ LC: "Winter Oats", LUCODE: "AC65" }, 
{ LC: "Winter Wheat", LUCODE: "AC66" }, 
{ LC: "Winter Oilseed", LUCODE: "AC67" }, 
{ LC: "Winter Rye", LUCODE: "AC68" }, 
{ LC: "Winter Triticale", LUCODE: "AC69" }, 
{ LC: "Winter Cabbage", LUCODE: "AC70" }, 
{ LC: "Coriander", LUCODE: "AC71" }, 
{ LC: "Corn gromwell", LUCODE: "AC72" }, 
{ LC: "Phacelia", LUCODE: "AC74" }, 
{ LC: "Poppy", LUCODE: "AC81" }, 
{ LC: "Sunflower", LUCODE: "AC88" }, 
{ LC: "Gladioli", LUCODE: "AC90" }, 
{ LC: "Sorghum", LUCODE: "AC92" }, 
{ LC: "Sweet William", LUCODE: "AC94" }, 
{ LC: "Italian Ryegrass", LUCODE: "AC100" }, 
{ LC: "Cover Crop", LUCODE: "CA02" }, 
{ LC: "Chickpea", LUCODE: "LG01" }, 
{ LC: "Fenugreek", LUCODE: "LG02" }, 
{ LC: "Spring Field beans", LUCODE: "LG03" }, 
{ LC: "Green Beans", LUCODE: "LG04" }, 
{ LC: "Lupins", LUCODE: "LG06" }, 
{ LC: "Spring Peas", LUCODE: "LG07" }, 
{ LC: "Cowpea", LUCODE: "LG09" }, 
{ LC: "Soya", LUCODE: "LG08" }, 
{ LC: "Lucerne", LUCODE: "LG11" }, 
{ LC: "Sainfoin", LUCODE: "LG13" }, 
{ LC: "Clover", LUCODE: "LG14" }, 
{ LC: "Mixed Crops–Group 1 Leguminous", LUCODE: "LG15" }, 
{ LC: "Mixed Crops–Group 2 Leguminous", LUCODE: "LG16" }, 
{ LC: "Winter Field beans", LUCODE: "LG20" }, 
{ LC: "Winter Peas", LUCODE: "LG21" }, 
{ LC: "Short Rotation Coppice", LUCODE: "SR01" }, 
{ LC: "Fallow Land", LUCODE: "FA01" }, 
{ LC: "Heathland and Bracken", LUCODE: "HE02" }, 
{ LC: "Heather", LUCODE: "HEAT" }, 
{ LC: "Grass", LUCODE: "PG01" }, 
{ LC: "Non-vegetated or sparsely-vegetated Land", LUCODE: "NA01" }, 
{ LC: "Water", LUCODE: "WA00" }, 
{ LC: "Perennial Crops and Isolated Trees", LUCODE: "TC01" }, 
{ LC: "Nursery Crops", LUCODE: "NU01" }, 
{ LC: "Trees and Scrubs, short Woody plants, hedgerows", LUCODE: "WO12" }, 
{ LC: "Unknown or Mixed Vegetation", LUCODE: "AC00" }, 
{ LC: "All", LUCODE: "000" }
]

async function fetchCROMEFromExtent(bbox: string, source: string, count: number, startIndex: number) {

  const response = await fetch(
    "https://environment.data.gov.uk/spatialdata/crop-map-of-england-2021/wfs?" +
    new URLSearchParams(
      {
        outputFormat: 'application/json',
        request: 'GetFeature',
        typeName: source,
        srsName: 'EPSG:3857',
        bbox,
        count: count.toString(),
        startIndex: startIndex.toString()
      }
    )
  )
  if (!response.ok) throw new Error()

  return await response.json()
}

async function loadFeaturesToGrid(grid: CategoricalTileGrid, tileRange: TileRange, tileGrid: TileGrid, features: any, map: Map<number, string>) : Promise<CategoricalTileGrid>{
  // given a grid and a set of features, load the features into the grid

  for (let feature of features) {

    const lucode = feature.get("lucode")
    const index = cropspecies.findIndex(x => x.LUCODE === lucode)

    if (index === -1) { continue }

    const geom = feature.getGeometry()

    if (!geom) continue

    const featureTileRange = tileGrid.getTileRangeForExtentAndZ(
      geom.getExtent(),
      grid.zoom
    )
    for (
      let x = Math.max(featureTileRange.minX, tileRange.minX);
      x <= Math.min(featureTileRange.maxX, tileRange.maxX);
      ++x
    ) {
      for (
        let y = Math.max(featureTileRange.minY, tileRange.minY);
        y <= Math.min(featureTileRange.maxY, tileRange.maxY);
        ++y
      ) {
        const tileExtent = tileGrid.getTileCoordExtent([grid.zoom, x, y])
        if (geom.intersectsExtent(tileExtent)) {
          grid.set(x, y, index + 1)
        }
      }
    }
  }

  return grid
}
async function renderCategoricalData(extent: Extent, zoom: number) {

  const tileGrid = createXYZ()
  const outputTileRange = tileGrid.getTileRangeForExtentAndZ(extent, zoom)

  const count = 300000
  //TODO retrieve count & available layers from GetCapabilities request incase it changes
  let startIndex = 0

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

  while (true) {
    const res = await fetchCROMEFromExtent(bboxFromExtent(extent), 'dataset-f0f54bc1-b77a-42c8-b601-2f4aaf4dd851:Crop_Map_of_England_2021_Kent,dataset-f0f54bc1-b77a-42c8-b601-2f4aaf4dd851:Crop_Map_of_England_2021_Surrey,dataset-f0f54bc1-b77a-42c8-b601-2f4aaf4dd851:Crop_Map_of_England_2021_West_Sussex,dataset-f0f54bc1-b77a-42c8-b601-2f4aaf4dd851:Crop_Map_of_England_2021_East_Sussex', count, startIndex)
    const features = new GeoJSON().readFeatures(res)

    if (features.length === 0) break

    await loadFeaturesToGrid(result, outputTileRange, tileGrid, features, map)

    if (features.length < count) break

    startIndex += count
  }

  result.setLabels(map)

  return result
}

export class CROMEComponent extends BaseComponent {
  categoricalData: CategoricalTileGrid | null
  outputCache: Map<string, BooleanTileGrid>
  projectExtent: Extent
  projectZoom: number

  constructor(projectExtent: Extent, projectZoom: number) {
    super("Crop Map of England CROME")
    this.category = "Inputs"
    this.categoricalData = null
    this.outputCache = new Map()
    this.projectExtent = projectExtent
    this.projectZoom = projectZoom
  }

  async builder(node: Node) {

    node.meta.toolTip = "The Crop Map of England (CROME) is a polygon vector dataset mainly containing the crop types of England. The dataset contains approximately 32 million hexagonal cells classifying England into over 15 main crop types, grassland, and non-agricultural land covers, such as Woodland, Water Bodies, Fallow Land and other non-agricultural land covers."

    node.meta.toolTipLink = "https://www.data.gov.uk/dataset/aaedb588-fc86-498f-acab-5fa1b261fdd5/crop-map-of-england-crome-2021"

    //cropspecies.forEach(crome =>
    //  crome.LC === "All" ? node.addOutput(new Output(crome["LUCODE"], crome["LC"], categoricalDataSocket)) : node.addOutput(new Output(crome["LUCODE"], crome["LC"], booleanDataSocket))
    //)
    for (let crome of cropspecies) {
      if (crome.LUCODE === "000") {
        node.addOutput(new Output(crome["LUCODE"], crome["LC"], categoricalDataSocket))
      }
      else if (crome.LUCODE === "TC01" || crome.LUCODE === "WO12" || crome.LUCODE === "AC88" || crome.LUCODE === "AC17" || crome.LUCODE === "LG08") {
        node.addOutput(new Output(crome["LUCODE"], crome["LC"], booleanDataSocket))
      }
    }

  }

  async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {

    if (this.categoricalData === null) {
      this.categoricalData = await renderCategoricalData(this.projectExtent, this.projectZoom)
    }
    const categoricalData = this.categoricalData!

    cropspecies.filter(
      crome => node.outputs[crome.LUCODE]?.connections.length > 0
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