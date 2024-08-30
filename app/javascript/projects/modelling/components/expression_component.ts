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
import { getMedianCellSize } from "./cell_area_component"
import { NumericConstant } from "../numeric_constant"

interface customFunction {
    name: string
    fn: (x: NumericTileGrid) => number
}

// functions and constants that are already defined in mathjs therefore don't need to be added as inputs
const definedFnsCnsts: string[] = [
    'exp',
    'log',
    'sin',
    'cos',
    'tan',
    'PI',
    'E',
    'sqrt'
]

const customFns: customFunction[] = [
    { name: 'AREA_M2', fn: (x: NumericTileGrid) => getMedianCellSize(x).area },
    { name: 'AREA_KM2', fn: (x: NumericTileGrid) => getMedianCellSize(x).area / 1000000 },
    { name: 'LENGTH_KM', fn: (x: NumericTileGrid) => getMedianCellSize(x).length },
    { name: 'LENGTH_M', fn: (x: NumericTileGrid) => getMedianCellSize(x).length * 1000 },
]


interface Expression {
    id: number
    name: string
}

const ExpressionList: Array<Expression> = [
    { id: 1, name: `height * scale + error` },
    //{ id: 2, name: `H^2 * scale + error` },
    { id: 3, name: `exp(A + (B * log(H * CD)) + error) / AREA_M2` },
    //{ id: 4, name: `log(0.016 + alpha) + (0.204^2/2)`},
    //{ id: 5, name: `2.013 + beta` },
    { id: 6, name: `sqrt(PI/4 * AREA_M2)` },
]

export class ExpressionComponent extends BaseComponent {
    projectProps: ProjectProperties
    cache: Map<string, NumericConstant | NumericTileGrid>
    inputCache: Map<string, any>

    constructor(ProjectProps: ProjectProperties) {
        super("Expression")
        this.category = "Arithmetic"
        this.projectProps = ProjectProps
        this.cache = new Map()
        this.inputCache = new Map()
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

        node.addOutput(new Output('out', 'Output', numericNumberDataSocket))

        //node.addControl(new PreviewControl(() =>
        //    node.meta.output as any || new NumericTileGrid(0, 0, 0, 1, 1)
        //))


    }


    getExpression(expressionId: number | string): string | undefined {

        let r = ExpressionList.find(a => a.id == expressionId)

        return r?.name;
    }

    retrieveVariables(node: Node, expression: string): Set<String> {
        const uniqueSymbols = new Set<String>(
            parse(expression)
                .filter(isSymbolNode)
                .map(n => (n as any).name)
        )

        return uniqueSymbols
    }


    calculateVariables(node: Node): void {
        
        const expression = this.getExpression(node.data.expressionId as number) as string
        const uniqueSymbols = this.retrieveVariables(node, expression)

        const symbolArray = Array.from(uniqueSymbols)

        for (let symbol of symbolArray) {
            if (!definedFnsCnsts.includes(symbol as string) && !customFns.map(f => f.name).includes(symbol as string)) {
                node.addInput(new Input(symbol as string, symbol as string, numericNumberDataSocket))
            }
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

        console.log("Expression worker")

        const editorNode = this.editor?.nodes.find(n => n.id === node.id)
        if (editorNode === undefined) { return }

        const expression = this.getExpression(editorNode.data.expressionId as string) as string

        console.log(expression)

        let variables: string[] = []

        let errorMsg: null | string = null

        let numericConstantOutput = true


        for (const input in inputs) {
            inputs[input][0] === undefined ? errorMsg = "" : null
            if(inputs[input][0] instanceof NumericTileGrid) numericConstantOutput = false
            variables.push(input)
        }

        if (errorMsg) {
            editorNode.meta.errorMessage = errorMsg

        } else if (this.cache.has(expression) && isEqual(inputs, this.inputCache.get(expression))) {
            console.log("using previous output")
            const out = editorNode.meta.output = outputs['out'] = this.cache.get(expression)
        }
        else {

            delete editorNode.meta.errorMessage

            const p = parser()

            const tileGrid = createXYZ()
            const outputTileRange = tileGrid.getTileRangeForExtentAndZ(this.projectProps.extent, this.projectProps.zoom)

            const t = new NumericTileGrid(
                this.projectProps.zoom, 
                outputTileRange.minX, 
                outputTileRange.minY, 
                outputTileRange.getWidth(), 
                outputTileRange.getHeight()
            )

            // check and calculate any constants or functions that are outside of MathJS 
            const customConsts = Array.from(this.retrieveVariables(editorNode, expression)).filter(symb => customFns.map(f => f.name).includes(symb as string))
            const ConstMap = new Map(customConsts.map(c => [c, customFns.find(f => f.name === c)?.fn(t)]))

            console.log(numericConstantOutput)

            if (numericConstantOutput) {

                console.log("numeric constant output")

                ConstMap.forEach((v, k) => p.set(k as string, v))
                variables.forEach(i => p.set(i, (inputs[i][0] as NumericConstant).value))

                let r = p.evaluate(expression)

                const out = outputs['out'] = new NumericConstant(r, editorNode.data.name as string)

                p.clear();



                this.cache.set(expression, out)
                this.inputCache.set(expression, inputs)

            }else{

                console.log("tile grid output")

                const out = outputs['out'] = t

                out.iterate((x, y) => {
                    
                    // apply any constants, ex: Area
                    ConstMap.forEach((v, k) => p.set(k as string, v))

                    // variables from input
                    variables.forEach((i) => {
                        const variableSource: any = inputs[i][0]
                        p.set(i, variableSource.get(x, y))
                    })

                    // evaluate the expression
                    let r = p.evaluate(expression)

                    out.set(x, y, r);
                    p.clear();

                })

                this.cache.set(expression, out)
                this.inputCache.set(expression, inputs)
            }
        }

        //const previewControl: any = editorNode.controls.get('Preview')
        //previewControl.update()
        editorNode.update()


    }

}