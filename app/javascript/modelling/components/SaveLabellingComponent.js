import { Component, Input } from 'rete'
import { SaveLabellingControl } from '../controls/SaveLabellingControl'
import { SelectControl } from '../controls/SelectControl'
import { TextControl } from '../controls/TextControl'
import { layerSocket } from '../sockets'
import { getExtent, mergeExtents } from '../TileGrid'

export class SaveLabellingComponent extends Component {
  constructor(regions) {
    super('Save labelling')
    this.category = 'Inputs & Outputs'
    this.regions = regions
  }

  builder(node) {
    if (!this.getSelectedRegion(node)) {
      node.data.regionId = this.regions[0]?.id
    }

    node.addControl(new SelectControl(
      'regionId',
      () => this.regions,
      () => {
        this.updateInputs(node)
        node.update()
      },
      'Region'
    ))
    node.addControl(new TextControl('labellingGroupName', 'Name'))
    node.addControl(new SaveLabellingControl({
      saveClicked: this.save.bind(this, node),
      deleteClicked: this.deleteSaved.bind(this, node),
      enabled: () => node.meta.hasOwnProperty('output'),
    }))

    this.updateInputs(node)
  }

  worker(node, inputs, outputs) {
    const editorNode = this.editor.nodes.find(n => n.id === node.id)
    delete editorNode.meta.errorMessage

    try {
      const out = editorNode.meta.output = this.getSelectedRegion(node).map_tile_layers.map(layer => (
        {
          mapTileLayerId: layer.id,
          labelling: inputs[layer.id.toString()][0]
        }
      )).filter(layer => layer.labelling)

      if (out.length === 0) {
        throw 'No inputs'
      }

      if (new Set(out.map(layer => layer.labelling.labelSchema)).size > 1) {
        throw 'All inputs must have same label schema'
      }

      if (new Set(out.map(layer => layer.labelling.zoom)).size > 1) {
        throw 'All inputs must have same zoom level'
      }
    }
    catch (ex) {
      delete editorNode.meta.output
      editorNode.meta.errorMessage = ex
    }
    finally {
      editorNode.controls.get('labellingGroupId').update()
      editorNode.update()
    }
  }

  getSelectedRegion(node) {
    return this.regions.find(region =>
      region.id === node.data.regionId
    )
  }

  updateInputs(node) {
    node.getConnections().forEach(c => this.editor.removeConnection(c))
    Array.from(node.inputs.values()).forEach(input => node.removeInput(input))

    this.getSelectedRegion(node).map_tile_layers.forEach(layer =>
      node.addInput(new Input(layer.id.toString(), layer.name, layerSocket))
    )
  }

  async save(node) {
    delete node.data.labellingGroupId
    node.controls.get('labellingGroupId').update()

    const layers = node.meta.output
    const zoom = layers[0].labelling.zoom
    const [x0, y0, x1, y1] = (layers.length === 1)
      ? getExtent(layers[0].labelling, zoom)
      : layers.map(l => getExtent(l.labelling, zoom)).reduce(mergeExtents)

    const labellingGroupParams = new FormData()
    labellingGroupParams.set('labelling_group[name]', node.data.labellingGroupName)
    labellingGroupParams.set('labelling_group[label_schema_id]', node.meta.output[0].labelling.labelSchema.id)
    labellingGroupParams.set('labelling_group[zoom]', zoom)
    labellingGroupParams.set('labelling_group[x]', x0)
    labellingGroupParams.set('labelling_group[y]', y0)
    labellingGroupParams.set('labelling_group[width]', x1 - x0)
    labellingGroupParams.set('labelling_group[height]', y1 - y0)

    const createLabellingGroupResponse = await fetch(`/regions/${this.getSelectedRegion(node).id}/labelling_groups`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
      },
      body: labellingGroupParams,
    })

    const labellingGroup = await createLabellingGroupResponse.json()
    node.data.labellingGroupId = labellingGroup.id
    node.controls.get('labellingGroupId').update()

    layers.forEach(async layer => {
      const labellingParams = new FormData()
      labellingParams.set('labelling[map_tile_layer_id]', layer.mapTileLayerId)
      labellingParams.set('labelling[data]', btoa(new TextDecoder('ascii').decode(layer.labelling.data)))

      const response = await fetch(`/labelling_groups/${labellingGroup.id}/labellings`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
        },
        body: labellingParams,
      })
      const response_body = await response.text()
      console.log(response_body)
    })
  }

  async deleteSaved(node) {
    await fetch(`/labelling_groups/${node.data.labellingGroupId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
      },
    })

    delete node.data.labellingGroupId
    node.controls.get('labellingGroupId').update()
  }
}
