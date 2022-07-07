import { Component, Input, Output } from 'rete'
import { PreviewControl } from '../controls/PreviewControl'
import { SelectControl } from '../controls/SelectControl'
import { layerSocket, setSocket } from '../sockets'
import { BooleanTileGrid, LabelledTileGrid } from '../TileGrid'

export class SplitLabellingLayerComponent extends Component {
  constructor(labelSchemas) {
    super('Split labelling layer')
    this.category = 'Labellings'
    this.labelSchemas = labelSchemas
  }

  builder(node) {
    if (!this.getSelectedLabelSchema(node)) {
      node.data.labelSchemaId = this.labelSchemas[0].id
    }

    node.addInput(new Input('in', 'Labelling layer', layerSocket))

    node.addControl(
      new SelectControl(
        'labelSchemaId',
        () => this.labelSchemas,
        this.updateOutputs.bind(this, node),
        'Label schema'
      )
    )

    node.addControl(new PreviewControl(() => 
      node.meta.output || new LabelledTileGrid(0, 0, 0, 1, 1)
    ))

    this.updateOutputs(node)
  }

  worker(node, inputs, outputs) {
    const editorNode = this.editor.nodes.find(n => n.id === node.id)
    editorNode.meta.output = inputs['in'][0]
    const labelling = inputs['in'][0]
    if (labelling.labelSchema === this.getSelectedLabelSchema(node)) {
      this.getSelectedLabelSchema(node).labels.forEach(label => {
        const out = outputs[label.index.toString()] = new BooleanTileGrid(
          labelling.zoom,
          labelling.x, labelling.y,
          labelling.width, labelling.height
        )
        labelling.data.forEach((idx, i) => out.data[i] = (label.index === idx))
      })
      delete editorNode.meta.errorMessage
    }
    else {
      editorNode.meta.errorMessage = `Unexpected input label schema (${labelling.labelSchema.name})`
    }
    editorNode.controls.get('preview').update()
    editorNode.update()
  }

  getSelectedLabelSchema(node) {
    return this.labelSchemas.find(schema =>
      schema.id === node.data.labelSchemaId
    )
  }

  updateOutputs(node) {
    node.getConnections().forEach(c => {
      if (c.input.node !== node) {
        this.editor.removeConnection(c)
      }
    })
    Array.from(node.outputs.values()).forEach(output => node.removeOutput(output))

    this.getSelectedLabelSchema(node).labels.forEach(label =>
      node.addOutput(new Output(label.index.toString(), label.label, setSocket))
    )

    node.update()
  }
}
