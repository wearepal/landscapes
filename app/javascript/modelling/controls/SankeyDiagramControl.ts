import { Control } from 'rete'
// @ts-ignore
import SankeyDiagram from './SankeyDiagram'

export class SankeyDiagramControl extends Control {
  private component: { data(): { d3: any, height: number }; computed: { width(): number, sankey(): any, graph(): ({}) }; props: string[] };
  private props: { includeUnlabelledTiles: boolean; labellings: any[]; title: string; linkColourMode: number };
  private vueContext: any;
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
