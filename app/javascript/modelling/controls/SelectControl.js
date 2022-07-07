"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectControl = void 0;
const rete_1 = require("rete");
const SelectField_1 = __importDefault(require("./SelectField"));
class SelectControl extends rete_1.Control {
    constructor(key, getOptions, change = () => { }, label = undefined) {
        super(key);
        this.component = SelectField_1.default;
        this.props = {
            getId: this.getData.bind(this, key),
            setId: this.putData.bind(this, key),
            getOptions,
            change,
            label,
        };
    }
}
exports.SelectControl = SelectControl;
