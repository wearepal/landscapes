import { Input, Node } from "rete"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { dataSocket } from "../socket_types"
import { BooleanTileGrid, CategoricalTileGrid, NumericTileGrid, TileGridJSON } from "../tile_grid"
import { BaseComponent } from "./base_component"
import { NumericConstant } from "../numeric_constant"
import { LabelControl } from "../controls/label"


export type SaveModel = (name: string, model: TileGridJSON, callback?: (status: number) => void) => void

export class SaveModelOutputComponent extends BaseComponent {
    callback: SaveModel

    constructor(savemodel: SaveModel) {
        super("Save dataset")
        this.callback = savemodel
        this.category = "Outputs"
    }

    async builder(node: Node) {
        node.meta.toolTip = "Save models as a dataset. Dataets can be used as inputs to other models, or as layers from the map view."

        node.addInput(new Input("in", "Output", dataSocket))
        node.addControl(new LabelControl('summary'))
    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
        const editorNode = this.editor?.nodes.find(n => n.id === node.id)
        if (editorNode === undefined) { return }
        const summaryControl: any = editorNode.controls.get('summary')
        node.data.summary = "⏳ Saving..."
        summaryControl.update()

        if (inputs['in'].length > 0) {
            if (inputs['in'][0] instanceof NumericConstant) {
                editorNode.meta.errorMessage = "Invalid input! acceptable input datatypes: Numeric, Boolean, or Categorical."
            } else {
                delete editorNode.meta.errorMessage

                const name = (editorNode.data.name as string !== undefined && editorNode.data.name as string !== "") ? editorNode.data.name as string : `Untitled Dataset`

                this.callback(name, (inputs['in'][0] as BooleanTileGrid | NumericTileGrid | CategoricalTileGrid).toJSON(), (status: number) => {
                    node.data.summary = (status === 200 || status === 201) ? "✅ Saved!" : "❌ Failed to save!"
                    summaryControl.update()
                })

            }

        } else {
            editorNode.meta.errorMessage = "No detected input!"
        }


        editorNode.update()
    }
}