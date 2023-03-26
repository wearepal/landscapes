import { Component, Output } from 'rete'
import { NumberControl } from '../controls/NumberControl'
import { mapSocket } from '../sockets'
import { NumericTileGrid } from '../../projects/modelling/tile_grid'

export class NumericConstantComponent extends Component {
  constructor() {
    super('Numeric constant')
    this.category = 'Inputs & Outputs'
  }

  builder(node) {
    if (!node.data.hasOwnProperty('value')) {
      node.data.value = 0
    }
    node.addControl(new NumberControl('value'))
    node.addOutput(new Output('out', this.name, mapSocket))
  }

  worker(node, inputs, outputs) {
    outputs['out'] = new NumericTileGrid(0, 0, 0, 1, 1, node.data.value)
    outputs['out'].name = node.data.name
  }
}
