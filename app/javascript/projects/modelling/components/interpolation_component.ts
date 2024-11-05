import { BaseComponent } from "./base_component"
import { Input, Node, Output, Socket } from "rete"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { ProjectProperties } from "."
import { numberSocket, numericDataSocket } from "../socket_types"
import { workerPool } from '../../../modelling/workerPool'
import { maskFromExtentAndShape } from "../bounding_box"
import { NumericConstant } from "../numeric_constant"
import { NumericTileGrid } from "../tile_grid"

export class InterpolationComponent extends BaseComponent {
    projectProps : ProjectProperties
    maxdist : number
    cache : Map<number, Map<NumericTileGrid, NumericTileGrid>>

    constructor(projectProps : ProjectProperties) {
        super("Interpolation")
        this.category = "Calculations"
        this.projectProps = projectProps
        this.maxdist = 50
        this.cache = new Map()
    }

    async builder(node: Node) {
        node.addInput(new Input('input', 'Input', numericDataSocket))
        node.addInput(new Input('maxdist', `maxdist (default: ${this.maxdist})`, numberSocket))
        node.addOutput(new Output('output', 'Output', numericDataSocket))
    }
    
    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
        let editorNode = this.editor?.nodes.find(n => n.id === node.id)
        if (editorNode === undefined) { return }


        const mask = await maskFromExtentAndShape(
            this.projectProps.extent, 
            this.projectProps.zoom, 
            this.projectProps.maskLayer, 
            this.projectProps.maskCQL, 
            this.projectProps.mask
        )

        const maxDist = inputs['maxdist'].length > 0 ? (inputs['maxdist'][0] as NumericConstant).value : this.maxdist
        const input = inputs['input'][0] as NumericTileGrid

        // TODO: Caching doesn't work
        if(this.cache.has(maxDist)){
            
            if(this.cache.get(maxDist)?.has(input)){

                outputs['output'] = this.cache.get(maxDist)?.get(input)
                return
            }
        }


        const out = await workerPool.queue(async worker =>
            worker.interpolateGrid(inputs['input'][0], mask, "NearestNeighbour", maxDist)
        )

        const map = this.cache.get(maxDist) || new Map()
        map.set(input, out)
        this.cache.set(maxDist, map)

        outputs['output'] = out
    }

}