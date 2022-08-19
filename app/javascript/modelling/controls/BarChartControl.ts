import { Control } from 'rete'
// @ts-ignore
import BarChart from './BarChart'

export class BarChartControl extends Control {
  private component: { data(): { width: number, d3: { version?: any } }; computed: any; directives: any; methods: any; mounted: void; updated: void; props: string[] };
  private props: { variables: any[]; title: string };
  private vueContext: any;
  constructor(key) {
    super(key)
    this.component = BarChart
    this.props = { title: '', variables: [] }
  }

  setTitle(title) {
    this.vueContext.title = title
  }

  setVariables(variables) {
    this.vueContext.variables = variables
  }
}
