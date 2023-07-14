import { Input, Node } from "rete"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { dataSocket } from "../socket_types"
import { BooleanTileGrid, CategoricalTileGrid, NumericTileGrid, TileGridJSON } from "../tile_grid"
import { BaseComponent } from "./base_component"
import { NumericConstant } from "../numeric_constant"


export type SaveModel = (name: string, model: TileGridJSON) => void

export class SaveModelOutputComponent extends BaseComponent {
    callback: SaveModel

    constructor(savemodel: SaveModel) {
        super("Save model output")
        this.callback = savemodel
        this.category = "Outputs"
    }

    async builder(node: Node) {
        node.meta.toolTip = "[WIP] Save models for access from Map Layers or as an input for other models."

        node.addInput(new Input("in", "Input", dataSocket))
    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
        const editorNode = this.editor?.nodes.find(n => n.id === node.id)
        if (editorNode === undefined) { return }

        if (inputs['in'].length > 0) {
            if (inputs['in'][0] instanceof NumericConstant) {
                editorNode.meta.errorMessage = "Invalid input! acceptable input datatypes: Numeric, Boolean, or Categorical."
            } else {
                delete editorNode.meta.errorMessage

                const name = (editorNode.data.name as string !== undefined && editorNode.data.name as string !== "") ? editorNode.data.name as string : `Untitled Dataset`

                this.callback(name, (inputs['in'][0] as BooleanTileGrid | NumericTileGrid | CategoricalTileGrid).toJSON())

            }

        } else {
            editorNode.meta.errorMessage = "No detected input!"
        }


        editorNode.update()
    }
}