import { Component, Input } from 'rete'
import { CheckboxControl } from '../controls/CheckboxControl'
import { SankeyDiagramControl } from '../controls/SankeyDiagramControl'
import { SelectControl } from '../controls/SelectControl'
import { layerSocket } from '../sockets'

export class SankeyComponent extends Component {
  constructor() {
    super('Sankey diagram')
    this.category = 'Charts'
  }

  builder(node) {
    if (!node.data.hasOwnProperty('linkColourMode')) {
      node.data.linkColourMode = 0
    }

    if (!node.data.hasOwnProperty('includeUnlabelledTiles')) {
      node.data.includeUnlabelledTiles = true
    }

    node.addControl(new SelectControl(
      'linkColourMode',
      () => [
        { id: 0, name: 'Gradient' },
        { id: 1, name: 'Left edge colour' },
        { id: 2, name: 'Right edge colour' },
      ],
      () => { node.update() },
      'Colour connections by'
    ))

    node.addControl(new CheckboxControl('includeUnlabelledTiles', 'Include "Other" category'))
    node.addInput(new Input('in', 'Inputs', layerSocket, true))
    node.addControl(new SankeyDiagramControl('sankey-diagram'))
  }

  worker(node, inputs, outputs) {
    console.log(node.data)
    const editorNode = this.editor.nodes.find(n => n.id === node.id)

    const inputNames = inputs['in'].map(input => input.name)
    const duplicateInputNames = new Set(inputNames.filter((inputName, i) => inputNames.indexOf(inputName) !== i))
    if (duplicateInputNames.size > 0) {
      editorNode.meta.errorMessage = "Duplicate input name(s): " + [...duplicateInputNames].join(", ")
      editorNode.update()
    }
    else {
      delete editorNode.meta.errorMessage
      const sankeyDiagramControl = editorNode.controls.get('sankey-diagram')
      sankeyDiagramControl.setIncludeUnlabelledTiles(editorNode.data.includeUnlabelledTiles)
      sankeyDiagramControl.setLinkColourMode(editorNode.data.linkColourMode)
      sankeyDiagramControl.setTitle(editorNode.data.name)
      sankeyDiagramControl.setLabellings(inputs['in'])
      editorNode.update()
    }
  }
}
