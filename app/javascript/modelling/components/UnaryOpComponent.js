import { Component, Input, Output } from 'rete'
import { PreviewControl } from '../controls/PreviewControl'
import { BooleanTileGrid } from '../TileGrid'
import { workerPool } from '../workerPool'

export class UnaryOpComponent extends Component {
  constructor(operation, operator, affix, inputSocket, outputSocket, category) {
    super(operation)
    Object.assign(this, {
      operator,
      affix,
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

  async worker(node, inputs, outputs) {
    const editorNode = this.editor.nodes.find(n => n.id === node.id)

    if (inputs['a'].length === 0) {
      editorNode.meta.errorMessage = 'No input'
    }
    else {
      delete editorNode.meta.errorMessage
      editorNode.meta.output = outputs['out'] = await workerPool.queue(async worker => 
        worker.performOperation(this.name, inputs['a'][0])
      )
      outputs['out'].name = node.data.name
      editorNode.controls.get('preview').update()
    }

    editorNode.update()
  }
}
