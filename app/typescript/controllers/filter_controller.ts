import { Controller } from "stimulus";

export default class extends Controller {
  static targets = ["item"];
  declare readonly itemTargets: HTMLElement[];

  update(event: any): void {
    this.itemTargets.forEach((target) => {
      const searchText = target.innerText.toLocaleLowerCase();
      const searchTerms = event.target.value.toLocaleLowerCase().split(" ");
      if (searchTerms.every((term: string) => searchText.includes(term))) {
        target.classList.remove("d-none");
      } else {
        target.classList.add("d-none");
      }
    });
  }
}
