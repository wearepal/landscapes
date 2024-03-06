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
  LC_CAT: string
}

const cropspecies: CropSpecies[] = [
{ LC: "Spring Barley", LUCODE: "AC01", LC_CAT: "Cereal" }, 
{ LC: "Beet", LUCODE: "AC03", LC_CAT: "Other (fruit, vegetables, herbs, flowers, oilseeds, cover crops)" }, 
{ LC: "Borage", LUCODE: "AC04", LC_CAT: "Other (fruit, vegetables, herbs, flowers, oilseeds, cover crops)" }, 
{ LC: "Buckwheat", LUCODE: "AC05", LC_CAT: "Cereal" }, 
{ LC: "Canary Seed", LUCODE: "AC06", LC_CAT: "Other (fruit, vegetables, herbs, flowers, oilseeds, cover crops)" }, 
{ LC: "Carrot", LUCODE: "AC07", LC_CAT: "Other (fruit, vegetables, herbs, flowers, oilseeds, cover crops)" }, 
{ LC: "Chicory", LUCODE: "AC09", LC_CAT: "Other (fruit, vegetables, herbs, flowers, oilseeds, cover crops)" }, 
{ LC: "Daffodil", LUCODE: "AC10", LC_CAT: "Other (fruit, vegetables, herbs, flowers, oilseeds, cover crops)" }, 
{ LC: "Hemp", LUCODE: "AC14", LC_CAT: "Other (fruit, vegetables, herbs, flowers, oilseeds, cover crops)" }, 
{ LC: "Lettuce", LUCODE: "AC15", LC_CAT: "Other (fruit, vegetables, herbs, flowers, oilseeds, cover crops)" }, 
{ LC: "Spring Linseed ", LUCODE: "AC16" , LC_CAT: "Other (fruit, vegetables, herbs, flowers, oilseeds, cover crops)"}, 
{ LC: "Maize", LUCODE: "AC17", LC_CAT: "Cereal" }, 
{ LC: "Millet", LUCODE: "AC18", LC_CAT: "Cereal" }, 
{ LC: "Spring Oats", LUCODE: "AC19", LC_CAT: "Cereal" }, 
{ LC: "Onions", LUCODE: "AC20" , LC_CAT: "Other (fruit, vegetables, herbs, flowers, oilseeds, cover crops)"}, 
{ LC: "Parsley", LUCODE: "AC22", LC_CAT: "Other (fruit, vegetables, herbs, flowers, oilseeds, cover crops)" }, 
{ LC: "Parsnips", LUCODE: "AC23", LC_CAT: "Other (fruit, vegetables, herbs, flowers, oilseeds, cover crops)" }, 
{ LC: "Spring Rye", LUCODE: "AC24" , LC_CAT: "Cereal"}, 
{ LC: "Spinach", LUCODE: "AC26" , LC_CAT: "Other (fruit, vegetables, herbs, flowers, oilseeds, cover crops)"}, 
{ LC: "Strawberry", LUCODE: "AC27" , LC_CAT: "Other (fruit, vegetables, herbs, flowers, oilseeds, cover crops)"}, 
{ LC: "Spring Triticale", LUCODE: "AC30" , LC_CAT: "Cereal"}, 
{ LC: "Spring Wheat", LUCODE: "AC32" , LC_CAT: "Cereal"}, 
{ LC: "Spring Cabbage", LUCODE: "AC34" , LC_CAT: "Cereal"}, 
{ LC: "Turnip", LUCODE: "AC35" , LC_CAT: "Other (fruit, vegetables, herbs, flowers, oilseeds, cover crops)"}, 
{ LC: "Spring Oilseed", LUCODE: "AC36" , LC_CAT: "Cereal"}, 
{ LC: "Brown Mustard", LUCODE: "AC37" , LC_CAT: "Other (fruit, vegetables, herbs, flowers, oilseeds, cover crops)"}, 
{ LC: "Mustard", LUCODE: "AC38" , LC_CAT: "Cereal"}, 
{ LC: "Radish", LUCODE: "AC41" , LC_CAT: "Other (fruit, vegetables, herbs, flowers, oilseeds, cover crops)"}, 
{ LC: "Potato", LUCODE: "AC44" , LC_CAT: "Other (fruit, vegetables, herbs, flowers, oilseeds, cover crops)"}, 
{ LC: "Tomato", LUCODE: "AC45" , LC_CAT: "Other (fruit, vegetables, herbs, flowers, oilseeds, cover crops)"}, 
{ LC: "Squash", LUCODE: "AC50" , LC_CAT: "Other (fruit, vegetables, herbs, flowers, oilseeds, cover crops)"}, 
{ LC: "Siam Pumpkin", LUCODE: "AC52" , LC_CAT: "Other (fruit, vegetables, herbs, flowers, oilseeds, cover crops)"}, 
{ LC: "Mixed Crop-Group 1", LUCODE: "AC58" , LC_CAT: "Other (fruit, vegetables, herbs, flowers, oilseeds, cover crops)"}, 
{ LC: "Mixed Crop-Group 2", LUCODE: "AC59" , LC_CAT: "Other (fruit, vegetables, herbs, flowers, oilseeds, cover crops)"}, 
{ LC: "Mixed Crop-Group 3", LUCODE: "AC60" , LC_CAT: "Other (fruit, vegetables, herbs, flowers, oilseeds, cover crops)"}, 
{ LC: "Mixed Crop-Group 4", LUCODE: "AC61" , LC_CAT: "Other (fruit, vegetables, herbs, flowers, oilseeds, cover crops)"}, 
{ LC: "Mixed Crop-Group 5", LUCODE: "AC62" , LC_CAT: "Other (fruit, vegetables, herbs, flowers, oilseeds, cover crops)"}, 
{ LC: "Winter Barley", LUCODE: "AC63" , LC_CAT: "Cereal"}, 
{ LC: "Winter Linseed", LUCODE: "AC64" , LC_CAT: "Other (fruit, vegetables, herbs, flowers, oilseeds, cover crops)"}, 
{ LC: "Winter Oats", LUCODE: "AC65" , LC_CAT: "Cereal"}, 
{ LC: "Winter Wheat", LUCODE: "AC66" , LC_CAT: "Cereal"}, 
{ LC: "Winter Oilseed", LUCODE: "AC67" , LC_CAT: "Other (fruit, vegetables, herbs, flowers, oilseeds, cover crops)"}, 
{ LC: "Winter Rye", LUCODE: "AC68" , LC_CAT: "Cereal"}, 
{ LC: "Winter Triticale", LUCODE: "AC69" , LC_CAT: "Cereal"}, 
{ LC: "Winter Cabbage", LUCODE: "AC70" , LC_CAT: "Other (fruit, vegetables, herbs, flowers, oilseeds, cover crops)"}, 
{ LC: "Coriander", LUCODE: "AC71" , LC_CAT: "Other (fruit, vegetables, herbs, flowers, oilseeds, cover crops)"}, 
{ LC: "Corn gromwell", LUCODE: "AC72" , LC_CAT: "Other (fruit, vegetables, herbs, flowers, oilseeds, cover crops)"}, 
{ LC: "Phacelia", LUCODE: "AC74" , LC_CAT: "Other (fruit, vegetables, herbs, flowers, oilseeds, cover crops)"}, 
{ LC: "Poppy", LUCODE: "AC81" , LC_CAT: "Other (fruit, vegetables, herbs, flowers, oilseeds, cover crops)"}, 
{ LC: "Sunflower", LUCODE: "AC88" , LC_CAT: "Other (fruit, vegetables, herbs, flowers, oilseeds, cover crops)"}, 
{ LC: "Gladioli", LUCODE: "AC90" , LC_CAT: "Other (fruit, vegetables, herbs, flowers, oilseeds, cover crops)"}, 
{ LC: "Sorghum", LUCODE: "AC92" , LC_CAT: "Cereal"}, 
{ LC: "Sweet William", LUCODE: "AC94" , LC_CAT: "Other (fruit, vegetables, herbs, flowers, oilseeds, cover crops)"}, 
{ LC: "Italian Ryegrass", LUCODE: "AC100" , LC_CAT: "Other (fruit, vegetables, herbs, flowers, oilseeds, cover crops)"}, 
{ LC: "Cover Crop", LUCODE: "CA02" , LC_CAT: "Cereal"}, 
{ LC: "Chickpea", LUCODE: "LG01" , LC_CAT: "Leguminous"}, 
{ LC: "Fenugreek", LUCODE: "LG02"  , LC_CAT: "Leguminous"}, 
{ LC: "Spring Field beans", LUCODE: "LG03"  , LC_CAT: "Leguminous"}, 
{ LC: "Green Beans", LUCODE: "LG04"  , LC_CAT: "Leguminous"}, 
{ LC: "Lupins", LUCODE: "LG06"  , LC_CAT: "Leguminous"}, 
{ LC: "Spring Peas", LUCODE: "LG07"  , LC_CAT: "Leguminous"}, 
{ LC: "Cowpea", LUCODE: "LG09"  , LC_CAT: "Leguminous"}, 
{ LC: "Soya", LUCODE: "LG08"  , LC_CAT: "Leguminous"}, 
{ LC: "Lucerne", LUCODE: "LG11"  , LC_CAT: "Leguminous"}, 
{ LC: "Sainfoin", LUCODE: "LG13"  , LC_CAT: "Leguminous"}, 
{ LC: "Clover", LUCODE: "LG14"  , LC_CAT: "Leguminous"}, 
{ LC: "Mixed Crops–Group 1 Leguminous", LUCODE: "LG15"  , LC_CAT: "Leguminous"}, 
{ LC: "Mixed Crops–Group 2 Leguminous", LUCODE: "LG16"  , LC_CAT: "Leguminous"}, 
{ LC: "Winter Field beans", LUCODE: "LG20"  , LC_CAT: "Leguminous"}, 
{ LC: "Winter Peas", LUCODE: "LG21" , LC_CAT: "Leguminous" }, 
{ LC: "Short Rotation Coppice", LUCODE: "SR01", LC_CAT: "Energy"}, 
{ LC: "Fallow Land", LUCODE: "FA01", LC_CAT: "Grassland"}, 
{ LC: "Heathland and Bracken", LUCODE: "HE02", LC_CAT: "Grassland" }, 
{ LC: "Heather", LUCODE: "HEAT", LC_CAT: "Grassland" }, 
{ LC: "Grass", LUCODE: "PG01", LC_CAT: "Grassland" }, 
{ LC: "Non-vegetated or sparsely-vegetated Land", LUCODE: "NA01", LC_CAT: "Non–Agricultural" }, 
{ LC: "Water", LUCODE: "WA00", LC_CAT: "Water" }, 
{ LC: "Perennial Crops and Isolated Trees", LUCODE: "TC01", LC_CAT: "Trees" }, 
{ LC: "Nursery Crops", LUCODE: "NU01", LC_CAT: "Trees" }, 
{ LC: "Trees and Scrubs, short Woody plants, hedgerows", LUCODE: "WO12", LC_CAT: "Trees" }, 
{ LC: "Unknown or Mixed Vegetation", LUCODE: "AC00", LC_CAT: "Unknown Vegetation Or Mixed Vegetation" }, 
{ LC: "All", LUCODE: "000", LC_CAT: "All"},
{ LC: "All (Original Data)", LUCODE: "001", LC_CAT: "All (Original Data)"}
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

async function loadFeaturesToGrid(grid: CategoricalTileGrid, tileRange: TileRange, tileGrid: TileGrid, features: any, map: Map<string, number>) : Promise<CategoricalTileGrid>{
  // given a grid and a set of features, load the features into the grid

  for (let feature of features) {

    const lucode = feature.get("lucode")
    const index = map.get(lucode)

    if (!index) { continue }

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
          grid.set(x, y, index)
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

  const cropcats = new Set<string>()
  cropspecies.forEach(crome => cropcats.add(crome.LC_CAT))
  const arr = Array.from(cropcats)

  const map: Map<string, number> = new Map()
  const mapOG: Map<string, number> = new Map()
  const labelsMap: Map<number, string> = new Map()
  const labelsMapOG: Map<number, string> = new Map()

  cropspecies.forEach((crome) => {
    if (crome.LC_CAT !== "All" && crome.LC_CAT !== "All (Original Data)") {
      
      map.set(crome.LUCODE, arr.findIndex(x => x === crome.LC_CAT) + 1)
      mapOG.set(crome.LUCODE, cropspecies.findIndex(x => x.LUCODE === crome.LUCODE) + 1)

      labelsMap.set(arr.findIndex(x => x === crome.LC_CAT) + 1, crome.LC_CAT)
      labelsMapOG.set(cropspecies.findIndex(x => x.LUCODE === crome.LUCODE) + 1, crome.LC)
    }
  })

  const result = new CategoricalTileGrid(
    zoom,
    outputTileRange.minX,
    outputTileRange.minY,
    outputTileRange.getWidth(),
    outputTileRange.getHeight()
  )

  const resultOG = new CategoricalTileGrid(
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

    await loadFeaturesToGrid(resultOG, outputTileRange, tileGrid, features, mapOG)

    if (features.length < count) break

    startIndex += count
  }

  result.setLabels(labelsMap)
  resultOG.setLabels(labelsMapOG)

  return [result, resultOG]
}

export class CROMEComponent extends BaseComponent {
  categoricalData: CategoricalTileGrid[] | null
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

    const cropcats = new Set<string>()
    cropspecies.forEach(crome => cropcats.add(crome.LC_CAT))

    for (let cropcat of Array.from(cropcats)) {
      node.addOutput(new Output(cropcat, cropcat, cropcat === "All" || cropcat === "All (Original Data)" ? categoricalDataSocket : booleanDataSocket))
    }

  }

  async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {

    if (this.categoricalData === null) {
      this.categoricalData = await renderCategoricalData(this.projectExtent, this.projectZoom)
    }
    const categoricalData = this.categoricalData!

    const cropcats = new Set<string>()
    cropspecies.forEach(crome => cropcats.add(crome.LC_CAT))
    const arr = Array.from(cropcats)

    arr.filter(
      cropcat => node.outputs[cropcat]?.connections.length > 0
    ).forEach(cropcat => {
      if (cropcat === "All") {

        outputs[cropcat] = categoricalData[0]

      } else if (cropcat === "All (Original Data)") {

        outputs[cropcat] = categoricalData[1]

      }else {

            const out = outputs[cropcat] = new BooleanTileGrid(categoricalData[0].zoom, categoricalData[0].x, categoricalData[0].y, categoricalData[0].width, categoricalData[0].height)

            out.name = cropcat
            const k = arr.findIndex(x => x === cropcat) +1 

            categoricalData[0].iterate((x, y, value) => out.set(x, y, value === k))

            this.outputCache.set(cropcat, out)

      }
    })
  }
}