import { Controller } from "stimulus";

function badgeFor(errors) {
  return errors ? `<span class="badge badge-danger mr-1">${errors[0]}</span>` : "";
}

function setClass(element, valid) {
  element.classList.toggle("is-valid", valid);
  element.classList.toggle("is-invalid", !valid);
}

export default class extends Controller {
  static targets = ["error", "field"];

  onError(event) {
    const [errors] = event.detail;
    this.errorTargets.forEach(
      (target) => (target.innerHTML = badgeFor(errors[target.dataset.field]))
    );
    this.fieldTargets.forEach((target) => setClass(target, errors[target.dataset.field] == null));
  }
}
