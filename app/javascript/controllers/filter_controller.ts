import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [
    "item"
  ]
  private itemTargets: any;

  update(event) {
    this.itemTargets.forEach(target => {
      const searchText = target.innerText.toLocaleLowerCase()
      const searchTerms = event.target.value.toLocaleLowerCase().split(" ")
      if (searchTerms.every(term => searchText.includes(term))) {
        target.classList.remove("d-none")
      }
      else {
        target.classList.add("d-none")
      }
    })
  }
}
