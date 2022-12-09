import { Component, Input, Output } from 'rete'
import { PreviewControl } from '../controls/PreviewControl'
import { setSocket, mapSocket } from '../sockets'
import { SelectControl } from '../controls/SelectControl'
import { NumericTileGrid } from '../TileGrid'
import { workerPool } from '../workerPool'
import { parser } from 'mathjs'

export class ExpressionComponent extends Component{

    constructor(){
        super('Expression')
        this.category = 'Arithmetic'
    }

    builder(node){

        node.addControl(
            new SelectControl(
              'expressionId',
              //get expressions from schema
              () => [{ id: 1, name: `(x * y) / 3i + y` }, { id: 2, name: `(x * y) / 4i + y`}],
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
      
            const out = editorNode.meta.output = outputs['out'] = new NumericTileGrid(v.zoom, v.x, v.y, v.width, v.height, v.labelSchema)
      
            for (let x = v.x; x < v.x + v.width; ++x) {
                for (let y = v.y; y < v.y + v.height; ++y) {

                    variables.forEach((i)=>{
                        p.set(i, inputs[i][0].get(x, y));
                    })

                    //need to use selected expression
                    let r  = p.evaluate(`(x * y) / 3i + y`)

                    out.set(x, y, isNaN(r) ? 0 : r);

                    p.clear();
                }
            }

        }
        editorNode.update()

    }

    calculateVariables(node){

        const regex = /[a-z]\b/gi;

        //get expression using the expressionId

        //str should be the expression
        const str = `(x * y) / 3i + y`;

        let m;
        let v = [];
        
        while ((m = regex.exec(str)) !== null) {

            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            
            m.forEach((match) => {

                !v.includes(match) ? node.addInput(new Input(match, match, mapSocket)):null;

                v.push(match)
                
            });
        }
    }

    updateInputs(node) {
        node.getConnections().forEach(c => {
          if (c.input.node !== node) {
            this.editor.removeConnection(c)
          }
        })

        Array.from(node.inputs.values()).forEach(input => node.removeInput(input))

        this.calculateVariables(node);
    
        node.update()
    }

}