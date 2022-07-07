"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarChartComponent = void 0;
const rete_1 = require("rete");
const BarChartControl_1 = require("../controls/BarChartControl");
const sockets_1 = require("../sockets");
class BarChartComponent extends rete_1.Component {
    constructor() {
        super('Bar chart');
        this.category = 'Charts';
    }
    builder(node) {
        node.addInput(new rete_1.Input('in', 'Values', sockets_1.mapSocket, true));
        node.addControl(new BarChartControl_1.BarChartControl('bar-chart'));
    }
    worker(node, inputs, outputs) {
        const editorNode = this.editor.nodes.find(n => n.id === node.id);
        editorNode.meta.variables = inputs['in'].map((grid, i) => ({ name: grid.name || `[Category ${i + 1}]`, value: grid.get(0, 0) })).sort((a, b) => b.value - a.value);
        const barChartControl = editorNode.controls.get('bar-chart');
        barChartControl.setTitle(editorNode.data.name);
        barChartControl.setVariables(editorNode.meta.variables);
    }
}
exports.BarChartComponent = BarChartComponent;
