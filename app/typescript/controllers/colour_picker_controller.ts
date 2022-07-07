import { Controller } from "stimulus";

export default class extends Controller {
  static targets = ["field", "swatch"];

  declare readonly fieldTarget: HTMLInputElement;
  declare readonly swatchTarget: HTMLElement;

  change(event: any): void {
    this.swatchTarget.style.backgroundColor = `#${event.target.value}`;
  }

  choosePreset(event: any): void {
    this.fieldTarget.value = event.target.dataset.colour;
    this.swatchTarget.style.backgroundColor = `#${event.target.dataset.colour}`;
  }
}
