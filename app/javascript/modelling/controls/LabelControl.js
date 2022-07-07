"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabelControl = void 0;
const rete_1 = require("rete");
const Label_1 = __importDefault(require("./Label"));
class LabelControl extends rete_1.Control {
    constructor(key) {
        super(key);
        this.component = Label_1.default;
        this.props = {
            getValue: this.getData.bind(this, key),
        };
    }
}
exports.LabelControl = LabelControl;
