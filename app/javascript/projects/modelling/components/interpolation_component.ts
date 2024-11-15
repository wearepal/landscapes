import { BaseComponent } from "./base_component"
import { Input, Node, Output, Socket } from "rete"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { ProjectProperties } from "."
import { numberSocket, numericDataSocket } from "../socket_types"
import { workerPool } from '../../../modelling/workerPool'
import { maskFromExtentAndShape } from "../bounding_box"
import { NumericTileGrid } from "../tile_grid"
import { SelectControl, SelectControlOptions } from "../controls/select"
import { InterpolationType } from "../../../modelling/worker/interpolation"
import { NumericConstant } from "../numeric_constant"

interface InterpolationMethodOption extends SelectControlOptions {
    value: InterpolationType
}

const InterpolationMethods : InterpolationMethodOption[] = [
    {
        id: 0,
        name: 'Nearest Neighbour',
        value: 'NearestNeighbour'
    },
    {
        id: 1,
        name: "Inverse Distance Weighting",
        value: 'InverseDistanceWeighting'
    }
]

export class InterpolationComponent extends BaseComponent {
    projectProps : ProjectProperties
    maxdist : number
    p : number
    closest_points : number
    cache : Map<number, Map<NumericTileGrid, NumericTileGrid>>

    constructor(projectProps : ProjectProperties) {
        super("Interpolation")
        this.category = "Calculations"
        this.projectProps = projectProps
        this.maxdist = 50
        this.p = 2
        this.closest_points = 10
        this.cache = new Map()
    }

    async builder(node: Node) {

        node.addControl(new SelectControl(this.editor, 'methodId', () => InterpolationMethods, () => {}, 'Method'))

        node.addInput(new Input('input', 'Input', numericDataSocket))
        node.addInput(new Input('maxdist', `Max Distance (default: ${this.maxdist})`, numberSocket))
        node.addInput(new Input('p', `Power (default: ${this.p})`, numberSocket))
        node.addInput(new Input('closest_points', `Closest Points (default: ${this.closest_points})`, numberSocket))


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


        const method = InterpolationMethods[node.data.methodId as number ?? 0]

        const maxDist =  inputs['maxdist'].length > 0 ? (inputs['maxdist'][0] as NumericConstant).value : this.maxdist 
        const p = inputs['p'].length > 0 ? (inputs['p'][0] as NumericConstant).value : this.p 
        const closest_points = inputs['closest_points'].length > 0 ? (inputs['closest_points'][0] as NumericConstant).value : this.closest_points 
        const input = inputs['input'][0] as NumericTileGrid

        // TODO: Caching doesn't work
        if(this.cache.has(maxDist)){
            
            if(this.cache.get(maxDist)?.has(input)){

                outputs['output'] = this.cache.get(maxDist)?.get(input)
                return
            }
        }

        const out = await workerPool.queue(async worker =>
            worker.interpolateGrid(inputs['input'][0], mask, method.value, maxDist, p, closest_points)
        )

        const map = this.cache.get(maxDist) || new Map()
        map.set(input, out)
        this.cache.set(maxDist, map)

        outputs['output'] = out
    }

}