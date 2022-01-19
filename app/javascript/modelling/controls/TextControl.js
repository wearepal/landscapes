import { Control } from 'rete'
import TextField from './TextField'

export class TextControl extends Control {
  constructor(key, label = undefined) {
    super(key)
    this.component = TextField
    this.props = {
      getValue: this.getData.bind(this, key),
      setValue: this.putData.bind(this, key),
      label,
    }
  }
}
