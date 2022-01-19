import { Control } from 'rete'
import SaveLabellingButton from './SaveLabellingButton'

export class SaveLabellingControl extends Control {
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
