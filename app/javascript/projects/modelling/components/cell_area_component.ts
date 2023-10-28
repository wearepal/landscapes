import { BaseComponent } from "./base_component"
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { Input, Node, Output } from 'rete'
import { dataSocket, numberSocket } from "../socket_types"
import { BooleanTileGrid, CategoricalTileGrid, NumericTileGrid } from "../tile_grid"
import { createXYZ } from "ol/tilegrid"
import { fromExtent } from "ol/geom/Polygon"
import { getArea } from "ol/sphere"
import { NumericConstant } from "../numeric_constant"
import { LabelControl } from "../controls/label"


export class CellAreaComponent extends BaseComponent {

    cache: Map<number, NumericConstant>

    constructor() {
        super("Cell area")
        this.category = "Debug tools"
    }

    async builder(node: Node) {
        node.addInput(new Input('in', 'Input', dataSocket))
        node.addOutput(new Output('out', 'Output', numberSocket))
        node.addControl(new LabelControl('summary'))
        this.cache = new Map()
    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {

        const editorNode = this.editor?.nodes.find(n => n.id === node.id)
        if (editorNode === undefined) { return }

        if (inputs['in'].length > 0) {
            delete editorNode.meta.errorMessage

            const input = inputs['in'][0]

            if (input instanceof BooleanTileGrid || input instanceof NumericTileGrid || input instanceof CategoricalTileGrid) {

                if (this.cache.has(input.zoom)) {
                    outputs['out'] = this.cache.get(input.zoom)

                } else {
                    const tileGrid = createXYZ()
                    const output = outputs['out'] = new NumericTileGrid(
                        input.zoom,
                        input.x,
                        input.y,
                        input.width,
                        input.height
                    )

                    const totalTiles = output.width * output.height

                    const middleIndex = Math.floor(totalTiles / 2)

                    let currentIndex = 0
                    let r

                    for (let x = output.x; x < output.x + output.width; ++x) {
                        for (let y = output.y; y < output.y + output.height; ++y) {
                            if (currentIndex === middleIndex) {
                                r = getArea(fromExtent(tileGrid.getTileCoordExtent([input.zoom, x, y])))
                            }

                            currentIndex++;
                        }
                    }

                    const out = outputs['out'] = new NumericConstant(r, editorNode.data.name as string)

                    this.cache.set(input.zoom, out)

                    node.data.summary = `${r.toLocaleString()} m²`

                    const summaryControl: any = editorNode.controls.get('summary')

                    summaryControl.update()
                }



            } else {

                editorNode.meta.errorMessage = 'Numeric constants cannot be assigned to this node'
            }

        } else {
            editorNode.meta.errorMessage = 'No input'
        }



    }


}