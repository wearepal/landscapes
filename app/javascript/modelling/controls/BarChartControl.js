import { Control } from 'rete'
import BarChart from './BarChart'

export class BarChartControl extends Control {
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
