import { Input, Node, Output, Socket } from 'rete'
import { BooleanTileGrid } from '../tile_grid'
import { workerPool } from '../../../modelling/workerPool'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { BaseComponent } from './base_component'
import { PreviewControl } from '../controls/preview'
import { isEqual } from 'lodash'
import { NumericConstant } from '../numeric_constant'
import { numericNumberDataSocket } from '../socket_types'
import { ProjectProperties } from '.'

export class BinaryOpComponent extends BaseComponent {
  operator: string
  operation: string
  inputSocket: Socket
  outputSocket: Socket
  projectProperties: ProjectProperties

  constructor(operation: string, operator: string, inputSocket: Socket, outputSocket: Socket, category: string, projectProperties: ProjectProperties) {
    super(operation)
    this.operator = operator
    this.operation = operation
    this.inputSocket = inputSocket
    this.outputSocket = outputSocket
    this.category = category
    this.contextMenuName = operator ? `${operation} (${operator})` : operation
    this.projectProperties = projectProperties
  }

  async builder(node: Node) {
    node.addControl(new PreviewControl(() =>
      node.meta.output as any || new BooleanTileGrid(0, 0, 0, 1, 1)
    ))
    node.addInput(new Input('a', 'A', this.inputSocket))
    node.addInput(new Input('b', 'B', this.inputSocket))
    node.addOutput(new Output('out', this.operator ? `A ${this.operator} B` : `${this.operation}(A, B)`, this.outputSocket))
  }

  async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
    const editorNode = this.editor?.nodes.find(n => n.id === node.id)
    if (editorNode === undefined) { return }

    if (inputs['a'][0] === undefined || inputs['b'][0] === undefined) {
      editorNode.meta.errorMessage = 'Not enough inputs'
    }
    else if (isEqual([inputs['a'][0], inputs['b'][0]], editorNode.meta.previousInputs)) {
      delete editorNode.meta.errorMessage
      outputs['out'] = editorNode.meta.output
    }
    else {
      delete editorNode.meta.errorMessage
      editorNode.meta.previousInputs = [inputs['a'][0], inputs['b'][0]]


      if (inputs['a'][0] instanceof NumericConstant && inputs['b'][0] instanceof NumericConstant && this.outputSocket === numericNumberDataSocket) {

        editorNode.meta.output = outputs['out'] = new NumericConstant(inputs['a'][0].performCalculation(this.name, inputs['b'][0]), undefined)

      } else {

        if (inputs['a'][0] instanceof NumericConstant) inputs['a'][0] = inputs['a'][0].asNumericTileGrid()
        if (inputs['b'][0] instanceof NumericConstant) inputs['b'][0] = inputs['b'][0].asNumericTileGrid()

        editorNode.meta.output = outputs['out'] = await workerPool.queue(async worker =>
          worker.performOperation(this.name, inputs['a'][0], inputs['b'][0])
        )
      }
    }

    if (outputs['out'] instanceof BooleanTileGrid || outputs['out'] instanceof NumericConstant) outputs['out'].name = (editorNode.data.name as string !== undefined && editorNode.data.name as string !== "") ? editorNode.data.name as string : `${this.operation} data`

    

    const previewControl: any = editorNode.controls.get('Preview')
    previewControl.update()
    editorNode.update()
  }
}
