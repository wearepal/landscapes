import { Node, Output } from "rete"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { BaseComponent } from "./base_component"
import { SelectControl } from "../controls/select"
import { PreviewControl } from "../controls/preview"
import { NumericTileGrid } from "../tile_grid"
import { numericDataSocket } from "../socket_types"
import { fromArrayBuffer } from "geotiff"
import { createXYZ } from "ol/tilegrid"
import { currentExtent as extent } from "../bounding_box"
import { TypedArray } from "d3"

interface DigitalModel {
    id: number
    name: string
    source: string
}

const ModelList: Array<DigitalModel> = [
    {
        id: 0,
        name: 'Digital Surface Model',
        source: 'lidar:116807-4_DSM'
    },
    {
        id: 1,
        name: 'Digital Terrian Model',
        source: 'lidar:116807-5_DTM'
    }
]


async function retrieveModelData(extent: any, source: string, tileRange: any) {

    const geoserver = "https://landscapes.wearepal.ai/geoserver/wms?"
    const [width, height] = [tileRange.getWidth(), tileRange.getHeight()]
    const bbox = `${extent.join(",")},EPSG:3857`

    const response = await fetch(
        geoserver +
        new URLSearchParams(
            {
                service: 'WMS',
                version: '1.3.0',
                request: 'GetMap',
                layers: source,
                styles: '',
                format: 'image/geotiff',
                transparent: 'true',
                width,
                height,
                crs: 'EPSG:3857',
                bbox
            }
        )
    )

    const arrayBuffer = await response.arrayBuffer()
    const tiff = await fromArrayBuffer(arrayBuffer)


    return tiff

}

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

        let digitalModel = ModelList.find(a => a.id == index)?.source

        if (digitalModel) {

            if (this.outputCache.has(digitalModel)) {
                const out = editorNode.meta.output = outputs['dm'] = this.outputCache.get(digitalModel)
            } else {
                const zoom = 20

                const tileGrid = createXYZ()
                const outputTileRange = tileGrid.getTileRangeForExtentAndZ(extent, zoom)

                const geotiff = await retrieveModelData(extent, digitalModel, outputTileRange)

                const image = await geotiff.getImage()

                const rasters = await geotiff.readRasters()

                const out = editorNode.meta.output = outputs['dm'] = new NumericTileGrid(zoom, outputTileRange.minX, outputTileRange.minY, outputTileRange.getWidth(), outputTileRange.getHeight())

                for (let i = 0; i < (rasters[0] as TypedArray).length; i++) {

                    let x = (outputTileRange.minX + i % image.getWidth())
                    let y = (outputTileRange.minY + Math.floor(i / image.getWidth()))

                    out.set(x, y, rasters[0][i])

                }

                this.outputCache.set(digitalModel, out)

            }
            const previewControl: any = editorNode.controls.get('Preview')
            previewControl.update()
            editorNode.update()
        }

    }

}