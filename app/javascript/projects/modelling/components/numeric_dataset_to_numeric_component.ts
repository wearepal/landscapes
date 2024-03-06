import { Input, Node, Output } from "rete"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { numberSocket, numericDataSocket } from "../socket_types"
import { NumericTileGrid } from "../tile_grid"
import { BaseComponent } from "./base_component"
import { NumericConstant } from "../numeric_constant"
import { LabelControl } from "../controls/label"
import { sum } from "mathjs"

export class NumericDatasetToNumberComponent extends BaseComponent {
    constructor() {
        super('Numeric dataset to number')
        this.category = 'Conversions'
    }

    async builder(node: Node) {
        node.addInput(new Input('in', 'Numeric dataset', numericDataSocket))
        node.addOutput(new Output('out', 'Number', numberSocket))
        node.addControl(new LabelControl('summary'))
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
        const editorNode = this.editor?.nodes.find(n => n.id === node.id)
        if (editorNode === undefined) { return }

        if (inputs['in'].length === 0) {
            editorNode.meta.errorMessage = 'No input'
        } else {
            const numericInput = inputs['in'][0] as NumericTileGrid

            if (numericInput === editorNode.meta.previousInput) {
                delete editorNode.meta.errorMessage
                outputs['out'] = editorNode.meta.output
            }
            else {

                delete editorNode.meta.errorMessage
                editorNode.meta.previousInput = numericInput



                editorNode.meta.output = outputs['out'] = new NumericConstant(numericInput.getTotal(), undefined)


            }
        }

        if (outputs['out'] instanceof NumericConstant) outputs['out'].name = (editorNode.data.name as string !== undefined && editorNode.data.name as string !== "") ? editorNode.data.name as string : `Untitled data`


        node.data.summary = (editorNode.meta.output as NumericConstant).value.toLocaleString()
        const summaryControl: any = editorNode.controls.get('summary')
        summaryControl.update()

        editorNode.update()
    }
}
