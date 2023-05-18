import { Input, Node, Output, Socket } from 'rete'
import { BaseComponent } from './base_component'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { booleanDataSocket, categoricalDataSocket } from '../socket_types'
import { BooleanTileGrid, CategoricalTileGrid } from '../tile_grid'

export class CategoricalComponent extends BaseComponent {
    cachedData: CategoricalTileGrid
    previousInput: Array<BooleanTileGrid>

    constructor() {
        super('Boolean to categorical dataset')
        this.category = 'Conversions'
        this.previousInput = new Array()
    }

    async builder(node: Node) {
        node.addInput(new Input('in', 'Boolean inputs', booleanDataSocket, true))

        node.addOutput(new Output('out', 'Categorical dataset', categoricalDataSocket))
    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {

        const editorNode = this.editor?.nodes.find(n => n.id === node.id)
        if (editorNode === undefined) { return }

        const booleanData = inputs['in']
        if (booleanData.length === 0) { return }


        if (booleanData.toString() === this.previousInput.toString()) {
            outputs['out'] = this.cachedData
        } else {
            this.previousInput = booleanData as BooleanTileGrid[]

            const baseBool = booleanData[0] as BooleanTileGrid
            const labels: Map<number, string> = new Map()
            const result = outputs['out'] = new CategoricalTileGrid(
                baseBool.zoom,
                baseBool.x,
                baseBool.y,
                baseBool.width,
                baseBool.height
            )

            // sort by name alphabetically,

            booleanData.map((e, i) => {
                if (e instanceof BooleanTileGrid) {
                    labels.set(i + 1, e.name ? e.name : `Untitled data ${i + 1}`)
                    result.applyCategoryFromBooleanGrid(e, i + 1)
                }
            })

            result.setLabels(labels)
            this.cachedData = result
        }

        editorNode.update()

    }

}