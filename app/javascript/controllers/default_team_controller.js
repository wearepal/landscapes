import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  async update(event) {
    const url = event.target.dataset.url
    const csrf = event.target.dataset.csrf

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'X-CSRF-Token': csrf,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'same-origin'
      })

      if (!response.ok) {
        const text = await response.text()
        console.error('Response not ok:', response.status, text)
        throw new Error(`Network response was not ok: ${response.status} ${text}`)
      }

      // Uncheck all other radio buttons
      document.querySelectorAll('input[name="default_team"]').forEach(radio => {
        if (radio !== event.target) {
          radio.checked = false
        }
      })

    } catch (error) {
      console.error('Error updating default team:', error)
      event.target.checked = !event.target.checked
    }
  }
} 