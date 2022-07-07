import { Control } from 'rete'
import PreviewImage from './PreviewImage'

export class PreviewControl extends Control {
  constructor(getTileGrid) {
    super('preview')
    this.component = PreviewImage
    this.props = { getTileGrid }
  }
}
