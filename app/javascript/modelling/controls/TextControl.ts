import { Control } from 'rete'
// @ts-ignore
import TextField from './TextField'

export class TextControl extends Control {
  private component: { props: string[] };
  private props: { getValue: any; setValue: any; label: any };
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
