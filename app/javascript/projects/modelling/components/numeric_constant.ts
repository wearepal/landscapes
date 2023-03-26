import { Node, Output } from "rete"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { TextControl } from "../controls/text"
import { numberSocket } from "../socket_types"
import { BaseComponent } from "./base_component"

export class NumericConstantComponent extends BaseComponent {
  constructor() {
    super('Numeric constant')
    this.category = 'Inputs'
  }
  
  async builder(node: Node) {
    if (!('Value' in node.data)) {
      node.data.Value = "0"
    }
    node.addControl(new TextControl(this.editor, 'Value'))
    node.addOutput(new Output('out', this.name, numberSocket))
  }

  worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
    outputs['out'] = Number(node.data.Value)
  }
}
