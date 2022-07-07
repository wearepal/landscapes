"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stimulus_1 = require("stimulus");
function badgeFor(errors) {
    return errors ? `<span class="badge badge-danger mr-1">${errors[0]}</span>` : "";
}
function setClass(element, valid) {
    element.classList.toggle("is-valid", valid);
    element.classList.toggle("is-invalid", !valid);
}
class default_1 extends stimulus_1.Controller {
    onError(event) {
        const [errors] = event.detail;
        this.errorTargets.forEach((target) => (target.innerHTML = badgeFor(errors[target.dataset.field])));
        this.fieldTargets.forEach((target) => setClass(target, errors[target.dataset.field] == null));
    }
}
exports.default = default_1;
default_1.targets = ["error", "field"];
