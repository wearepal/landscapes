"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stimulus_1 = require("stimulus");
class default_1 extends stimulus_1.Controller {
    handleKey(event) {
        var _a;
        const { key } = event;
        (_a = this.buttonTargets.find(target => target.dataset.keyboardShortcut === key.toLowerCase())) === null || _a === void 0 ? void 0 : _a.dispatchEvent(new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        }));
    }
}
exports.default = default_1;
default_1.targets = ["button"];
