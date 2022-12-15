import { Component, Input, Output } from 'rete'
import { mapSocket } from '../sockets'
import { SelectControl } from '../controls/SelectControl'
import { NumericTileGrid } from '../TileGrid'
import { exp, isSymbolNode, parse, parser } from 'mathjs'

export class ExpressionComponent extends Component{

    constructor(){
        super('Expression')
        this.category = 'Arithmetic'
        this.expressions = [{ id: 1, name: `(x * y) / 3i + y` }, { id: 2, name: `(x * y) / 4i + y`}, {id: 3, name: `x ^ y`}, {id: 4, name: `(x ^ 3y) - 2k`}]
    }

    builder(node){
        if (node.data.expressionId === undefined) {
            node.data.expressionId = 1
        }

        node.addControl(
            new SelectControl(
              'expressionId',
              () => this.expressions,
              () => this.updateInputs(node),
              "Expression"
            )
        )

        this.calculateVariables(node)

        node.addOutput(new Output('out', 'Output', mapSocket))
    }

    worker(node, inputs, outputs) {

        const editorNode = this.editor.nodes.find(n => n.id === node.id)

        let variables = []

        let errorMsg = null;

        for (const input in inputs) {
            inputs[input][0] === undefined ? errorMsg = "" : null;
            variables.push(input)
        }

        if (errorMsg){

            editorNode.meta.errorMessage = errorMsg

        }else{

            delete editorNode.meta.errorMessage

            const p = parser()

            let v = inputs[variables[0]][0]
      
            const out = editorNode.meta.output = outputs['out'] = new NumericTileGrid(v.zoom, v.x, v.y, v.width, v.height, 0)
      
            for (let x = v.x; x < v.x + v.width; ++x) {
                for (let y = v.y; y < v.y + v.height; ++y) {

                    variables.forEach((i)=>{
                        p.set(i, inputs[i][0].get(x, y));
                    })

                    let expression = this.getExpression(editorNode.data.expressionId);

                    let r  = p.evaluate(expression)

                    if (!isNaN(r)) {
                        out.set(x, y, r);
                    }

                    p.clear();
                }
            }

        }
        editorNode.update()

    }

    getExpression(expressionId){

        let r = this.expressions.find(a => a.id == expressionId)

        return r.name;
    }

    calculateVariables(node){
        const expression = this.getExpression(node.data.expressionId)

        const uniqueSymbols = new Set(
            parse(expression)
                .filter(isSymbolNode)
                .map(n => n.name)
        )

        for (let symbol of uniqueSymbols) {
            node.addInput(new Input(symbol, symbol, mapSocket))
        }
    }

    updateInputs(node) {
        node.getConnections().forEach(c => {
          if (c.input.node !== node) {
            this.editor.removeConnection(c)
          }
        })

        node.getConnections().forEach(c => this.editor.removeConnection(c))
        Array.from(node.inputs.values()).forEach(input => node.removeInput(input))

        this.calculateVariables(node);
    
        node.update()
    }

}