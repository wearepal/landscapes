import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["button"]

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
