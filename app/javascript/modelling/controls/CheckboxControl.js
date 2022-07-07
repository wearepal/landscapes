"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckboxControl = void 0;
const rete_1 = require("rete");
const Checkbox_1 = __importDefault(require("./Checkbox"));
class CheckboxControl extends rete_1.Control {
    constructor(key, label) {
        super(key);
        this.component = Checkbox_1.default;
        this.props = {
            checked: this.getData.bind(this, key),
            setChecked: this.putData.bind(this, key),
            label,
        };
    }
}
exports.CheckboxControl = CheckboxControl;
