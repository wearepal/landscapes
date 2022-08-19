import { Control } from 'rete'
// @ts-ignore
import Label from './Label'

export class LabelControl extends Control {
  private component: { methods: { getLabel(): any }; props: [string] };
  private props: { getValue: any };
  constructor(key) {
    super(key)
    this.component = Label
    this.props = {
      getValue: this.getData.bind(this, key),
    }
  }
}
