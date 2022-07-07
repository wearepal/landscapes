"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stimulus_1 = require("stimulus");
class default_1 extends stimulus_1.Controller {
    update(event) {
        this.itemTargets.forEach((target) => {
            const searchText = target.innerText.toLocaleLowerCase();
            const searchTerms = event.target.value.toLocaleLowerCase().split(" ");
            if (searchTerms.every((term) => searchText.includes(term))) {
                target.classList.remove("d-none");
            }
            else {
                target.classList.add("d-none");
            }
        });
    }
}
exports.default = default_1;
default_1.targets = ["item"];
