import { Control } from 'rete'
import NumberField from './NumberField'

export class NumberControl extends Control {
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
