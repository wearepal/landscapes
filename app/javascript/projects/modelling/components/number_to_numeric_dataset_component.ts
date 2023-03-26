import { Input, Node, Output } from "rete"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { TextControl } from "../controls/text"
import { numberSocket, numericDataSocket } from "../socket_types"
import { NumericTileGrid } from "../tile_grid"
import { BaseComponent } from "./base_component"

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
    }
    else if (inputs['in'][0] === editorNode.meta.previousInput) {
      delete editorNode.meta.errorMessage
      outputs['out'] = editorNode.meta.output
    }
    else {
      delete editorNode.meta.errorMessage
      editorNode.meta.previousInput = inputs['in'][0]
      editorNode.meta.output = outputs['out'] = new NumericTileGrid(0, 0, 0, 1, 1, inputs['in'][0] as number)
      //outputs['out'].name = node.data.name
    }

    editorNode.update()
  }
}
