import { Component, Input, Output } from 'rete'
import { PreviewControl } from '../controls/PreviewControl'
import { SelectControl } from '../controls/SelectControl'
import { layerSocket, setSocket } from '../sockets'
import { getExtent, LabelledTileGrid, mergeExtents } from '../TileGrid'

export class BuildLabellingLayerComponent extends Component {
  constructor(labelSchemas) {
    super('Build labelling layer')
    this.category = 'Labellings'
    this.labelSchemas = labelSchemas
  }

  builder(node) {
    if (!this.getSelectedLabelSchema(node)) {
      node.data.labelSchemaId = this.labelSchemas[0].id
    }

    node.addControl(
      new SelectControl(
        'labelSchemaId',
        () => this.labelSchemas,
        () => {
          this.updateInputs(node)
          node.update()
        },
        'Label schema'
      )
    )

    node.addControl(new PreviewControl(() => 
      node.meta.output || new LabelledTileGrid(0, 0, 0, 1, 1)
    ))

    node.addOutput(new Output('out', layerSocket.name, layerSocket))

    this.updateInputs(node)
  }

  getSelectedLabelSchema(node) {
    return this.labelSchemas.find(schema =>
      schema.id === node.data.labelSchemaId
    )
  }

  updateInputs(node) {
    node.getConnections().forEach(c => this.editor.removeConnection(c))
    Array.from(node.inputs.values()).forEach(input => node.removeInput(input))

    this.getSelectedLabelSchema(node).labels.forEach(label =>
      node.addInput(new Input(`${label.id}`, label.label, setSocket))
    )
  }

  worker(node, inputs, outputs) {
    const editorNode = this.editor.nodes.find(n => n.id === node.id)
    delete editorNode.meta.errorMessage
    try {
      inputs = this.getSelectedLabelSchema(node).labels.map(label => ({
        labelIndex: label.index,
        tileGrid: inputs[`${label.id}`][0]
      })).filter(input => typeof input.tileGrid !== 'undefined')

      if (inputs.length === 0) {
        throw 'No inputs'
      }

      const zoom = Math.max(...inputs.map(input => input.tileGrid.zoom))

      const [x0, y0, x1, y1] = (inputs.length === 1)
        ? getExtent(inputs[0].tileGrid, zoom)
        : inputs.map(i => getExtent(i.tileGrid, zoom)).reduce((a, b) => mergeExtents(a, b))

      const out = editorNode.meta.output = outputs['out'] = new LabelledTileGrid(zoom, x0, y0, x1 - x0, y1 - y0, this.getSelectedLabelSchema(node))
      out.name = node.data.name || this.getSelectedLabelSchema(node).name

      inputs.forEach(input => {
        for (let x = out.x; x < out.x + out.width; ++x) {
          for (let y = out.y; y < out.y + out.height; ++y) {
            if (input.tileGrid.get(x, y, zoom)) {
              const existingLabelIndex = out.get(x, y)
              if (existingLabelIndex !== 255) {
                const existingLabelName = out.labelSchema.labels.find(label => label.index === existingLabelIndex).label
                const newLabelName = out.labelSchema.labels.find(label => label.index === input.labelIndex).label
                throw `Overlapping inputs: ${existingLabelName}, ${newLabelName}`
              }
              out.set(x, y, input.labelIndex)
            }
          }
        }
      })

      editorNode.controls.get('preview').update()
    }
    catch (ex) {
      editorNode.meta.errorMessage = ex
    }

    finally {
      editorNode.update()
    }
  }
}
