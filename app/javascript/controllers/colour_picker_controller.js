"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stimulus_1 = require("stimulus");
class default_1 extends stimulus_1.Controller {
    change(event) {
        this.swatchTarget.style.backgroundColor = `#${event.target.value}`;
    }
    choosePreset(event) {
        this.fieldTarget.value = event.target.dataset.colour;
        this.swatchTarget.style.backgroundColor = `#${event.target.dataset.colour}`;
    }
}
exports.default = default_1;
default_1.targets = ["field", "swatch"];
