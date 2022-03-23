import { createEmpty as createEmptyExtent, extend as extendExtent } from 'ol/extent'
import GeoJSON from 'ol/format/GeoJSON'
import GeometryType from 'ol/geom/GeometryType'
import { createXYZ } from 'ol/tilegrid'
import { Component, Output } from 'rete'
import { NumberControl } from '../controls/NumberControl'
import { PreviewControl } from '../controls/PreviewControl'
import { SelectControl } from '../controls/SelectControl'
import { setSocket } from '../sockets'
import { BooleanTileGrid } from '../TileGrid'
import { workerPool } from '../workerPool'

export class InputOverlayComponent extends Component {
  constructor(regions) {
    super('Input overlay')
    this.category = 'Inputs & Outputs'
    this.regions = regions.filter(region => region.overlays.length > 0)
  }

  getSelectedRegion(node) {
    return this.regions.find(region =>
      region.id === node.data.regionId
    )
  }

  getSelectedOverlay(node) {
    return this.getSelectedRegion(node).overlays.find(overlay =>
      overlay.id === node.data.overlayId
    )
  }

  builder(node) {
    if (!this.getSelectedRegion(node)) {
      node.data.regionId = this.regions[0]?.id
    }

    if (!this.getSelectedOverlay(node)) {
      node.data.overlayId = this.getSelectedRegion(node).overlays[0].id
    }

    if (!node.data.hasOwnProperty('zoom')) {
      node.data.zoom = 18
    }

    node.addOutput(new Output('out', 'Tiles intersecting overlay', setSocket))

    node.addControl(
      new SelectControl(
        'regionId',
        () => this.regions,
        () => {
          node.data.overlayId = this.getSelectedRegion(node).overlays[0].id
          node.controls.get("overlayId").update()
        },
        'Region'
      )
    )

    node.addControl(
      new SelectControl(
        'overlayId',
        () => this.getSelectedRegion(node).overlays,
        () => {},
        'Overlay'
      )
    )

    node.addControl(
      new NumberControl('zoom', 'Zoom level')
    )

    node.addControl(new PreviewControl(() => 
      node.meta.output || new BooleanTileGrid(0, 0, 0, 1, 1)
    ))
  }

  async worker(node, inputs, outputs) {
    const { overlayId, zoom } = node.data
    const editorNode = this.editor.nodes.find(n => n.id === node.id)

    editorNode.meta.output = outputs['out'] = await workerPool.queue(async worker => 
      worker.rasteriseOverlay(overlayId, zoom)
    )

    editorNode.controls.get('preview').update()
  }
}
