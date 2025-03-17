import { BaseComponent } from "./base_component"
import { Input, Node, Output, Socket } from "rete"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { ProjectProperties } from "."
import { numberSocket, numericDataSocket } from "../socket_types"
import { NumericTileGrid } from "../tile_grid"
import { NumericConstant } from "../numeric_constant"


export class LogComponent extends BaseComponent {
    projectProps : ProjectProperties
    cache: Map<string, NumericTileGrid>


    constructor(projectProps : ProjectProperties) {
        super("Log")
        this.category = "Arithmetic"
        this.projectProps = projectProps
        this.cache = new Map()
    }


    private getCacheKey(input: NumericTileGrid, base: undefined | number): string {
        const dataHash = input.getData().reduce((acc, val) => val ? acc + val : acc - 1, 0);
        return `${dataHash}_${base}`
    }


    async builder(node: Node) {
        node.addInput(new Input('input', 'Input', numericDataSocket))
        node.addInput(new Input('base', 'Base (default: natural)', numberSocket))

        node.addOutput(new Output('output', 'Output', numericDataSocket))
    }


    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
        let editorNode = this.editor?.nodes.find(n => n.id === node.id)
        if (editorNode === undefined) { return }

        const input = inputs['input'][0] as NumericTileGrid
        if(input === undefined) { return }

        const base = inputs['base'].length > 0 ? (inputs['base'][0] as NumericConstant).value : undefined

        const key = this.getCacheKey(input, base)

        if(this.cache.has(key))
        {
            console.log(key)
            outputs['output'] = this.cache.get(key)
            return
        }

        const r = new NumericTileGrid(input.zoom, input.x, input.y, input.width, input.height)

        input.iterate((x, y, v) =>
            {
                const l = !base ? Math.log(v) : (Math.log(v) / Math.log(base))
                r.set(x, y, isFinite(l) ? l : NaN)
            }
        )

        this.cache.set(key, r)
        outputs['output'] = r
    }
}