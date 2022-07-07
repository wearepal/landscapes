import { Component, Input } from 'rete'
import { BarChartControl } from '../controls/BarChartControl'
import { mapSocket } from '../sockets'

export class BarChartComponent extends Component {
  constructor() {
    super('Bar chart')
    this.category = 'Charts'
  }

  builder(node) {
    node.addInput(new Input('in', 'Values', mapSocket, true))
    node.addControl(new BarChartControl('bar-chart'))
  }

  worker(node, inputs, outputs) {
    const editorNode = this.editor.nodes.find(n => n.id === node.id)
    editorNode.meta.variables = inputs['in'].map((grid, i) => ({ name: grid.name || `[Category ${i + 1}]`, value: grid.get(0, 0) })).sort((a, b) => b.value - a.value)

    const barChartControl = editorNode.controls.get('bar-chart')
    barChartControl.setTitle(editorNode.data.name)
    barChartControl.setVariables(editorNode.meta.variables)
  }
}
