import { Input, Node, Output, Socket } from 'rete'
import { BaseComponent } from './base_component'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { numberSocket } from '../socket_types'
import { BarChartControl, BarChartVariable } from '../controls/barchart'
import { NumericConstant } from '../numeric_constant'

function findUniqueLabel(chartVariables: BarChartVariable[], label: string, count: number): string {

    // Recursively checks for duplicate labels, duplicates are renamed with a counter (ex: name (n))

    const newLabel = count !== 0 ? `${label} (${count})` : label

    if (chartVariables.some(variable => variable.label === newLabel)) return findUniqueLabel(chartVariables, label, count + 1)

    return newLabel
}


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

                let label = v.name === "" ? `[Category ${i + 1}]` : findUniqueLabel(chartVariables, v.name, 0)

                chartVariables.push({
                    label: label,
                    value: v.value
                })
            }

        })

        const barChartControl: any = editorNode.controls.get('bar-chart')

        barChartControl.setTitle(editorNode.data.name)
        barChartControl.setVariables(chartVariables.sort((a, b) => b.value - a.value))

        barChartControl.update()

    }

}