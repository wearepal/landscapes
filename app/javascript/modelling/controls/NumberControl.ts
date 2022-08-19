import { Control } from 'rete'
// @ts-ignore
import NumberField from './NumberField'

export class NumberControl extends Control {
  private component: { props: string[] };
  private props: { getValue: any; setValue: any; label: any };
  constructor(key, label = undefined) {
    super(key)
    this.component = NumberField
    this.props = {
      getValue: this.getData.bind(this, key),
      setValue: this.putData.bind(this, key),
      label,
    }
  }
}
