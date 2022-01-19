import { Component, Input, Output } from 'rete'
import { PreviewControl } from '../controls/PreviewControl'
import { BooleanTileGrid } from '../TileGrid'
import { workerPool } from '../workerPool'

export class BinaryOpComponent extends Component {
  constructor(operation, operator, inputSocket, outputSocket, category) {
    super(operation)
    Object.assign(this, {
      operator,
      inputSocket,
      outputSocket,
      category,
      contextMenuName: `${operation} (${operator})`,
    })
  }

  builder(node) {
    node.addControl(new PreviewControl(() => 
      node.meta.output || new BooleanTileGrid(0, 0, 0, 1, 1)
    ))
    node.addInput(new Input('a', 'A', this.inputSocket))
    node.addInput(new Input('b', 'B', this.inputSocket))
    node.addOutput(new Output('out', `A ${this.operator} B`, this.outputSocket))
  }

  async worker(node, inputs, outputs) {
    const editorNode = this.editor.nodes.find(n => n.id === node.id)

    if (inputs['a'][0] === undefined || inputs['b'][0] === undefined) {
      editorNode.meta.errorMessage = 'Not enough inputs'
    }
    else {
      delete editorNode.meta.errorMessage
      editorNode.meta.output = outputs['out'] = await workerPool.queue(async worker => 
        worker.performOperation(this.name, inputs['a'][0], inputs['b'][0])
      )
      outputs['out'].name = node.data.name
      editorNode.controls.get('preview').update()
    }

    editorNode.update()
  }
}
