"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stimulus_1 = require("stimulus");
// @ts-ignore
const turbolinks_1 = __importDefault(require("turbolinks"));
class default_1 extends stimulus_1.Controller {
    connect() {
        this.timer = setInterval(this.refresh.bind(this), Math.floor(this.intervalValue));
    }
    disconnect() {
        clearInterval(this.timer);
    }
    refresh() {
        fetch(this.urlValue)
            .then((response) => {
            if (!response.ok) {
                throw new Error();
            }
            else if (response.redirected) {
                turbolinks_1.default.visit(response.url);
            }
            else {
                response.text().then((text) => (this.containerTarget.innerHTML = text));
            }
        })
            .catch(() => { }); // Ignore errors (and hope they are resolved before the next refresh)
    }
}
exports.default = default_1;
default_1.targets = ["container"];
default_1.values = { interval: Number, url: String };
