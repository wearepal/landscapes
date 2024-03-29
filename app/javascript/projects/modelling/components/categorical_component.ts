import { Input, Node, Output, Socket } from 'rete'
import { BaseComponent } from './base_component'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { booleanDataSocket, categoricalDataSocket } from '../socket_types'
import { BooleanTileGrid, CategoricalTileGrid } from '../tile_grid'
import { isEqual } from 'lodash'

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

        if (isEqual(booleanData, this.previousInput)) {
            outputs['out'] = this.cachedData
        } else {
            let baseBool: BooleanTileGrid | null = null
            let highestZoom = -1
            for (const boolGrid of booleanData as BooleanTileGrid[]) {
                if (boolGrid.zoom > highestZoom) {
                    highestZoom = boolGrid.zoom
                    baseBool = boolGrid
                }
            }

            if (!baseBool) { return }

            this.previousInput = booleanData as BooleanTileGrid[]

            const labels: Map<number, string> = new Map()
            const result = outputs['out'] = new CategoricalTileGrid(
                baseBool.zoom,
                baseBool.x,
                baseBool.y,
                baseBool.width,
                baseBool.height
            )

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