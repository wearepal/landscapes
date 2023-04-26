import { Input, Node, Output, Socket } from 'rete'
import { BaseComponent } from './base_component'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { numberSocket } from '../socket_types'
import { BarChartControl, BarChartVariable } from '../controls/barchart'
import { NumericConstant } from '../numeric_constant'
import { string } from 'prop-types'

export class BarChartComponent extends BaseComponent {

    constructor() {
        super('Bar chart')
        this.category = 'Charts'
    }

    async builder(node: Node) {

        node.addInput(new Input('in', 'Values', numberSocket, true))

        node.addControl(new BarChartControl('bar-chart'))
    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {

        const editorNode = this.editor?.nodes.find(n => n.id === node.id)
        if (editorNode === undefined) { return }


        const chartVariables: BarChartVariable[] = []


        inputs['in'].forEach((v, i) => {
            if (v instanceof NumericConstant) {

                const label = v.name === "" ? `[Category ${i + 1}]` : v.name

                chartVariables.push({
                    label: label,
                    value: v.value
                })
            }

        })

        const barChartControl: any = editorNode.controls.get('bar-chart')

        barChartControl.setTitle(editorNode.data.name)
        barChartControl.setVariables(chartVariables)

        barChartControl.update()

    }

}