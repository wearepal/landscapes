import { createXYZ } from "ol/tilegrid"
import { Node, Output } from "rete"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { booleanDataSocket, categoricalDataSocket } from "../socket_types"
import { BooleanTileGrid, CategoricalTileGrid } from "../tile_grid"
import { BaseComponent } from "./base_component"
import { retrieveModelDataWCS } from "../model_retrieval"
import { TypedArray } from "d3"
import { Extent } from "ol/extent"
import { maskFromExtentAndShape } from "../bounding_box"
import { ProjectProperties } from "."
import { SelectControl } from "../controls/select"

interface DatasetYear{
  id: number
  name: string
  dataset: string
}

const datasetYears: DatasetYear[] = [
  { id: 0, name: "2021", dataset: 'ukceh:gblcm10m2021' },
  { id: 1, name: "2022", dataset: 'ukceh:gblcm2022_10m' },
  { id: 2, name: "2023", dataset: 'ukceh:gblcm2023_10m' }
]

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
  { agg: 0, AC: "All", mode: 0, LC: "All" }
]

async function renderCategoricalData(extent: Extent, zoom: number, maskMode: boolean, maskLayer: string, maskCQL: string, dataset_source: string) {
  // When testing locally, disable CORS in browser settings

  const mask = await maskFromExtentAndShape(extent, zoom, maskLayer, maskCQL, maskMode)

  const tileGrid = createXYZ()
  const outputTileRange = tileGrid.getTileRangeForExtentAndZ(extent, zoom)

  //const geotiff = await retrieveModelDataWCS(extent, 'ukceh:gblcm10m2021', outputTileRange)
  const geotiff = await retrieveModelDataWCS(extent, dataset_source, outputTileRange)

  const rasters = await geotiff.readRasters({ bbox: extent, width: outputTileRange.getWidth(), height: outputTileRange.getHeight() })
  const image = await geotiff.getImage()


  const map: Map<number, string> = new Map()

  habitats.forEach(hab => {
    if (hab.mode !== 0) map.set(hab.mode, hab.LC)
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

    result.set(x, y, mask.get(x,y) ? rasters[0][i] : 255)

  }

  result.setLabels(map)

  return result
}

export class UkcehLandCoverComponent extends BaseComponent {
  categoricalData: Map<string, CategoricalTileGrid>
  outputCache: Map<number, BooleanTileGrid>
  projectExtent: Extent
  zoom: number
  maskMode: boolean
  maskLayer: string
  maskCQL: string

  constructor(projectProps: ProjectProperties) {
    super("UKCEH Land Cover")
    this.category = "Inputs"
    this.categoricalData = new Map()
    this.outputCache = new Map()
    this.projectExtent = projectProps.extent
    this.zoom = projectProps.zoom
    this.maskMode = projectProps.mask
    this.maskLayer = projectProps.maskLayer
    this.maskCQL = projectProps.maskCQL
  }

  async builder(node: Node) {

    node.meta.toolTip = "The UKCEH land cover dataset offers detailed geospatial information on various land cover types across the United Kingdom, aiding environmental research, land management, and policy-making. For more information about this dataset's methodology, applications, and access, visit the UKCEH website [click here for more info]."

    node.meta.toolTipLink = "https://www.ceh.ac.uk/data/ukceh-land-cover-maps"

    if (!("dataset" in node.data)) {
      // set to most recent version of UKCEH
      node.data["dataset"] = datasetYears.length - 1
    }

    node.addControl(
      new SelectControl(this.editor, "dataset", () => datasetYears, () => {}, "Dataset Year")
    )

    habitats.forEach(hab =>
      hab.AC === "All" ? node.addOutput(new Output(hab["mode"].toString(), hab["LC"], categoricalDataSocket)) : node.addOutput(new Output(hab["mode"].toString(), hab["LC"], booleanDataSocket))
    )
  }

  async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {

    const dataset_source = datasetYears[node.data.dataset as number].dataset

    if (!this.categoricalData.has(dataset_source)) {
      this.categoricalData.set(dataset_source, await renderCategoricalData(this.projectExtent, this.zoom, this.maskMode, this.maskLayer, this.maskCQL, dataset_source))
    }
    const categoricalData = this.categoricalData.get(dataset_source)!

    habitats.filter(
      habitat => node.outputs[habitat.mode].connections.length > 0
    ).forEach(habitat => {

      const x = (node.data.dataset as number) * habitats.length + habitat.mode

      if (habitat.mode === 0) {

        outputs[habitat.mode] = this.categoricalData.get(dataset_source)

      } else {
        if (this.outputCache.has(x)) {
          outputs[x] = this.outputCache.get(x)
        }
        else {
          const out = outputs[habitat.mode] = new BooleanTileGrid(categoricalData.zoom, categoricalData.x, categoricalData.y, categoricalData.width, categoricalData.height)
          out.name = habitat.LC

          categoricalData.iterate((x, y, value) => out.set(x, y, value === habitat.mode))

          this.outputCache.set(x, out)
        }
      }
    })
  }
}
