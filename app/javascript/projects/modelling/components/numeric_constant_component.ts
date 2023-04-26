import { Node, Output } from "rete"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { TextControl } from "../controls/text"
import { numberSocket } from "../socket_types"
import { BaseComponent } from "./base_component"
import { NumericConstant } from "../numeric_constant"

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

    const editorNode = this.editor?.nodes.find(n => n.id === node.id)
    if (editorNode === undefined) { return }

    outputs['out'] = new NumericConstant(Number(node.data.Value), editorNode.data.name as string)

  }
}
