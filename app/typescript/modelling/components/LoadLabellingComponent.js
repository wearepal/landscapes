import { Component, Output } from 'rete'
import { SelectControl } from '../controls/SelectControl'
import { layerSocket } from '../sockets'
import { LabelledTileGrid } from '../TileGrid'

export class LoadLabellingComponent extends Component {
  constructor(regions, labelSchemas) {
    super('Load labelling')
    this.category = 'Inputs & Outputs'
    this.regions = regions
    this.labelSchemas = labelSchemas

    // TODO: remove regions with no labellings
  }

  builder(node) {
    if (!this.getSelectedRegion(node)) {
      node.data.regionId = this.regions[0].id
    }

    if (!this.getSelectedLabellingGroup(node)) {
      node.data.labellingGroupId = this.getSelectedRegion(node).labelling_groups[0].id
    }

    node.addControl(
      new SelectControl(
        'regionId',
        () => this.regions,
        this.updateRegion.bind(this, node),
        'Region'
      )
    )

    node.addControl(
      new SelectControl(
        'labellingGroupId',
        () => this.getSelectedRegion(node).labelling_groups,
        this.updateOutputs.bind(this, node),
        'Labelling'
      )
    )

    this.updateOutputs(node)
  }

  async worker(node, inputs, outputs) {
    const labellingGroup = this.getSelectedLabellingGroup(node)
    await Promise.all(
      labellingGroup.labellings.map(async labelling => {
        const response = await fetch(`/labellings/${labelling.id}.json`)
        const labellingData = await response.json()

        const out = outputs[labelling.id.toString()] = new LabelledTileGrid(
          labellingData.zoom,
          labellingData.x,
          labellingData.y,
          labellingData.width,
          labellingData.height,
          this.labelSchemas.find(schema => schema.id === labellingGroup.label_schema_id)
        )
        out.data = Uint8Array.from(atob(labellingData.data), c => c.charCodeAt(0))
        out.name = labelling.name
      })
    )
  }

  getSelectedRegion(node) {
    return this.regions.find(region =>
      region.id === node.data.regionId
    )
  }

  getSelectedLabellingGroup(node) {
    return this.getSelectedRegion(node).labelling_groups.find(group =>
      group.id === node.data.labellingGroupId
    )
  }

  updateRegion(node) {
    node.data.labellingGroupId = this.getSelectedRegion(node).labelling_groups[0].id
    node.controls.get('labellingGroupId').update()
    this.updateOutputs(node)
  }

  updateOutputs(node) {
    node.getConnections().forEach(c => this.editor.removeConnection(c))
    Array.from(node.outputs.values()).forEach(output => node.removeOutput(output))

    this.getSelectedLabellingGroup(node).labellings.forEach(labelling =>
      node.addOutput(new Output(labelling.id.toString(), labelling.name, layerSocket))
    )

    node.update()
  }
}
