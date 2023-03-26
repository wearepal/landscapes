import { isEqual } from 'lodash'
import { Input, Node, Output } from 'rete'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { PreviewControl } from '../controls/preview'
import { booleanDataSocket, numericDataSocket } from '../socketTypes'
import { BooleanTileGrid, NumericTileGrid } from '../tile_grid'
import { BaseComponent } from './base_component'

export class MaskNumericDataComponent extends BaseComponent {
  constructor() {
    super("Mask numeric data")
    this.category = 'Arithmetic'
  }

  async builder(node: Node) {
    node.addControl(new PreviewControl(() =>
      node.meta.output as any || new BooleanTileGrid(0, 0, 0, 1, 1)
    ))
    node.addInput(new Input('num', 'Numeric dataset', numericDataSocket))
    node.addInput(new Input('mask', 'Mask', booleanDataSocket))
    node.addOutput(new Output('out', 'Masked layer', numericDataSocket))
  }


  async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
    const editorNode = this.editor?.nodes.find(n => n.id === node.id)
    if (editorNode === undefined) { return }

    const num = inputs['num'][0] as NumericTileGrid | number
    const mask = inputs['mask'][0] as BooleanTileGrid

    if (num === undefined || mask === undefined) {
      editorNode.meta.errorMessage = 'Not enough inputs'
    }
    else if (isEqual([inputs['num'][0], inputs['mask'][0]], editorNode.meta.previousInputs)) {
      outputs['out'] = editorNode.meta.output
    }
    else {
      delete editorNode.meta.errorMessage

      editorNode.meta.previousInputs = [inputs['num'][0], inputs['mask'][0]]
      const out = editorNode.meta.output = outputs['out'] = new NumericTileGrid(mask.zoom, mask.x, mask.y, mask.width, mask.height)
      for (let x = mask.x; x < mask.x + mask.width; ++x) {
        for (let y = mask.y; y < mask.y + mask.height; ++y) {
          const value = num instanceof NumericTileGrid ? num.get(x, y, mask.zoom) : num
          out.set(x, y, mask.get(x, y) ? value : 0)
        }
      }

      //out.name = node.data.name || 'Masked layer'

      const previewControl: any = editorNode.controls.get('preview')
      previewControl.update()
    }

    editorNode.update()
  }

}
