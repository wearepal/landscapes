"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SankeyComponent = void 0;
const rete_1 = require("rete");
const CheckboxControl_1 = require("../controls/CheckboxControl");
const SankeyDiagramControl_1 = require("../controls/SankeyDiagramControl");
const SelectControl_1 = require("../controls/SelectControl");
const sockets_1 = require("../sockets");
class SankeyComponent extends rete_1.Component {
    constructor() {
        super('Sankey diagram');
        this.category = 'Charts';
    }
    builder(node) {
        if (!node.data.hasOwnProperty('linkColourMode')) {
            node.data.linkColourMode = 0;
        }
        if (!node.data.hasOwnProperty('includeUnlabelledTiles')) {
            node.data.includeUnlabelledTiles = true;
        }
        node.addControl(new SelectControl_1.SelectControl('linkColourMode', () => [
            { id: 0, name: 'Gradient' },
            { id: 1, name: 'Left edge colour' },
            { id: 2, name: 'Right edge colour' },
        ], () => { node.update(); }, 'Colour connections by'));
        node.addControl(new CheckboxControl_1.CheckboxControl('includeUnlabelledTiles', 'Include "Other" category'));
        node.addInput(new rete_1.Input('in', 'Inputs', sockets_1.layerSocket, true));
        node.addControl(new SankeyDiagramControl_1.SankeyDiagramControl('sankey-diagram'));
    }
    worker(node, inputs, outputs) {
        console.log(node.data);
        const editorNode = this.editor.nodes.find(n => n.id === node.id);
        const inputNames = inputs['in'].map(input => input.name);
        const duplicateInputNames = new Set(inputNames.filter((inputName, i) => inputNames.indexOf(inputName) !== i));
        if (duplicateInputNames.size > 0) {
            editorNode.meta.errorMessage = "Duplicate input name(s): " + [...duplicateInputNames].join(", ");
            editorNode.update();
        }
        else {
            delete editorNode.meta.errorMessage;
            const sankeyDiagramControl = editorNode.controls.get('sankey-diagram');
            sankeyDiagramControl.setIncludeUnlabelledTiles(editorNode.data.includeUnlabelledTiles);
            sankeyDiagramControl.setLinkColourMode(editorNode.data.linkColourMode);
            sankeyDiagramControl.setTitle(editorNode.data.name);
            sankeyDiagramControl.setLabellings(inputs['in']);
            editorNode.update();
        }
    }
}
exports.SankeyComponent = SankeyComponent;
