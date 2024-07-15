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

interface Habitat {
    agg: number
    AC: string
    mode: number
    LC: string
}

const habitats: Habitat[] = [
    //TODO : move to a json or an alternative storage
    { agg: 0, AC: "All", mode: 0, LC: "All" },
    { agg: 1, AC: "Hedge", mode: 1, LC: "Hedge" },
    { agg: 2, AC: "Tree", mode: 2, LC: "Tree" }
]

async function renderCategoricalData(extent: Extent, zoom: number, maskMode: boolean, maskLayer: string, maskCQL: string) {
    // When testing locally, disable CORS in browser settings

    const mask = await maskFromExtentAndShape(extent, zoom, maskLayer, maskCQL, maskMode)

    const tileGrid = createXYZ()
    const outputTileRange = tileGrid.getTileRangeForExtentAndZ(extent, zoom)

    const geotiff = await retrieveModelDataWCS(extent, 'ml:tree_hedge_predictions', outputTileRange)

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

        result.set(x, y, mask.get(x, y) === true ? rasters[0][i] : 255)

    }

    result.setLabels(map)

    return result
}

export class MlTreeHedgeComponent extends BaseComponent {
    categoricalData: CategoricalTileGrid | null
    outputCache: Map<number, BooleanTileGrid>
    projectExtent: Extent
    zoom: number
    maskMode: boolean
    maskLayer: string
    maskCQL: string

    constructor(projectProps: ProjectProperties) {
        super("ML Model Output")
        this.category = "Inputs"
        this.categoricalData = null
        this.outputCache = new Map()
        this.projectExtent = projectProps.extent
        this.zoom = projectProps.zoom
        this.maskMode = projectProps.mask
        this.maskLayer = projectProps.maskLayer
        this.maskCQL = projectProps.maskCQL
    }

    async builder(node: Node) {

        node.meta.toolTip = "Custom ML outputs."

        node.meta.toolTipLink = "https://www.wearepal.ai/lmt.html"

        habitats.forEach(hab =>
            hab.AC === "All" ? node.addOutput(new Output(hab["mode"].toString(), hab["LC"], categoricalDataSocket)) : node.addOutput(new Output(hab["mode"].toString(), hab["LC"], booleanDataSocket))
        )
    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
        if (this.categoricalData === null) {
            this.categoricalData = await renderCategoricalData(this.projectExtent, this.zoom, this.maskMode, this.maskLayer, this.maskCQL)
        }
        const categoricalData = this.categoricalData!

        habitats.filter(
            habitat => node.outputs[habitat.mode].connections.length > 0
        ).forEach(habitat => {
            if (habitat.mode === 0) {

                outputs[habitat.mode] = this.categoricalData

            } else {
                if (this.outputCache.has(habitat.mode)) {
                    outputs[habitat.mode] = this.outputCache.get(habitat.mode)
                }
                else {
                    const out = outputs[habitat.mode] = new BooleanTileGrid(categoricalData.zoom, categoricalData.x, categoricalData.y, categoricalData.width, categoricalData.height)
                    out.name = habitat.LC

                    categoricalData.iterate((x, y, value) => out.set(x, y, value === habitat.mode))

                    this.outputCache.set(habitat.mode, out)
                }
            }
        })
    }
}
