import { Controller } from "stimulus";

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

    const query = this.inputTarget.value.toLowerCase()

    localStorage.setItem("searchQuery", query)

    this.itemTargets.forEach(target => {
      const searchText = target.innerText.toLowerCase()
      const searchTerms = query.split(" ")
      
      if (searchTerms.every(term => searchText.includes(term))) {
        target.classList.remove("d-none")
        target.style.display = "flex"
      } else {
        target.classList.add("d-none")
        target.style.display = "none"
      }
    });
  }
}
