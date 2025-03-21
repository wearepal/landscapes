import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["field", "swatch"]

  change(event) {
    this.swatchTarget.style.backgroundColor = `#${event.target.value}`
  }

  choosePreset(event) {
    this.fieldTarget.value = event.target.dataset.colour
    this.swatchTarget.style.backgroundColor = `#${event.target.dataset.colour}`
  }
}
