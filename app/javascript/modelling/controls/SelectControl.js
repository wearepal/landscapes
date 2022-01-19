import { Control } from 'rete'
import SelectField from './SelectField'

export class SelectControl extends Control {
  constructor(key, getOptions, change = () => {}, label = undefined) {
    super(key)
    this.component = SelectField
    this.props = {
      getId: this.getData.bind(this, key),
      setId: this.putData.bind(this, key),
      getOptions,
      change,
      label,
    }
  }
}
