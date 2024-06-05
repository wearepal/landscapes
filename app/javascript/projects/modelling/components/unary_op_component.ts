import { Input, Node, Output, Socket } from 'rete'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { PreviewControl } from '../controls/preview'
import { BooleanTileGrid, NumericTileGrid } from '../tile_grid'
import { workerPool } from '../../../modelling/workerPool'
import { BaseComponent } from './base_component'
import { ProjectProperties } from '.'
import { maskFromExtentAndShape } from '../bounding_box'

type Affix = 'prefix' | 'postfix'

export class UnaryOpComponent extends BaseComponent {
  operator: string
  operation: string
  affix: Affix
  inputSocket: Socket
  outputSocket: Socket
  projectProperties: ProjectProperties

  constructor(operation: string, operator: string, affix: Affix, inputSocket: Socket, outputSocket: Socket, category: string, projectProperties: ProjectProperties) {
    super(operation)
    this.operator = operator
    this.operation = operation
    this.affix = affix
    this.inputSocket = inputSocket
    this.outputSocket = outputSocket
    this.category = category
    this.contextMenuName = `${operation} (${operator})`
    this.projectProperties = projectProperties
  }

  async builder(node: Node) {
    node.addControl(new PreviewControl(() =>
      node.meta.output as any || new BooleanTileGrid(0, 0, 0, 1, 1)
    ))
    node.addInput(new Input('a', 'A', this.inputSocket))
    node.addOutput(new Output(
      'out',
      (() => {
        switch (this.affix) {
          case 'prefix':
            return `${this.operator}A`
          case 'postfix':
            return `A${this.operator}`
        }
      })(),
      this.outputSocket
    ))
  }

  async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
    const editorNode = this.editor?.nodes.find(n => n.id === node.id)
    if (editorNode === undefined) { return }

    const mask = await maskFromExtentAndShape(this.projectProperties.extent, this.projectProperties.zoom, this.projectProperties.maskLayer, this.projectProperties.maskCQL)

    if (inputs['a'].length === 0) {
      editorNode.meta.errorMessage = 'No input'
    }
    else if (inputs['a'][0] === editorNode.meta.previousInput) {
      delete editorNode.meta.errorMessage
      outputs['out'] = editorNode.meta.output

    }
    else {
      delete editorNode.meta.errorMessage
      editorNode.meta.previousInput = inputs['a'][0]
      const result = await workerPool.queue(async worker =>
        worker.performOperation(this.name, inputs['a'][0])
      )

      if(mask) {
        // TODO: a little dirty and slightly inefficient. Move into performOperation with mask as an optional argument
        if(result instanceof BooleanTileGrid) {
          result.iterate((x, y, value) => {
            if(!mask.get(x, y)) result.set(x, y, false)
          })
        }
        if(result instanceof NumericTileGrid) {
          result.iterate((x, y, value) => {
            if(!mask.get(x, y)) result.set(x, y, NaN)
          })
        }
      }

      editorNode.meta.output = outputs['out'] = result

    }

    if (outputs['out'] instanceof BooleanTileGrid) outputs['out'].name = (editorNode.data.name as string !== undefined && editorNode.data.name as string !== "") ? editorNode.data.name as string : `${this.operation} data`

    const previewControl: any = editorNode.controls.get('Preview')
    previewControl.update()
    editorNode.update()
  }
}
