import { Component, Input, Output } from 'rete'
import { PreviewControl } from '../controls/PreviewControl'
import { setSocket, mapSocket } from '../sockets'
import { NumericTileGrid } from '../../projects/modelling/tile_grid'
import { workerPool } from '../workerPool'

export class DistanceMapComponent extends Component {
  constructor() {
    super('Distance map')
  }

  builder(node) {
    node.addControl(new PreviewControl(() => 
      node.meta.output || new NumericTileGrid(0, 0, 0, 1, 1)
    ))
    node.addInput(new Input('in', setSocket.name, setSocket))
    node.addOutput(new Output('out', this.name, mapSocket))
  }

  async worker(node, inputs, outputs) {
    const editorNode = this.editor.nodes.find(n => n.id === node.id)

    if (inputs['in'].length === 0) {
      editorNode.meta.errorMessage = 'No input'
    }
    else {
      delete editorNode.meta.errorMessage
      editorNode.meta.output = outputs['out'] = await workerPool.queue(async worker => 
        worker.generateDistanceMap(inputs['in'][0])
      )
      outputs['out'].name = node.data.name
      editorNode.controls.get('preview').update()
    }

    editorNode.update()
  }
}
