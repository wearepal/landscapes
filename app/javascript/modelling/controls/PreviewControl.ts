import { Control } from 'rete'
// @ts-ignore
import PreviewImage from './PreviewImage'

export class PreviewControl extends Control {
  private component: { methods: { draw(): void }; mounted(): void; updated(): void; props: [string] };
  private props: { getTileGrid: any };
  constructor(getTileGrid) {
    super('preview')
    this.component = PreviewImage
    this.props = { getTileGrid }
  }
}
