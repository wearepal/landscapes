import { Input, Node, Output, Socket } from 'rete'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { PreviewControl } from '../controls/preview'
import { BooleanTileGrid } from '../tile_grid'
import { workerPool } from '../../../modelling/workerPool'
import { BaseComponent } from './base_component'

type Affix = 'prefix' | 'postfix'

export class UnaryOpComponent extends BaseComponent {
  operator: string
  operation: string
  affix: Affix
  inputSocket: Socket
  outputSocket: Socket

  constructor(operation: string, operator: string, affix: Affix, inputSocket: Socket, outputSocket: Socket, category: string) {
    super(operation)
    this.operator = operator
    this.operation = operation
    this.affix = affix
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
    node.addOutput(new Output(
      'out',
      (() => {
        switch (this.affix) {
          case 'prefix':
            return `${this.operator}A`
          case 'postfix':
            return `A${this.operator}`
        }
      })(),
      this.outputSocket
    ))
  }

  async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
    const editorNode = this.editor?.nodes.find(n => n.id === node.id)
    if (editorNode === undefined) { return }

    if (inputs['a'].length === 0) {
      editorNode.meta.errorMessage = 'No input'
    }
    else if (inputs['a'][0] === editorNode.meta.previousInput) {
      delete editorNode.meta.errorMessage
      outputs['out'] = editorNode.meta.output

    }
    else {
      delete editorNode.meta.errorMessage
      editorNode.meta.previousInput = inputs['a'][0]
      editorNode.meta.output = outputs['out'] = await workerPool.queue(async worker =>
        worker.performOperation(this.name, inputs['a'][0])
      )

    }

    if (outputs['out'] instanceof BooleanTileGrid) outputs['out'].name = (editorNode.data.name as string !== undefined && editorNode.data.name as string !== "") ? editorNode.data.name as string : `${this.operation} data`

    const previewControl: any = editorNode.controls.get('Preview')
    previewControl.update()
    editorNode.update()
  }
}
