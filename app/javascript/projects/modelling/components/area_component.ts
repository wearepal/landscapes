import { Input, Node, Output, Socket } from 'rete'
import { BaseComponent } from './base_component'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { booleanDataSocket, numberSocket } from '../socket_types'
import { LabelControl } from '../controls/label'
import { createXYZ } from 'ol/tilegrid'
import { BooleanTileGrid } from '../tile_grid'
import { getArea } from 'ol/sphere'
import { fromExtent } from 'ol/geom/Polygon'

export class AreaComponent extends BaseComponent {

    constructor() {
        super('Area')
        this.category = "Calculations"
    }

    async builder(node: Node) {
        node.data.summary = '0 km²'

        node.addInput(new Input('in', 'Set', booleanDataSocket))
        node.addOutput(new Output('out', 'Area', numberSocket))

        node.addControl(new LabelControl('summary'))
    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {

        let editorNode = this.editor?.nodes.find(n => n.id === node.id)
        if (editorNode === undefined) { return }

        const tileGrid = createXYZ()

        const input = inputs['in'][0] as BooleanTileGrid

        let totalArea: number = 0

        for (let x = input.x; x < input.x + input.width; ++x) {
            for (let y = input.y; y < input.y + input.height; ++y) {
                totalArea += input.get(x, y) ? getArea(fromExtent(tileGrid.getTileCoordExtent([input.zoom, x, y]))) : 0
            }
        }
        totalArea /= 1000000
        outputs['out'] = totalArea

        node.data.summary = `${totalArea.toLocaleString()} km²`

        const summaryControl: any = editorNode.controls.get('summary')

        summaryControl.update()

    }

}
