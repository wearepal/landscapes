"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stimulus_1 = require("stimulus");
class default_1 extends stimulus_1.Controller {
    start(event) {
        this.progressTarget.classList.remove("d-none");
        this.progressBarTarget.style.width = "0%";
        this.statusTarget.innerText = "";
        this.progressBarTarget.classList.add("progress-bar-animated");
        this.progressBarTarget.classList.remove("bg-danger");
    }
    progress(event) {
        this.progressBarTarget.style.width = `${event.detail.progress}%`;
    }
    error(event) {
        this.progressBarTarget.classList.remove("progress-bar-animated");
        this.progressBarTarget.classList.add("bg-danger");
        this.progressBarTarget.style.width = "100%";
        this.statusTarget.innerText = event.detail.error;
        this.submitButtonTarget.disabled = false;
        event.preventDefault();
    }
}
exports.default = default_1;
default_1.targets = ["progress", "progressBar", "status", "submitButton"];
