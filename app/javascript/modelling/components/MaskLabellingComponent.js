import { Component, Input, Output } from 'rete'
import { PreviewControl } from '../controls/PreviewControl'
import { BooleanTileGrid, LabelledTileGrid } from '../TileGrid'
import { layerSocket, setSocket } from '../sockets'

export class MaskLabellingComponent extends Component {
  constructor() {
    super("Mask labelling layer")
    this.category = 'Labellings'
  }

  builder(node) {
    node.addControl(new PreviewControl(() => 
      node.meta.output || new BooleanTileGrid(0, 0, 0, 1, 1)
    ))
    node.addInput(new Input('labelling', 'Layer', layerSocket))
    node.addInput(new Input('mask', 'Mask', setSocket))
    node.addOutput(new Output('out', 'Masked layer', layerSocket))
  }

  worker(node, inputs, outputs) {
    const editorNode = this.editor.nodes.find(n => n.id === node.id)

    const labelling = inputs['labelling'][0]
    const mask = inputs['mask'][0]

    if (labelling === undefined || mask === undefined) {
      editorNode.meta.errorMessage = 'Not enough inputs'
    }
    else if (mask.zoom > labelling.zoom) {
      editorNode.meta.errorMessage = `Mask zoom level (${mask.zoom}) must not exceed labelling zoom level (${labelling.zoom})`
    }
    else {
      delete editorNode.meta.errorMessage

      const out = editorNode.meta.output = outputs['out'] = new LabelledTileGrid(labelling.zoom, labelling.x, labelling.y, labelling.width, labelling.height, labelling.labelSchema)
      for (let x = labelling.x; x < labelling.x + labelling.width; ++x) {
        for (let y = labelling.y; y < labelling.y + labelling.height; ++y) {
          out.set(x, y, mask.get(x, y, labelling.zoom) ? labelling.get(x, y) : 255)
        }
      }
      out.name = node.data.name || 'Masked layer'
      editorNode.controls.get('preview').update()
    }

    editorNode.update()
  }
}
