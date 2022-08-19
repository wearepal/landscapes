import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["button"]
    private buttonTargets: any;

  handleKey(event) {
    const { key } = event
    this.buttonTargets.find(target =>
      target.dataset.keyboardShortcut === key.toLowerCase()
    )?.dispatchEvent(
      new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      })
    )
  }
}
