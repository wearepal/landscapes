import { Control } from 'rete'
import Checkbox from './Checkbox'

export class CheckboxControl extends Control {
  constructor(key, label) {
    super(key)
    this.component = Checkbox
    this.props = {
      checked: this.getData.bind(this, key),
      setChecked: this.putData.bind(this, key),
      label,
    }
  }
}
