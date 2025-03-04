import { BaseComponent } from "./base_component"
import { Input, Node, Output } from "rete"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { ProjectProperties } from "."
import { numericDataSocket } from "../socket_types"
import { NumericTileGrid } from "../tile_grid"
import { Extent } from "ol/extent"
import { calculateSlope, calculateTWI } from "../../../modelling/worker/twi"

export class SlopeComponent extends BaseComponent {
    projectExtent: Extent
    projectZoom: number
    maskMode: boolean
    maskLayer: string
    maskCQL: string
    cachedData: NumericTileGrid | null

    constructor(projectProps: ProjectProperties) {
        super("Slope")
        this.category = "Arithmetic"
        this.projectExtent = projectProps.extent
        this.projectZoom = projectProps.zoom
        this.maskMode = projectProps.mask
        this.maskLayer = projectProps.maskLayer
        this.maskCQL = projectProps.maskCQL
        this.cachedData = null
    }

    async builder(node: Node) {
        node.addInput(new Input("input", "Elevation model", numericDataSocket))

        node.addOutput(new Output("horn_slope", "Slope (Horn)", numericDataSocket))
        node.addOutput(new Output("zt_slope", "Slope (Zevenbergen Thorne)", numericDataSocket))

        node.addOutput(new Output("twi", "TWI (Topographical Wetness Index)", numericDataSocket))
        
    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {

        const editorNode = this.editor?.nodes.find(n => n.id === node.id)
        if (editorNode === undefined) { return }
            
        const elevation = inputs["input"][0] as NumericTileGrid

        if (!elevation) {
            editorNode.meta.errorMessage = "Elevation model is required!"
            return
        }

        const horn = calculateSlope(elevation, "Horn")

        outputs.horn_slope = horn
    }
}
