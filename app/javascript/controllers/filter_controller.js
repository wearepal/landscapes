import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["input", "item"]

  connect() {
    const savedQuery = localStorage.getItem("searchQuery")
    if (savedQuery) {
      this.inputTarget.value = savedQuery
      this.update()
    }
  }

  update(event) {

    const query = !this.hasInputTarget ? event.target.value.toLocaleLowerCase() : this.inputTarget.value.toLowerCase()

    if(this.hasInputTarget) {
      localStorage.setItem("searchQuery", query)
    }
    
    this.itemTargets.forEach(target => {
      const searchText = target.innerText.toLowerCase()
      const searchTerms = query.split(" ")
      
      if (searchTerms.every(term => searchText.includes(term))) {
        target.classList.remove("d-none")
      } else {
        target.classList.add("d-none")
      }
    });
  }
}
