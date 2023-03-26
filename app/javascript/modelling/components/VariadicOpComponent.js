import { Component, Input, Output } from 'rete'
import { PreviewControl } from '../controls/PreviewControl'
import { BooleanTileGrid } from "../../projects/modelling/tile_grid"
import { workerPool } from '../workerPool'

export class VariadicOpComponent extends Component {
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
    node.addInput(new Input('in', 'Inputs', this.inputSocket, true))
    node.addOutput(new Output('out', `${this.operator} Inputs`, this.outputSocket))
  }

  async worker(node, inputs, outputs) {
    const editorNode = this.editor.nodes.find(n => n.id === node.id)

    if (inputs['in'].length < 2) {
      editorNode.meta.errorMessage = 'Not enough inputs'
    }
    else {
      delete editorNode.meta.errorMessage
      editorNode.meta.output = outputs['out'] = await workerPool.queue(async worker => 
        worker.performOperation(this.name, ...inputs['in'])
      )
      outputs['out'].name = node.data.name
      editorNode.controls.get('preview').update()
    }

    editorNode.update()
  }
}
