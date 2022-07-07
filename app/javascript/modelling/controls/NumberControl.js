"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberControl = void 0;
const rete_1 = require("rete");
const NumberField_1 = __importDefault(require("./NumberField"));
class NumberControl extends rete_1.Control {
    constructor(key, label = undefined) {
        super(key);
        this.component = NumberField_1.default;
        this.props = {
            getValue: this.getData.bind(this, key),
            setValue: this.putData.bind(this, key),
            label,
        };
    }
}
exports.NumberControl = NumberControl;
