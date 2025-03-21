import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["error"]

  onSubmit() {
    this.errorTarget.innerHTML = ""
  }

  onError() {
    this.errorTarget.innerHTML = '<div class="alert alert-danger">We don\'t recognise that email address and/or password.</div>'
  }
}
