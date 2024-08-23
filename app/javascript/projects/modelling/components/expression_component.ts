import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { BaseComponent } from "./base_component"
import { Input, Node, Output } from 'rete'
import { NumericTileGrid } from "../tile_grid"
import { SelectControl } from "../controls/select"
import { numericDataSocket, numericNumberDataSocket } from "../socket_types"
import { exp, isSymbolNode, parse, parser } from 'mathjs'
import { PreviewControl } from "../controls/preview"
import { isEqual } from "lodash"
import { ProjectProperties } from "."
import { createXYZ } from "ol/tilegrid"


interface Expression {
    id: number
    name: string
}

const ExpressionList: Array<Expression> = [
    { id: 1, name: `height * scale + error` },
    { id: 2, name: `H^2 * scale + error` },
]

export class ExpressionComponent extends BaseComponent {
    projectProps: ProjectProperties

    constructor(ProjectProps: ProjectProperties) {
        super("Expression")
        this.category = "Arithmetic"
        this.projectProps = ProjectProps
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

        node.addControl(new PreviewControl(() =>
            node.meta.output as any || new NumericTileGrid(0, 0, 0, 1, 1)
        ))


    }


    getExpression(expressionId: number | string): string | undefined {

        let r = ExpressionList.find(a => a.id == expressionId)

        return r?.name;
    }


    calculateVariables(node: Node): void {
        const expression = this.getExpression(node.data.expressionId as number) as string

        const uniqueSymbols = new Set<String>(
            parse(expression)
                .filter(isSymbolNode)
                .map(n => (n as any).name)
        )

        const symbolArray = Array.from(uniqueSymbols)

        for (let symbol of symbolArray) {
            node.addInput(new Input(symbol as string, symbol as string, numericNumberDataSocket))
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

        const editorNode = this.editor?.nodes.find(n => n.id === node.id)
        if (editorNode === undefined) { return }

        const expression = this.getExpression(editorNode.data.expressionId as string) as string

        let variables: string[] = []

        let errorMsg: null | string = null

        for (const input in inputs) {
            inputs[input][0] === undefined ? errorMsg = "" : null
            variables.push(input)
        }

        if (errorMsg) {
            editorNode.meta.errorMessage = errorMsg

        } else if (isEqual(editorNode.data.previousInputs, [inputs, expression])) {
            const out = editorNode.meta.output = outputs['out'] = editorNode.data.previewsOutput
        }
        else {

            delete editorNode.meta.errorMessage

            const p = parser()

            const v = inputs[variables[0]][0] as NumericTileGrid


            const tileGrid = createXYZ()
            const outputTileRange = tileGrid.getTileRangeForExtentAndZ(this.projectProps.extent, this.projectProps.zoom)

            const out = editorNode.meta.output = outputs['out'] = new NumericTileGrid(
                this.projectProps.zoom, 
                outputTileRange.minX, 
                outputTileRange.minY, 
                outputTileRange.getWidth(), 
                outputTileRange.getHeight()
            )

            out.iterate((x, y) => {

                variables.forEach((i) => {
                    const variableSource: any = inputs[i][0]
                    p.set(i, variableSource.get(x, y))
                })

                let r = p.evaluate(expression)

                out.set(x, y, r);
                p.clear();

            })

            editorNode.data.previousInputs = [inputs, expression]
            editorNode.data.previewsOutput = out
        }

        const previewControl: any = editorNode.controls.get('Preview')
        previewControl.update()
        editorNode.update()


    }

}