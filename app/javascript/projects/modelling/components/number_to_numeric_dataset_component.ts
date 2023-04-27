import { Input, Node, Output } from "rete"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { TextControl } from "../controls/text"
import { numberSocket, numericDataSocket } from "../socket_types"
import { NumericTileGrid } from "../tile_grid"
import { BaseComponent } from "./base_component"
import { NumericConstant } from "../numeric_constant"

export class NumberToNumericDatasetComponent extends BaseComponent {
  constructor() {
    super('Number to numeric dataset')
    this.category = 'Conversions'
  }

  async builder(node: Node) {
    node.addInput(new Input('in', 'Number', numberSocket))
    node.addOutput(new Output('out', 'Numeric dataset', numericDataSocket))
  }

  worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
    const editorNode = this.editor?.nodes.find(n => n.id === node.id)
    if (editorNode === undefined) { return }

    if (inputs['in'].length === 0) {
      editorNode.meta.errorMessage = 'No input'
    } else {
      const numericInput = inputs['in'][0] as NumericConstant

      if (numericInput.value === editorNode.meta.previousInput) {
        delete editorNode.meta.errorMessage
        outputs['out'] = editorNode.meta.output
      }
      else {
        delete editorNode.meta.errorMessage
        editorNode.meta.previousInput = numericInput.value
        editorNode.meta.output = outputs['out'] = new NumericTileGrid(0, 0, 0, 1, 1, numericInput.value)
        //outputs['out'].name = node.data.name
      }
    }




    editorNode.update()
  }
}
