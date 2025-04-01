import { Input, Node, Output, Socket } from 'rete'
import { BaseComponent } from './base_component'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { booleanDataSocket, numberSocket } from '../socket_types'
import { LabelControl } from '../controls/label'
import { createXYZ } from 'ol/tilegrid'
import { BooleanTileGrid } from '../tile_grid'
import { getArea } from 'ol/sphere'
import { fromExtent } from 'ol/geom/Polygon'
import { NumericConstant } from '../numeric_constant'

export class AreaComponent extends BaseComponent {

    constructor() {
        super('Area')
        this.category = "Calculations"
    }

    async builder(node: Node) {
        node.data.summary = '0 km²'

        node.addInput(new Input('in', 'Set', booleanDataSocket))
        node.addOutput(new Output('out', 'Area [[km²]]', numberSocket))

        node.addControl(new LabelControl('summary'))
    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {

        let editorNode = this.editor?.nodes.find(n => n.id === node.id)
        if (editorNode === undefined) { return }


        let totalArea: number = 0

        if (inputs['in'][0]) {

            const tileGrid = createXYZ()

            const input = inputs['in'][0] as BooleanTileGrid

            input.iterate((x, y, value) => totalArea += value ? getArea(fromExtent(tileGrid.getTileCoordExtent([input.zoom, x, y]))) : 0)

            totalArea /= 1000000
        }

        node.data.summary = `${totalArea.toLocaleString()} km²`

        outputs['out'] = new NumericConstant(totalArea, editorNode.data.name as string)

        const summaryControl: any = editorNode.controls.get('summary')

        summaryControl.update()

    }

}
