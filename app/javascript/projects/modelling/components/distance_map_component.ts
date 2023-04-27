import { Input, Node, Output, Socket } from 'rete'
import { BaseComponent } from './base_component'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { PreviewControl } from '../controls/preview'
import { NumericTileGrid } from '../tile_grid'
import { booleanDataSocket, numericDataSocket } from '../socket_types'
import { workerPool } from '../../../modelling/workerPool'


export class DistanceMapComponent extends BaseComponent {

    constructor() {
        super('Distance map')
        this.category = "Calculations"
    }

    async builder(node: Node) {
        node.addControl(new PreviewControl(() =>
            node.meta.output as any || new NumericTileGrid(0, 0, 0, 1, 1)
        ))
        node.addInput(new Input('in', 'Input', booleanDataSocket))
        node.addOutput(new Output('out', 'Distance Map', numericDataSocket))
    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
        let editorNode = this.editor?.nodes.find(n => n.id === node.id)
        if (editorNode === undefined) { return }

        if (inputs['in'].length === 0) {
            editorNode.meta.errorMessage = 'No input'
        } else {
            delete editorNode.meta.errorMessage

            if (inputs['in'][0] === editorNode.meta.previousInput) {
                outputs['out'] = editorNode.meta.output
            } else {
                editorNode.meta.previousInput = inputs['in'][0]
                editorNode.meta.output = outputs['out'] = await workerPool.queue(async worker =>
                    worker.generateDistanceMap(inputs['in'][0])
                )
            }
        }

        const previewControl: any = editorNode.controls.get('Preview')
        previewControl.update()
        editorNode.update()
    }

}