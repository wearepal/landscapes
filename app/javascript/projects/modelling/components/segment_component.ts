import { BaseComponent } from "./base_component"
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { Input, Node, Output, Socket } from 'rete'
import { booleanDataSocket, numericDataSocket } from "../socket_types"
import { ProjectProperties } from "."
import { TextControl } from "../controls/text"
import { BooleanTileGrid, NumericTileGrid } from "../tile_grid"
import { createXYZ } from "ol/tilegrid"
import { Point, Polygon } from "ol/geom"
import { Coordinate } from "ol/coordinate"

async function retrieveSegmentationMasks(prompts: string, threshold: string, projectProps: ProjectProperties) : Promise<any[]>{

    const tileGrid = createXYZ()

    const outputTileRange = tileGrid.getTileRangeForExtentAndZ(projectProps.extent, projectProps.zoom)

    const segs = await fetch("https://landscapes.wearepal.ai/api/v1/segment?" + new URLSearchParams(
        {
            labels: prompts,
            threshold,
            bbox: projectProps.extent.join(","),
            layer: "rgb:full_mosaic_3857",
            height: outputTileRange.getHeight().toString(),
            width: outputTileRange.getWidth().toString(),
        }
    ))

    const segsJson = await segs.json()

    const preds = segsJson.predictions

    const result  = new BooleanTileGrid(
        projectProps.zoom,
        outputTileRange.minX,
        outputTileRange.minY,
        outputTileRange.getWidth(),
        outputTileRange.getHeight()
    )

    const box = new BooleanTileGrid(
        projectProps.zoom,
        outputTileRange.minX,
        outputTileRange.minY,
        outputTileRange.getWidth(),
        outputTileRange.getHeight()
    )

    const confBox = new NumericTileGrid(
        projectProps.zoom,
        outputTileRange.minX,
        outputTileRange.minY,
        outputTileRange.getWidth(),
        outputTileRange.getHeight()
    )

    preds.forEach((pred: any) => {

        const predMask = pred.mask

        predMask.forEach((coord : Coordinate) => {

            const p = new Point(coord)

            const featureTileRange = tileGrid.getTileRangeForExtentAndZ(
                p.getExtent(),
                projectProps.zoom
            )

            result.set(featureTileRange.maxX, featureTileRange.minY, true)
            confBox.set(featureTileRange.maxX, featureTileRange.minY, pred.score)
        })

        const predBox = pred.box
        const predExtent = [Math.min(predBox.xmin, predBox.xmin), Math.min(predBox.ymin, predBox.ymax), Math.max(predBox.xmin, predBox.xmax), Math.max(predBox.ymin, predBox.ymax)]

        const featureTileRange = tileGrid.getTileRangeForExtentAndZ(
            predExtent,
            projectProps.zoom
        )

        box.iterate((x, y) => {
            if (featureTileRange.containsXY(x, y)) {
                box.set(x, y, true)
            }
        })

    })

    return [result, box, confBox]
}

export class SegmentComponent extends BaseComponent {
    projectProps: ProjectProperties

    constructor(projectProps: ProjectProperties) {
        super("Segmentation Model")
        this.category = "Inputs"
        this.projectProps = projectProps
    }

    async builder(node: Node) {

        if (!('threshold' in node.data)) {
            node.data.threshold = "0.1"
        }

        if (!('prompt' in node.data)) {
            node.data.prompt = "trees"
        }

        node.addOutput(new Output('mask', 'Segmentation Mask', booleanDataSocket))
        node.addOutput(new Output('conf', 'Segmentation Mask (Confidence)', numericDataSocket))
        node.addOutput(new Output('box', 'Segmentation Box', booleanDataSocket))

        node.addControl(new TextControl(this.editor, 'prompt', 'Prompt'))
        node.addControl(new TextControl(this.editor, 'threshold', 'Threshold'))

    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {

        const editorNode = this.editor?.nodes.find(n => n.id === node.id)
        if (editorNode === undefined) { return }

        const prompts = node.data.prompt as string
        const threshold = node.data.threshold as string

        const result = await retrieveSegmentationMasks(prompts, threshold, this.projectProps)

        outputs['mask'] = result[0]
        outputs['box'] = result[1]
        outputs['conf'] = result[2]

    }
}