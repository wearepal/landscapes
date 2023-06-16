import { Node, Output } from "rete"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { BaseComponent } from "./base_component"
import { SelectControl } from "../controls/select"
import { PreviewControl } from "../controls/preview"
import { NumericTileGrid } from "../tile_grid"
import { numericDataSocket } from "../socket_types"
import { createXYZ } from "ol/tilegrid"
import { currentExtent as extent } from "../bounding_box"
import { TypedArray } from "d3"
import { retrieveModelData } from "../model_retrieval"

interface DigitalModel {
    id: number
    name: string
    source: string
    min: number
    max: number
}

//TODO: hardcoded scale factors, find an effective way of retrieving them from the geoserver?
const ModelList: Array<DigitalModel> = [
    {
        id: 0,
        name: 'Digital Surface Model',
        source: 'lidar:116807-4_DSM',
        min: 0,
        max: 259.170013
    },

    {
        id: 1,
        name: 'Digital Terrian Model',
        source: 'lidar:116807-5_DTM',
        min: 0,
        max: 244.979996
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
                const zoom = 20

                const tileGrid = createXYZ()
                const outputTileRange = tileGrid.getTileRangeForExtentAndZ(extent, zoom)

                const geotiff = await retrieveModelData(extent, digitalModel.source, outputTileRange)

                const image = await geotiff.getImage()

                const rasters = await geotiff.readRasters()

                const out = editorNode.meta.output = outputs['dm'] = new NumericTileGrid(zoom, outputTileRange.minX, outputTileRange.minY, outputTileRange.getWidth(), outputTileRange.getHeight())

                const scale = (digitalModel.max - digitalModel.min) / 255

                for (let i = 0; i < (rasters[0] as TypedArray).length; i++) {

                    let x = (outputTileRange.minX + i % image.getWidth())
                    let y = (outputTileRange.minY + Math.floor(i / image.getWidth()))

                    out.set(x, y, rasters[0][i] * scale)

                }

                this.outputCache.set(digitalModel.source, out)

            }
            const previewControl: any = editorNode.controls.get('Preview')
            previewControl.update()
            editorNode.update()
        }

    }

}