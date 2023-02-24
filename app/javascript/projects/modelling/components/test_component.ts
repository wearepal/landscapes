import { Component, Node, Output } from "rete"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { TextControl } from "../controls/text_control"
import { booleanDataSocket, categoricalDataSocket, numberSocket, numericDataSocket } from "../socketTypes"

export class TestComponent extends Component {
  constructor() {
    super("Test component")
  }

  async builder(node: Node) {
    node.addOutput(new Output("test", "Boolean", booleanDataSocket))
    node.addOutput(new Output("test2", "Numeric", numericDataSocket))
    node.addOutput(new Output("test3", "Categorical", categoricalDataSocket))
    node.addOutput(new Output("test4", "Number", numberSocket))
    node.addControl(new TextControl("foo"))
  }

  async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
  }
}
