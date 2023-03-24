import { Component, Input, Node, Output, Socket } from 'rete'
import { BooleanTileGrid } from '../tile_grid'
import { workerPool } from '../../../modelling/workerPool'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { BaseComponent } from './base_component'
import { PreviewControl } from '../controls/preview'

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
      node.meta.output instanceof BooleanTileGrid ? node.meta.output : new BooleanTileGrid(0, 0, 0, 1, 1)
    ))
    node.addInput(new Input('a', 'A', this.inputSocket))
    node.addInput(new Input('b', 'B', this.inputSocket))
    node.addOutput(new Output('out', `A ${this.operator} B`, this.outputSocket))
  }

  async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
    console.log("binary op worker")
    const editorNode = this.editor?.nodes.find(n => n.id === node.id)
    if (editorNode === undefined) { return }

    if (inputs['a'][0] === undefined || inputs['b'][0] === undefined) {
      editorNode.meta.errorMessage = 'Not enough inputs'
    }
    else {
      delete editorNode.meta.errorMessage
      editorNode.meta.output = outputs['out'] = await workerPool.queue(async worker => 
        worker.performOperation(this.name, inputs['a'][0], inputs['b'][0])
      )
      //outputs['out'].name = node.data.name
      const control = editorNode.controls.get('preview') as any
      console.log(control)
      control.update()
    }

    editorNode.update()
  }
}
