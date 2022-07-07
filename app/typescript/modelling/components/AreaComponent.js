import { getArea } from 'ol/sphere'
import { fromExtent } from 'ol/geom/Polygon'
import { createXYZ } from 'ol/tilegrid'
import { Component, Input, Output } from 'rete'
import { LabelControl } from '../controls/LabelControl'
import { mapSocket, setSocket } from '../sockets'
import { NumericTileGrid } from '../TileGrid'

export class AreaComponent extends Component {
  constructor() {
    super('Area')
    this.category = 'Calculations'
  }

  builder(node) {
    node.data.summary = '0 km²'
    node.addInput(new Input('in', 'Set', setSocket))
    node.addOutput(new Output('out', 'Area', mapSocket))
    node.addControl(new LabelControl('summary'))
  }

  worker(node, inputs, outputs) {
    const tileGrid = createXYZ()

    const input = inputs['in'][0]
    let numTiles = 0
    let totalArea = 0
    for (let x = input.x; x < input.x + input.width; ++x) {
      for (let y = input.y; y < input.y + input.height; ++y) {
        if (input.get(x, y)) {
          ++numTiles
          totalArea += getArea(fromExtent(tileGrid.getTileCoordExtent([input.zoom, x, y])))
        }
      }
    }
    totalArea /= 1000000
    outputs['out'] = new NumericTileGrid(0, 0, 0, 1, 1, totalArea)
    outputs['out'].name = node.data.name
    // TODO: this should be node meta not data(?)
    node.data.summary = `${totalArea.toLocaleString()} km²`

    const editorNode = this.editor.nodes.find(n => n.id === node.id)
    editorNode.controls.get('summary').update()
  }
}
