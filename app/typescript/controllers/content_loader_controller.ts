import { Controller } from "stimulus";
// @ts-ignore
import Turbolinks from "turbolinks";

export default class extends Controller {
  static targets = ["container"];
  declare readonly containerTarget: HTMLElement;

  static values = { interval: Number, url: String };
  declare readonly intervalValue: number;
  declare readonly urlValue: string;

  timer: any;

  connect(): void {
    this.timer = setInterval(this.refresh.bind(this), Math.floor(this.intervalValue));
  }

  disconnect(): void {
    clearInterval(this.timer);
  }

  refresh(): void {
    fetch(this.urlValue)
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        } else if (response.redirected) {
          Turbolinks.visit(response.url);
        } else {
          response.text().then((text) => (this.containerTarget.innerHTML = text));
        }
      })
      .catch(() => {}); // Ignore errors (and hope they are resolved before the next refresh)
  }
}
