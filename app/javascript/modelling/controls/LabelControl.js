import { Control } from 'rete'
import Label from './Label'

export class LabelControl extends Control {
  constructor(key) {
    super(key)
    this.component = Label
    this.props = {
      getValue: this.getData.bind(this, key),
    }
  }
}
