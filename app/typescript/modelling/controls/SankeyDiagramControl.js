import { Control } from 'rete'
import SankeyDiagram from './SankeyDiagram'

export class SankeyDiagramControl extends Control {
  constructor(key) {
    super(key)
    this.component = SankeyDiagram
    this.props = { title: '', labellings: [], includeUnlabelledTiles: true, linkColourMode: 0 }
  }

  setTitle(title) {
    this.vueContext.title = title
  }

  setLabellings(labellings) {
    this.vueContext.labellings = labellings
  }

  setIncludeUnlabelledTiles(value) {
    this.vueContext.includeUnlabelledTiles = value
  }

  setLinkColourMode(value) {
    this.vueContext.linkColourMode = value
  }
}
