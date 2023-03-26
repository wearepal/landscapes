import { Input, Node, Output, Socket } from 'rete'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { PreviewControl } from '../controls/preview'
import { BooleanTileGrid } from '../tile_grid'
import { workerPool } from '../../../modelling/workerPool'
import { BaseComponent } from './base_component'
import { isEqual } from 'lodash'

export class VariadicOpComponent extends BaseComponent {
  operator: string
  inputSocket: Socket
  outputSocket: Socket

  constructor(operation: string, operator: string, inputSocket: Socket, outputSocket: Socket, category: string) {
    super(operation)
    this.operator = operator
    this.inputSocket = inputSocket
    this.outputSocket = outputSocket
    this.category = category
    this.contextMenuName = `${operation} (${operator})`
  }

  async builder(node: Node) {
    node.addControl(new PreviewControl(() =>
      node.meta.output as any || new BooleanTileGrid(0, 0, 0, 1, 1)
    ))
    node.addInput(new Input('in', 'Inputs', this.inputSocket, true))
    node.addOutput(new Output('out', `${this.operator} Inputs`, this.outputSocket))
  }

  async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
    const editorNode = this.editor?.nodes.find(n => n.id === node.id)
    if (editorNode === undefined) { return }

    if (inputs['in'].length < 2) {
      editorNode.meta.errorMessage = 'Not enough inputs'
    }
    else if (isEqual(inputs['in'], editorNode.meta.previousInputs)) {
      delete editorNode.meta.errorMessage
      outputs['out'] = editorNode.meta.output
    }
    else {
      delete editorNode.meta.errorMessage
      editorNode.meta.previousInputs = inputs['in']
      editorNode.meta.output = outputs['out'] = await workerPool.queue(async worker => 
        worker.performOperation(this.name, ...inputs['in'])
      )
      //outputs['out'].name = node.data.name
      const previewControl: any = editorNode.controls.get('Preview')
      previewControl.update()
    }

    editorNode.update()
  }
}
