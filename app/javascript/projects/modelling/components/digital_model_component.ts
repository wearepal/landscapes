import { Node, Output } from "rete"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { BaseComponent } from "./base_component"
import { SelectControl } from "../controls/select"
import { PreviewControl } from "../controls/preview"
import { NumericTileGrid } from "../tile_grid"
import { numericDataSocket } from "../socket_types"
import { createXYZ } from "ol/tilegrid"
import { currentExtent as extent, zoomLevel } from "../bounding_box"
import { TypedArray } from "d3"
import { retrieveModelData, retrieveModelDataWCS } from "../model_retrieval"

interface DigitalModel {
    id: number
    name: string
    source: string
}

//TODO: hardcoded scale factors, find an effective way of retrieving them from the geoserver?
const ModelList: Array<DigitalModel> = [
    {
        id: 0,
        name: 'Digital Surface Model',
        source: 'lidar:DSM_2m'
    },
    {
        id: 1,
        name: 'Digital Terrian Model',
        source: 'lidar:DTM_5m'
    },
    {
        id: 2,
        name: 'Feature Height',
        source: 'lidar:Depth'
    }
]

export class DigitalModelComponent extends BaseComponent {
    outputCache: Map<string, NumericTileGrid>

    constructor() {
        super("Digital Model")
        this.category = "Inputs"
        this.outputCache = new Map()
    }

    async builder(node: Node) {

        node.meta.toolTip = "Component is still in testing phase! This component uses LIDAR data (Digital Surface and Terrian Models) to generate a numeric dataset. Coverage is limited, areas with missing data will be set to 0."


        node.addControl(
            new SelectControl(
                this.editor,
                'sourceId',
                () => ModelList,
                () => [],
                'Model'
            )
        )

        node.addControl(new PreviewControl(() =>
            node.meta.output as any || new NumericTileGrid(0, 0, 0, 1, 1)
        ))

        node.addOutput(new Output('dm', 'Output', numericDataSocket))


    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {

        const editorNode = this.editor?.nodes.find(n => n.id === node.id)
        if (editorNode === undefined) { return }

        let index = node.data.sourceId
        if (index === undefined) { index = 0 }

        let digitalModel = ModelList.find(a => a.id == index)

        if (digitalModel?.source) {

            if (this.outputCache.has(digitalModel.source)) {
                const out = editorNode.meta.output = outputs['dm'] = this.outputCache.get(digitalModel.source)
            } else {
                const zoom = zoomLevel

                const tileGrid = createXYZ()
                const outputTileRange = tileGrid.getTileRangeForExtentAndZ(extent, zoom)

                const geotiff = await retrieveModelDataWCS(extent, digitalModel.source, outputTileRange)

                const image = await geotiff.getImage()

                const rasters = await image.readRasters()
                const { width, [0]: raster } = rasters

                const out = editorNode.meta.output = outputs['dm'] = new NumericTileGrid(zoom, outputTileRange.minX, outputTileRange.minY, outputTileRange.getWidth(), outputTileRange.getHeight())



                for (let i = 0; i < (raster as TypedArray).length; i++) {

                    let x = (outputTileRange.minX + i % image.getWidth())
                    let y = (outputTileRange.minY + Math.floor(i / image.getWidth()))

                    out.set(x, y, (raster[i]) === -32767 ? 0 : (raster[i]))

                }

                this.outputCache.set(digitalModel.source, out)

            }
            const previewControl: any = editorNode.controls.get('Preview')
            previewControl.update()
            editorNode.update()
        }

    }

}