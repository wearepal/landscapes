import { Controller } from "@hotwired/stimulus"

class HttpError extends Error {}

export default class extends Controller {
  static targets = ["label", "navigationButton"]

  connect() {
    this.numPendingPromises = 0
  }

  disconnect() {
    delete this.numPendingPromises
  }

  reclassify(event) {
    const label = this.labelTargets.find(target => target.checked)

    const formData = new FormData()
    formData.set("tile_index", event.target.dataset.tileIndex)
    formData.set("label_index", label.value)

    const originalColour = event.target.style.getPropertyValue("--label-colour")
    event.target.style.setProperty("--label-colour", label.dataset.colour)
    this.numPendingPromises++
    this.navigationButtonTargets.forEach(target => target.disabled = true)
    this.fetchWithRetry(
      `/labellings/${this.data.get("labelling-id")}/labelling_corrections`,
      {
        method: "POST",
        headers: {
          "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
        },
        body: formData
      }
    )
    .catch(error => {
      event.target.style.setProperty("--label-colour", originalColour)
      throw error
    })
    .finally(() => {
      this.numPendingPromises--
      if (this.numPendingPromises == 0) {
        this.navigationButtonTargets.forEach(target => target.disabled = false)
      }
    })
  }

  fetchWithRetry(input, init, retries = 10) {
    return fetch(input, init)
    .then(response => {
      if (!response.ok) {
        throw new HttpError(`HTTP ${response.status} ${response.statusText}`)
      }
    })
    .catch(async error => {
      if (!(error instanceof HttpError) && retries > 0) {
        await new Promise(r => setTimeout(r, 1000))
        return this.fetchWithRetry(input, init, retries - 1)
      }
      else {
        throw error
      }
    })
  }
}
