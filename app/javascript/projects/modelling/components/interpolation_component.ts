import { BaseComponent } from "./base_component"
import { Input, Node, Output, Socket } from "rete"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { ProjectProperties } from "."
import { numberSocket, numericDataSocket } from "../socket_types"
import { workerPool } from '../../../modelling/workerPool'
import { maskFromExtentAndShape } from "../bounding_box"
import { NumericTileGrid, TileGridJSON } from "../tile_grid"
import { SelectControl, SelectControlOptions } from "../controls/select"
import { InterpolationType } from "../../../modelling/worker/interpolation"
import { NumericConstant } from "../numeric_constant"
import { isEqual } from "lodash"

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
    cachedInputs: NumericTileGrid[]
    cachedOutputs: Map<string, NumericTileGrid>


    constructor(projectProps : ProjectProperties) {
        super("Interpolation")
        this.category = "Calculations"
        this.projectProps = projectProps
        this.cachedInputs = []
        this.cachedOutputs = new Map()

        // default values
        this.maxdist = 50
        this.p = 2
        this.closest_points = 10
    }

    async builder(node: Node) {

        node.addControl(new SelectControl(this.editor, 'methodId', () => InterpolationMethods, () => {}, 'Method'))

        node.addInput(new Input('input', 'Input', numericDataSocket))
        node.addInput(new Input('maxdist', `Max Distance (default: ${this.maxdist}m)`, numberSocket))
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

        let cacheIdx = this.cachedInputs.findIndex(cachedInput => isEqual(cachedInput.getData(), input.getData()))

        if(cacheIdx === -1) {
            this.cachedInputs.push(input)
            cacheIdx = this.cachedInputs.length - 1
        }else{
            const code = `${cacheIdx}_${method.value}_${maxDist}_${p}_${closest_points}`
            if(this.cachedOutputs.has(code)){
                outputs['output'] = this.cachedOutputs.get(code)
                return
            }
        }

        if(outputs['output'] === undefined) {
            const out = await workerPool.queue(async worker =>
                worker.interpolateGrid(input, mask, method.value, maxDist, p, closest_points)
            )
            this.cachedOutputs.set(`${cacheIdx}_${method.value}_${maxDist}_${p}_${closest_points}`, out)
            outputs['output'] = out
        }
    }

}