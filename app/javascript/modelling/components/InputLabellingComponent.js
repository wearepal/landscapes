import { Component, Output } from 'rete'
import { SelectControl } from '../controls/SelectControl'
import { setSocket } from '../sockets'
import { BooleanTileGrid } from '../TileGrid'

export class InputLabellingComponent extends Component {
  constructor(labelSchemas) {
    super('Input labelling')
    this.category = 'Inputs & Outputs'
    this.labelSchemas = labelSchemas
    this.deprecated = true

    // Remove empty labelling groups
    this.labelSchemas.forEach(schema =>
      schema.labelling_groups = schema.labelling_groups.filter(group =>
        group.labellings.length > 0
      )
    )

    // Remove empty schemas
    this.labelSchemas = this.labelSchemas.filter(schema =>
      schema.labelling_groups.length > 0
    )
  }

  builder(node) {
    if (!this.getSelectedLabelSchema(node)) {
      node.data.labelSchemaId = this.labelSchemas[0].id
    }

    if (!this.getSelectedLabellingGroup(node)) {
      node.data.labellingGroupId = this.getSelectedLabelSchema(node).labelling_groups[0].id
    }

    if (!this.getSelectedLabelling(node)) {
      node.data.labellingId = this.getSelectedLabellingGroup(node).labellings[0].id
    }

    node.addControl(
      new SelectControl(
        'labelSchemaId',
        () => this.labelSchemas,
        this.updateLabelSchema.bind(this, node),
        'Label schema'
      )
    )

    node.addControl(
      new SelectControl(
        'labellingGroupId',
        () => this.getSelectedLabelSchema(node).labelling_groups,
        this.updateLabellingGroup.bind(this, node),
        'Labelling'
      )
    )

    node.addControl(
      new SelectControl(
        'labellingId',
        () => this.getSelectedLabellingGroup(node).labellings.map(labelling => ({
          id: labelling.id,
          name: labelling.name,
        })),
        undefined,
        'Layer'
      )
    )

    this.updateOutputs(node)
  }

  getSelectedLabelSchema(node) {
    return this.labelSchemas.find(schema =>
      schema.id === node.data.labelSchemaId
    )
  }

  getSelectedLabellingGroup(node) {
    return this.getSelectedLabelSchema(node).labelling_groups.find(group =>
      group.id === node.data.labellingGroupId
    )
  }

  getSelectedLabelling(node) {
    return this.getSelectedLabellingGroup(node).labellings.find(labelling =>
      labelling.id === node.data.labellingId
    )
  }

  updateLabelSchema(node) {
    this.updateOutputs(node)
    node.update()

    node.data.labellingGroupId = this.getSelectedLabelSchema(node).labelling_groups[0].id
    node.data.labellingId = this.getSelectedLabellingGroup(node).labellings[0].id

    node.controls.get("labellingGroupId").update()
    node.controls.get("labellingId").update()
  }

  updateLabellingGroup(node) {
    node.data.labellingId = this.getSelectedLabellingGroup(node).labellings[0].id
    node.controls.get("labellingId").update()
  }

  updateOutputs(node) {
    node.getConnections().forEach(c => this.editor.removeConnection(c))
    Array.from(node.outputs.values()).forEach(output => node.removeOutput(output))

    this.getSelectedLabelSchema(node).labels.forEach(label =>
      node.addOutput(new Output(label.index.toString(), label.label, setSocket))
    )
  }

  async worker(node, inputs, outputs) {
    const response = await fetch(`/labellings/${node.data.labellingId}.json`)
    const labelling = await response.json()
    labelling.data = Array.from(Uint8Array.from(atob(labelling.data), c => c.charCodeAt(0)))

    this.getSelectedLabelSchema(node).labels.forEach(label => {
      const out = outputs[label.index.toString()] = new BooleanTileGrid(
        labelling.zoom,
        labelling.x, labelling.y,
        labelling.width, labelling.height
      )
      labelling.data.forEach((idx, i) => out.data[i] = (label.index === idx))
    })
  }
}
