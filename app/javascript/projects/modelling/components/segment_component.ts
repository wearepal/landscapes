import { BaseComponent } from "./base_component"
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { Input, Node, Output, Socket } from 'rete'
import { booleanDataSocket, numericDataSocket } from "../socket_types"
import { ProjectProperties } from "."
import { TextControl } from "../controls/text"
import { BooleanTileGrid, NumericTileGrid } from "../tile_grid"
import { createXYZ } from "ol/tilegrid"
import { Point } from "ol/geom"
import { Coordinate } from "ol/coordinate"
import { maskFromExtentAndShape } from "../bounding_box"

async function retrieveSegmentationMasks(prompts: string, det_conf: string, clf_conf: string, n_repeats: string, projectProps: ProjectProperties, mask: BooleanTileGrid,  err: (err: string) => void) : Promise<any[]>{

    const tileGrid = createXYZ()

    const outputTileRange = tileGrid.getTileRangeForExtentAndZ(projectProps.extent, projectProps.zoom)

    const segs = await fetch("https://landscapes.wearepal.ai/api/v1/segment?" + new URLSearchParams(
        {
            labels: prompts,
            det_conf,
            clf_conf,
            n_repeats,
            bbox: projectProps.extent.join(","),
            layer: "rgb:full_mosaic_3857",
            height: outputTileRange.getHeight().toString(),
            width: outputTileRange.getWidth().toString(),
        }
    )).catch((e) => {
        err(e.message == "Failed to fetch" ? "Failed to connect to the server. Please check your internet connection." : e.message)
    })

    if(segs === undefined){
        return []
    }

    if(segs.status !== 200){
        const segsJson = await segs.json()
        const errMsg = segsJson.detail || segsJson.statusText || "Unknown error"
        err(`${errMsg}. If issue persists, please raise an issue on the github repo or contact the developer directly (p.j.crossley@sussex.ac.uk).`)
        return []
    }

    const segsJson = await segs.json()

    const preds = segsJson.predictions

    if(preds === null){
        err("No predictions found")
        return []
    }

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

            const maskV = mask.get(featureTileRange.maxX, featureTileRange.minY)
            result.set(featureTileRange.maxX, featureTileRange.minY, maskV)
            confBox.set(featureTileRange.maxX, featureTileRange.minY, maskV ? pred.confidence : NaN)
        })

        const predBox = pred.box
        const predExtent = [predBox.xmin, predBox.ymin, predBox.xmax, predBox.ymax]

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
    cache: Map<string, any[]>
    projectProps: ProjectProperties

    constructor(projectProps: ProjectProperties) {
        super("AI Model")
        this.category = "Inputs"
        this.projectProps = projectProps
        this.cache = new Map<string, any[]>()
    }

    async builder(node: Node) {

        node.meta.toolTip = "This node takes in 4 inputs: a prompt, a detector confidence, "
        +"a classifier confidence, and the number of repeats. It then returns a segmentation mask, a detection box, "
        +"and a confidence value. The prompt is the object you want to segment, detector confidence is the confidence "
        +"threshold for the detector (it is recommended that this is set low for high recall), classifier confidence is "
        +"the confidence threshold for the classifier (it is recommendeded that this is set higher for increased accuracy."
        +" please note: setting this to 0 will disable this function), and the number of repeats is the number of times you want to repeat the segmentation process. (must be a value higher than 0)."

        // Retrieve default values from the server
        const defaultData = await fetch ("https://landscapes.wearepal.ai/api/settings").then((res) => res.json())

        if (!('det_conf' in node.data)) {
            node.data.det_conf = defaultData.det_conf_default ?  defaultData.det_conf_default.toString() : "5.0"
        }     

        if (!('cls_conf' in node.data)) {
            node.data.cls_conf = defaultData.clf_conf_default ?  defaultData.clf_conf_default.toString() : "0"
        }

        if (!('n_repeats' in node.data)) {
            node.data.n_repeats = defaultData.n_repeats_default ?  defaultData.n_repeats_default.toString() : "1"
        }

        if (!('prompt' in node.data)) {
            node.data.prompt = "trees"
        }

        node.addOutput(new Output('mask', 'Segmentation Mask', booleanDataSocket))
        node.addOutput(new Output('conf', 'Confidence', numericDataSocket))
        node.addOutput(new Output('box', 'Detection Box', booleanDataSocket))

        node.addControl(new TextControl(this.editor, 'prompt', 'Prompt', '500px'))
        node.addControl(new TextControl(this.editor, 'det_conf', 'Detector Confidence (%)', '100px'))
        node.addControl(new TextControl(this.editor, 'cls_conf', 'Classifier Confidence (%)', '100px'))
        node.addControl(new TextControl(this.editor, 'n_repeats', 'Repeats', '100px'))

    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {

        const editorNode = this.editor?.nodes.find(n => n.id === node.id)
        if (editorNode === undefined) { return }

        const prompts = node.data.prompt as string
        const det_conf = node.data.det_conf as string
        const cls_conf = node.data.cls_conf as string
        const n_repeats = node.data.n_repeats as string
        const mask = await maskFromExtentAndShape(
            this.projectProps.extent, 
            this.projectProps.zoom, 
            this.projectProps.maskLayer, 
            this.projectProps.maskCQL, 
            this.projectProps.mask
        )

        if (this.cache.has(`${prompts}_${cls_conf}%${det_conf}%${n_repeats}`)) {
            const result = this.cache.get(`${prompts}_${cls_conf}%${det_conf}%${n_repeats}`)!
            outputs['mask'] = result[0]
            outputs['box'] = result[1]
            outputs['conf'] = result[2]
        }else{
            let nodeErr = ""
            const result = await retrieveSegmentationMasks(prompts, det_conf, cls_conf, n_repeats, this.projectProps, mask, (err) => {
                nodeErr = err
            })
            if (result.length === 0) {
                editorNode.meta.errorMessage = nodeErr
                editorNode.update()
            }else{
                delete editorNode.meta.errorMessage
                this.cache.set(`${prompts}_${cls_conf}%${det_conf}%${n_repeats}`, result)
                outputs['mask'] = result[0]
                outputs['box'] = result[1]
                outputs['conf'] = result[2]
                editorNode.update()
            }
        }

    }
}
