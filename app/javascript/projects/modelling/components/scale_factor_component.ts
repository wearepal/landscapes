import { BaseComponent } from "./base_component"
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { Input, Node, Output } from 'rete'
import { dataSocket, numberSocket, numericDataSocket } from "../socket_types"
import { BooleanTileGrid, CategoricalTileGrid, NumericTileGrid } from "../tile_grid"
import { SelectControl } from "../controls/select"
import { LabelControl } from "../controls/label"
import { NumericConstant } from "../numeric_constant"
import { getMedianCellSize } from "./cell_area_component"


interface ScaleFactorType {
    name: string
    id: number
    sqMetersPerUnit: number
}

const ScaleFactorTypes: ScaleFactorType[] = [
    {
        name: 'ha',
        id: 0,
        sqMetersPerUnit: 10000
    },
    {
        name: 'km²',
        id: 1,
        sqMetersPerUnit: (1000 * 1000)
    },
    {
        name: 'm²',
        id: 2,
        sqMetersPerUnit: 1
    }
]

export class ScaleFactorComponent extends BaseComponent {

    cache: Map<[number, number], NumericConstant>

    constructor() {
        super("Cell area in")
        this.category = "Calculations"
    }

    async builder(node: Node) {
        node.addInput(new Input('in', 'Input', dataSocket))
        node.addOutput(new Output('out', 'Output', numberSocket))
        node.addControl(new SelectControl(
            this.editor,
            'scaleFactorId',
            () => ScaleFactorTypes,
            () => [],
            'Unit'
        ))
        node.addControl(new LabelControl('summary'))
        this.cache = new Map()
    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {

        const editorNode = this.editor?.nodes.find(n => n.id === node.id)
        if (editorNode === undefined) { return }

        let index = node.data.scaleFactorId as number
        if (!index) index = 0

        const unitPerM = ScaleFactorTypes[index].sqMetersPerUnit

        if (inputs['in'].length > 0) {
            delete editorNode.meta.errorMessage

            const input = inputs['in'][0]

            if (input instanceof BooleanTileGrid || input instanceof NumericTileGrid || input instanceof CategoricalTileGrid) {

                if (this.cache.has([input.zoom, index])) {
                    outputs['out'] = this.cache.get([input.zoom, index])

                } else {

                    const r = getMedianCellSize(input).area / unitPerM

                    const out = outputs['out'] = new NumericConstant(r, editorNode.data.name as string)

                    this.cache.set([input.zoom, index], out)

                    node.data.summary = `${r.toLocaleString()}`

                    const summaryControl: any = editorNode.controls.get('summary')

                    summaryControl.update()
                }



            } else {

                editorNode.meta.errorMessage = 'Numeric constants cannot be assigned to this node'
            }

        } else {
            editorNode.meta.errorMessage = 'No input'
        }



    }


}