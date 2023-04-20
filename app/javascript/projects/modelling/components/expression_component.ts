import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { BaseComponent } from "./base_component"
import { Input, Node, Output } from 'rete'
import { PreviewControl } from "../controls/preview"
import { NumericTileGrid } from "../tile_grid"
import { SelectControl } from "../controls/select"
import { numericDataSocket } from "../socket_types"
import { exp, isSymbolNode, parse, parser } from 'mathjs'


interface Expression {
    id: number
    name: string
}

const ExpressionList: Array<Expression> = [
    { id: 1, name: `(x * y) / 3i + y` },
    { id: 2, name: `(x * y) / 4i + y` },
    { id: 3, name: `x ^ y` },
    { id: 4, name: `(x ^ 3y) - 2k` },
    { id: 5, name: `height * scale + error` }
]

export class ExpressionComponent extends BaseComponent {

    constructor() {
        super("Expression")
        this.category = "Arithmetic"
    }

    async builder(node: Node) {

        if (node.data.expressionId === undefined) {
            node.data.expressionId = 1
        }

        node.addControl(
            new SelectControl(
                this.editor,
                'expressionId',
                () => ExpressionList,
                () => this.updateInputs(node),
                "Expression"
            )
        )

        this.calculateVariables(node)

        node.addOutput(new Output('out', 'Output', numericDataSocket))

    }


    getExpression(expressionId: number | string): string | undefined {

        let r = ExpressionList.find(a => a.id == expressionId)

        return r?.name;
    }


    calculateVariables(node: Node): void {
        const expression = this.getExpression(node.data.expressionId as number) as string

        const uniqueSymbols = new Set(
            parse(expression)
                .filter(isSymbolNode)
                .map(n => n.name)
        )

        for (let symbol of uniqueSymbols) {
            node.addInput(new Input(symbol, symbol, numericDataSocket))
        }
    }


    updateInputs(node: Node) {

        console.log("updating inputs")

        node.getConnections().forEach(c => {
            if (c.input.node !== node) {
                this.editor?.removeConnection(c)
            }
        })

        node.getConnections().forEach(c => this.editor?.removeConnection(c))
        Array.from(node.inputs.values()).forEach(input => node.removeInput(input))

        this.calculateVariables(node);

        node.update()
    }



    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {

        console.log(inputs)

        const editorNode = this.editor?.nodes.find(n => n.id === node.id)
        if (editorNode === undefined) { return }


        let variables: string[] = []

        let errorMsg: null | string = null;

        for (const input in inputs) {
            inputs[input][0] === undefined ? errorMsg = "" : null;
            variables.push(input)
        }

        if (errorMsg) {
            editorNode.meta.errorMessage = errorMsg
        } else {

            delete editorNode.meta.errorMessage

            const p = parser()

            let v = inputs[variables[0]][0] as NumericTileGrid

            const out = editorNode.meta.output = outputs['out'] = new NumericTileGrid(v.zoom, v.x, v.y, v.width, v.height, 0)

            for (let x = v.x; x < v.x + v.width; ++x) {
                for (let y = v.y; y < v.y + v.height; ++y) {

                    variables.forEach((i) => {

                        const variableSource = inputs[i][0] as NumericTileGrid

                        if (variableSource.width === 1) {
                            //NUMERIC CONSTANTS NOT WORKING, WILL NEED TO FIX LATER. tHIS IS A BANDAID SOLUTION FOR NOW
                            p.set(i, variableSource.get(0, 0))
                        } else {
                            p.set(i, variableSource.get(x, y));
                        }
                    })

                    let expression = this.getExpression(editorNode.data.expressionId as string);

                    //console.log(expression)

                    let r = p.evaluate(expression as string)


                    if (!isNaN(r)) {
                        out.set(x, y, r);
                    }

                    p.clear();
                }
            }
        }

        //const previewControl: any = editorNode.controls.get('Preview')
        //previewControl.update()
        editorNode.update()


    }

}