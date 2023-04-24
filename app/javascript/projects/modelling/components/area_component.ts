import { Input, Node, Output, Socket } from 'rete'
import { BaseComponent } from './base_component'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { booleanDataSocket, numberSocket } from '../socket_types'
import { LabelControl } from '../controls/label'

export class AreaComponent extends BaseComponent {

    constructor() {
        super('Area')
        this.category = "Calculations"
    }

    async builder(node: Node) {
        node.data.summary = '0 km²'
        node.addInput(new Input('in', 'Set', booleanDataSocket))
        node.addOutput(new Output('out', 'Area', numberSocket))
        node.addControl(new LabelControl('summary'))
    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {

    }

}
