import { Control } from 'rete'
// @ts-ignore
import SaveLabellingButton from './SaveLabellingButton'

export class SaveLabellingControl extends Control {
  private component: { props: string[] };
  private props: { getLabellingGroupId: any; deleteClicked: any; enabled: any; saveClicked: any };
  constructor({ enabled, saveClicked, deleteClicked }) {
    super('labellingGroupId')
    this.component = SaveLabellingButton
    this.props = {
      getLabellingGroupId: this.getData.bind(this, 'labellingGroupId'),
      enabled,
      saveClicked,
      deleteClicked,
    }
  }
}
