import { Input, Node, Output } from "rete"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { booleanDataSocket, categoricalDataSocket, numericDataSocket } from "../socket_types"
import { BooleanTileGrid, CategoricalTileGrid, NumericTileGrid } from "../tile_grid"
import { BaseComponent } from "./base_component"
import { SelectControl } from "../controls/select"
import { CompiledDatasetRecord, getDataset } from "../../saved_dataset"
import { Extent } from "ol/extent"

async function fetchDataset(datasetId: number, teamId: number) {
    return new Promise<{ error: { message: string }; out: { model: BooleanTileGrid | NumericTileGrid | CategoricalTileGrid } }>((resolve) => {
        getDataset(datasetId, teamId, (err, out) => {
            resolve({ error: err, out: out });
        });
    });
}

export type getDatasets = () => Promise<CompiledDatasetRecord[]>

export class PrecompiledModelComponent extends BaseComponent {
    modelSource: getDatasets
    models: CompiledDatasetRecord[]
    projectExtent: Extent
    projectZoom: number

    constructor(getDatasets: getDatasets, projectExtent: Extent, projectZoom: number) {
        super("Load Dataset")
        this.category = "Inputs"
        this.modelSource = getDatasets

        //TODO: Use these.
        this.projectExtent = projectExtent
        this.projectZoom = projectZoom
    }

    async builder(node: Node) {

        this.models = await this.modelSource()

        node.meta.toolTip = "Load a precompiled dataset. These can be created from the 'Save Dataset' component."

        node.addControl(new SelectControl(
            this.editor,
            'DatasetId',
            () => this.models,
            () => this.updateOutputs(node),
            'Dataset'
        ))

        this.updateOutputs(node)
    }

    async updateOutputs(node: Node) {

        let output = this.models.find(a => a.id == node.data.DatasetId as number)

        if (!output && this.models.length > 0) output = this.models[0]

        node.getConnections().forEach(c => {
            if (c.output.node !== node) {
                this.editor?.removeConnection(c)
            }
        })
        node.getConnections().forEach(c => this.editor?.removeConnection(c))
        Array.from(node.outputs.values()).forEach(output => node.removeOutput(output))


        if (output) node.addOutput(new Output('out', 'Model',
            output.gridtype === 'BooleanTileGrid' ? booleanDataSocket : (output.gridtype === 'CategoricalTileGrid' ? categoricalDataSocket : numericDataSocket)
        ))

        node.update()
    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
        const editorNode = this.editor?.nodes.find((n) => n.id === node.id);
        if (editorNode === undefined) {
            return;
        }

        let dataId = node.data.DatasetId ? (node.data.DatasetId as number) : this.models[0].id;

        const dataset = this.models.find((a) => a.id == dataId);

        delete editorNode.meta.errorMessage;

        if (dataset) {
            try {
                const response = await fetchDataset(dataset.id, dataset.team_id);
                if (response.error) {
                    editorNode.meta.errorMessage = response.error.message;
                } else {
                    outputs['out'] = editorNode.meta.output = response.out;
                }
            } catch (error) {
                editorNode.meta.errorMessage = error.message;
            }
        } else {
            editorNode.meta.errorMessage = "Unable to retrieve valid model data";
        }

        editorNode.update();

    }

}