import { Control } from 'rete'
// @ts-ignore
import Checkbox from './Checkbox'

export class CheckboxControl extends Control {
  private component: { data(): { id: string }; props: string[] };
  private props: { setChecked: any; checked: any; label: any };
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
