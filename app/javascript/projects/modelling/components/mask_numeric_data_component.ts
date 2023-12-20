import { Input, Node, Output } from 'rete'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { PreviewControl } from '../controls/preview'
import { booleanDataSocket, numericDataSocket, numericNumberDataSocket } from '../socket_types'
import { BooleanTileGrid, NumericTileGrid } from '../tile_grid'
import { BaseComponent } from './base_component'
import { NumericConstant } from '../numeric_constant'
import { isEqual } from 'lodash'

export class MaskNumericDataComponent extends BaseComponent {
  constructor() {
    super("Mask numeric data")
    this.category = 'Arithmetic'
  }

  async builder(node: Node) {
    node.addControl(new PreviewControl(() =>
      node.meta.output as any || new BooleanTileGrid(0, 0, 0, 1, 1)
    ))
    node.addInput(new Input('num', 'Numeric dataset', numericNumberDataSocket))
    node.addInput(new Input('mask', 'Mask', booleanDataSocket))
    node.addOutput(new Output('out', 'Masked layer', numericDataSocket))
  }


  async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {

    const editorNode = this.editor?.nodes.find(n => n.id === node.id)
    if (editorNode === undefined) { return }



    if (inputs['num'][0] === undefined || inputs['mask'][0] === undefined) {
      editorNode.meta.errorMessage = 'Not enough inputs'
    }

    else if (!isEqual(inputs['num'][0], (editorNode.meta.previousInputs as any)?.[0]) || !isEqual(inputs['mask'][0], (editorNode.meta.previousInputs as any)?.[1])) {

      delete editorNode.meta.errorMessage

      const mask = inputs['mask'][0] as BooleanTileGrid
      const num = inputs['num'][0] instanceof NumericTileGrid ? inputs['num'][0] as NumericTileGrid : inputs['num'][0] as NumericConstant

      editorNode.meta.previousInputs = [num, mask]

      const out = editorNode.meta.output = outputs['out'] = new NumericTileGrid(mask.zoom, mask.x, mask.y, mask.width, mask.height, NaN)

      mask.iterate((x, y, value) => out.set(x, y, value ? num.get(x, y, mask.zoom) : NaN))

    }
    else {

      delete editorNode.meta.errorMessage

      outputs['out'] = editorNode.meta.output

    }

    const previewControl: any = editorNode.controls.get('Preview')
    previewControl.update()
    editorNode.update()
  }

}
