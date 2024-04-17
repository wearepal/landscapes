import { Extent } from "ol/extent";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { BaseComponent } from "./base_component"
import { Node, Output, Socket } from "rete"
import { booleanDataSocket, categoricalDataSocket } from "../socket_types";
import { createXYZ } from "ol/tilegrid";
import { retrieveModelData } from "../model_retrieval";
import { BooleanTileGrid } from "../tile_grid";
import { TypedArray } from "d3";

interface OutputData {
    name: string
    prettyName: string
    socket: Socket
    layer: string
    fn?: (extent: Extent, zoom: number, type: string, layer: string) => Promise<BooleanTileGrid>
}

const OutputDatas : OutputData[] = [
    { 
        name: "Paths", 
        prettyName: "Paths", 
        socket: booleanDataSocket, 
        layer: "ORVAL:paths_england",
        fn: retrievePathData 
    }
]

async function retrievePathData(extent: Extent, zoom: number, type: string, layer: string) {
    const tileGrid = createXYZ()
    const outputTileRange = tileGrid.getTileRangeForExtentAndZ(extent, zoom)

    const geotiff = await retrieveModelData(extent, layer, outputTileRange)

    const rasters = await geotiff.readRasters({ bbox: extent, width: outputTileRange.getWidth(), height: outputTileRange.getHeight() })
    const image = await geotiff.getImage()

    const result = new BooleanTileGrid(
        zoom,
        outputTileRange.minX,
        outputTileRange.minY,
        outputTileRange.getWidth(),
        outputTileRange.getHeight()
    )

    for (let i = 0; i < (rasters[0] as TypedArray).length; i++) {

        let x = (outputTileRange.minX + i % image.getWidth())
        let y = (outputTileRange.minY + Math.floor(i / image.getWidth()))

        result.set(x, y, !rasters[0][i])

    }

    return result
}

export class ORValComponent extends BaseComponent {
    projectExtent: Extent
    projectZoom: number

    constructor(projectExtent: Extent, projectZoom: number) {
        super("ORVal")
        this.category = "Inputs"
        this.projectExtent = projectExtent
        this.projectZoom = projectZoom
    }

    async builder(node: Node) {
        OutputDatas.forEach(outputData => node.addOutput(new Output(outputData.name, outputData.prettyName, outputData.socket)))
    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {

        const editorNode = this.editor?.nodes.find(n => n.id === node.id)
        if (editorNode === undefined) { return }

        const promises = OutputDatas.filter(d => node.outputs[d.name].connections.length > 0)
            .map(d => {
                if (d.fn) {
                    return d.fn(this.projectExtent, this.projectZoom, d.name, d.layer)
                        .then(data => {
                            outputs[d.name] = data;
                        })
                }
                return null
        })

        await Promise.all(promises)

        editorNode.update()

    }

}