"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarChartControl = void 0;
const rete_1 = require("rete");
const BarChart_1 = __importDefault(require("./BarChart"));
class BarChartControl extends rete_1.Control {
    constructor(key) {
        super(key);
        this.component = BarChart_1.default;
        this.props = { title: '', variables: [] };
    }
    setTitle(title) {
        this.vueContext.title = title;
    }
    setVariables(variables) {
        this.vueContext.variables = variables;
    }
}
exports.BarChartControl = BarChartControl;
