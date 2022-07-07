"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stimulus_1 = require("stimulus");
class default_1 extends stimulus_1.Controller {
    onSubmit() {
        this.errorTarget.innerHTML = "";
    }
    onError() {
        this.errorTarget.innerHTML = '<div class="alert alert-danger">We don\'t recognise that email address and/or password.</div>';
    }
}
exports.default = default_1;
default_1.targets = ["error"];
