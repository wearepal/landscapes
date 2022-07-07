"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextControl = void 0;
const rete_1 = require("rete");
const TextField_1 = __importDefault(require("./TextField"));
class TextControl extends rete_1.Control {
    constructor(key, label = undefined) {
        super(key);
        this.component = TextField_1.default;
        this.props = {
            getValue: this.getData.bind(this, key),
            setValue: this.putData.bind(this, key),
            label,
        };
    }
}
exports.TextControl = TextControl;
