import { Input, Node } from "rete"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { dataSocket } from "../socketTypes"
import { BooleanTileGrid, NumericTileGrid } from "../tile_grid"
import { BaseComponent } from "./base_component"

type Callback = (id: number, tileGrid: BooleanTileGrid | NumericTileGrid) => void

export class MapLayerComponent extends BaseComponent {
  callback: Callback

  constructor(callback: Callback) {
    super("Map layer")
    this.callback = callback
    this.category = "Outputs"
  }

  async builder(node: Node) {
    node.addInput(new Input("in", "Input", dataSocket))
  }

  async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
    const name = node.data.name as string | undefined
    this.callback(node.id, inputs["in"][0] as BooleanTileGrid | NumericTileGrid)
  }
}
