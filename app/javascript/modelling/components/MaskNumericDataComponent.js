import { Component, Input, Output } from 'rete'
import { PreviewControl } from '../controls/PreviewControl'
import { NumericTileGrid } from '../../projects/modelling/tile_grid'
import { setSocket, mapSocket } from '../sockets'

export class MaskNumericDataComponent extends Component{

    constructor() {
        super("Mask numeric data")
        this.category = 'Arithmetic'
      }

      builder(node) {
        node.addControl(new PreviewControl(() => 
          node.meta.output || new NumericTileGrid(0, 0, 0, 1, 1)
        ))
        node.addInput(new Input('num', 'Numeric', mapSocket))
        node.addInput(new Input('mask', 'Mask', setSocket))
        node.addOutput(new Output('out', 'Masked layer', mapSocket))
      }
      
      
  worker(node, inputs, outputs) {
    const editorNode = this.editor.nodes.find(n => n.id === node.id)

    const num = inputs['num'][0]
    const mask = inputs['mask'][0]

    if (num === undefined || mask === undefined) {
      editorNode.meta.errorMessage = 'Not enough inputs'
    }
    else {
      delete editorNode.meta.errorMessage

      const out = editorNode.meta.output = outputs['out'] = new NumericTileGrid(mask.zoom, mask.x, mask.y, mask.width, mask.height, mask.labelSchema)
      for (let x = mask.x; x < mask.x + mask.width; ++x) {
        for (let y = mask.y; y < mask.y + mask.height; ++y) {
          out.set(x, y, mask.get(x, y) ? num.data[0] : 0)
        }
      }

      out.name = node.data.name || 'Masked layer'

      editorNode.controls.get('preview').update()
    }

    editorNode.update()
  }

}
