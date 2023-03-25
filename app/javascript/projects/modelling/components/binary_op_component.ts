import { Input, Node, Output, Socket } from 'rete'
import { BooleanTileGrid } from '../tile_grid'
import { workerPool } from '../../../modelling/workerPool'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { BaseComponent } from './base_component'
import { PreviewControl } from '../controls/preview'
import { isEqual } from 'lodash'

export class BinaryOpComponent extends BaseComponent {
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
    node.addInput(new Input('a', 'A', this.inputSocket))
    node.addInput(new Input('b', 'B', this.inputSocket))
    node.addOutput(new Output('out', `A ${this.operator} B`, this.outputSocket))
  }

  async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
    const editorNode = this.editor?.nodes.find(n => n.id === node.id)
    if (editorNode === undefined) { return }

    if (inputs['a'][0] === undefined || inputs['b'][0] === undefined) {
      editorNode.meta.errorMessage = 'Not enough inputs'
    }
    else if (isEqual([inputs['a'][0], inputs['b'][0]], editorNode.meta.previousInputs)) {
      outputs['out'] = editorNode.meta.output
    }
    else {
      delete editorNode.meta.errorMessage
      editorNode.meta.previousInputs = [inputs['a'][0], inputs['b'][0]]
      editorNode.meta.output = outputs['out'] = await workerPool.queue(async worker => 
        worker.performOperation(this.name, inputs['a'][0], inputs['b'][0])
      )
      //outputs['out'].name = node.data.name
      const previewControl: any = editorNode.controls.get('preview')
      previewControl.update()
    }

    editorNode.update()
  }
}
