import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["field", "swatch"]
  private swatchTarget: any;
  private fieldTarget: any;

  change(event) {
    this.swatchTarget.style.backgroundColor = `#${event.target.value}`
  }

  choosePreset(event) {
    this.fieldTarget.value = event.target.dataset.colour
    this.swatchTarget.style.backgroundColor = `#${event.target.dataset.colour}`
  }
}
