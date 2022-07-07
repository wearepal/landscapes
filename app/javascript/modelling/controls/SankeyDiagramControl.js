"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SankeyDiagramControl = void 0;
const rete_1 = require("rete");
const SankeyDiagram_1 = __importDefault(require("./SankeyDiagram"));
class SankeyDiagramControl extends rete_1.Control {
    constructor(key) {
        super(key);
        this.component = SankeyDiagram_1.default;
        this.props = { title: '', labellings: [], includeUnlabelledTiles: true, linkColourMode: 0 };
    }
    setTitle(title) {
        this.vueContext.title = title;
    }
    setLabellings(labellings) {
        this.vueContext.labellings = labellings;
    }
    setIncludeUnlabelledTiles(value) {
        this.vueContext.includeUnlabelledTiles = value;
    }
    setLinkColourMode(value) {
        this.vueContext.linkColourMode = value;
    }
}
exports.SankeyDiagramControl = SankeyDiagramControl;
