import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["container"]

  connect() {
    this.timer = setInterval(this.refresh.bind(this), parseInt(this.data.get("interval")))
  }

  disconnect() {
    clearInterval(this.timer)
  }

  refresh() {
    fetch(this.data.get("url"))
    .then(response => {
      if (!response.ok) {
        throw new Error()
      }
      else if (response.redirected) {
        Turbolinks.visit(response.url)
      }
      else {
        response.text().then(text => this.containerTarget.innerHTML = text)
      }
    })
    .catch(() => {}) // Ignore errors (and hope they are resolved before the next refresh)
  }
}
