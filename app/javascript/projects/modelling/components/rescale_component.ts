import { Input, Node, Output, Socket } from 'rete'
import { BaseComponent } from './base_component'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { booleanDataSocket, numberSocket } from '../socket_types'
import { PreviewControl } from '../controls/preview'
import { BooleanTileGrid } from '../tile_grid'
import { NumericConstant } from '../numeric_constant'
import { currentExtent } from '../bounding_box'


export class RescaleComponent extends BaseComponent {
    constructor() {
        super('Rescale')
        this.category = "Debug tools"
    }

    async builder(node: Node) {

        node.addInput(new Input('in', 'Input', booleanDataSocket))
        node.addInput(new Input('zoom', 'Zoom level', numberSocket))
        node.addOutput(new Output('out', 'Output', booleanDataSocket))
        node.addControl(new PreviewControl(() =>
            node.meta.output as any || new BooleanTileGrid(0, 0, 0, 1, 1)
        ))
    }


    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
        let editorNode = this.editor?.nodes.find(n => n.id === node.id)
        if (editorNode === undefined) { return }


        if (inputs['in'].length === 0 || inputs['zoom'].length === 0) {
            editorNode.meta.errorMessage = 'No input'
        } else {
            delete editorNode.meta.errorMessage

            const zoom = inputs['zoom'][0] as NumericConstant
            const input = inputs['in'][0] as BooleanTileGrid

            outputs['out'] = editorNode.data.output = input.rescale(zoom.value, currentExtent)

        }

        const previewControl: any = editorNode.controls.get('Preview')
        previewControl.update()
        editorNode.update()

    }


}

