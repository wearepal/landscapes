import { Component, Input, Output } from 'rete'
import { PreviewControl } from '../controls/PreviewControl'
import { setSocket, mapSocket } from '../sockets'
import { SelectControl } from '../controls/SelectControl'
import { NumericTileGrid } from '../TileGrid'
import { workerPool } from '../workerPool'
import { evaluate, parser } from 'mathjs'

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
              () => [{ id: 1, name: "x ^ z" }, { id: 2, name: "(x + 3) / (y + z)"}],
              () => this.updateInputs(node),
              "Expression"
            )
          )

        node.addOutput(new Output('out', 'Output', mapSocket))
    }

    worker(node, inputs, outputs) {

        //get expression

        //create output

        //loop through output array(s)

        //set variables

        //evaluate expression


        //end loop

        //output 

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