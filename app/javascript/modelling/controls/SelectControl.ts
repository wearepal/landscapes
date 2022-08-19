import { Control } from 'rete'
// @ts-ignore
import SelectField from './SelectField'

export class SelectControl extends Control {
  private component: { props: string[] };
  private props: { change: () => void; setId: any; getId: any; getOptions: any; label: any };
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
