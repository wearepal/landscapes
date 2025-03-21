import { Controller } from "@hotwired/stimulus"
import axios from 'axios';

export default class extends Controller {
  static targets = [ "field", "suggestions" ]
  static values = { url: String }

  connect() {
    this.fieldTarget.addEventListener("input", this.autocomplete.bind(this))
  }

  async autocomplete() {
    const query = this.fieldTarget.value

    if (query.length < 2) {
      this.suggestionsTarget.innerHTML = ''
      this.suggestionsTarget.classList.remove("has-suggestions") // Remove border when empty
      return
    }

    try {
      const response = await axios.get(`/users/autocomplete?query=${query}`)
      const users = response.data

      if (users.length > 0) {
        this.suggestionsTarget.innerHTML = users.map(user => 
          `<div class="suggestion-item" data-action="click->autocomplete#selectUser" data-email="${user.email}">
             <strong>${user.name}</strong> (${user.email})
           </div>`
        ).join('')
        this.suggestionsTarget.classList.add("has-suggestions") // Add border when suggestions exist
      } else {
        this.suggestionsTarget.innerHTML = ''
        this.suggestionsTarget.classList.remove("has-suggestions") // Remove border if no suggestions
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error)
    }
  }

  selectUser(event) {
    const email = event.target.dataset.email
    this.fieldTarget.value = email
    this.suggestionsTarget.innerHTML = ''
    this.suggestionsTarget.classList.remove("has-suggestions") // Remove border after selection
  }
}
