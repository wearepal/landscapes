"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumericConstantComponent = void 0;
const rete_1 = require("rete");
const NumberControl_1 = require("../controls/NumberControl");
const sockets_1 = require("../sockets");
const TileGrid_1 = require("../TileGrid");
class NumericConstantComponent extends rete_1.Component {
    constructor() {
        super('Numeric constant');
        this.category = 'Inputs & Outputs';
    }
    builder(node) {
        if (!node.data.hasOwnProperty('value')) {
            node.data.value = 0;
        }
        node.addControl(new NumberControl_1.NumberControl('value'));
        node.addOutput(new rete_1.Output('out', this.name, sockets_1.mapSocket));
    }
    worker(node, inputs, outputs) {
        outputs['out'] = new TileGrid_1.NumericTileGrid(0, 0, 0, 1, 1, node.data.value);
        outputs['out'].name = node.data.name;
    }
}
exports.NumericConstantComponent = NumericConstantComponent;
