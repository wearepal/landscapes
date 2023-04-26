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
import { string } from 'prop-types'

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


        let totalArea: number = 0

        if (inputs['in'][0]) {

            const tileGrid = createXYZ()

            const input = inputs['in'][0] as BooleanTileGrid

            for (let x = input.x; x < input.x + input.width; ++x) {
                for (let y = input.y; y < input.y + input.height; ++y) {
                    totalArea += input.get(x, y) ? getArea(fromExtent(tileGrid.getTileCoordExtent([input.zoom, x, y]))) : 0
                }
            }
            totalArea /= 1000000
        }

        node.data.summary = `${totalArea.toLocaleString()} km²`

        outputs['out'] = new NumericConstant(totalArea, editorNode.data.name as string)

        const summaryControl: any = editorNode.controls.get('summary')

        summaryControl.update()

    }

}
