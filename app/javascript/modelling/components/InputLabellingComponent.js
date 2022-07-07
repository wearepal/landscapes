"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputLabellingComponent = void 0;
const rete_1 = require("rete");
const SelectControl_1 = require("../controls/SelectControl");
const sockets_1 = require("../sockets");
const TileGrid_1 = require("../TileGrid");
class InputLabellingComponent extends rete_1.Component {
    constructor(labelSchemas) {
        super('Input labelling');
        this.category = 'Inputs & Outputs';
        this.labelSchemas = labelSchemas;
        this.deprecated = true;
        // Remove empty labelling groups
        this.labelSchemas.forEach(schema => schema.labelling_groups = schema.labelling_groups.filter(group => group.labellings.length > 0));
        // Remove empty schemas
        this.labelSchemas = this.labelSchemas.filter(schema => schema.labelling_groups.length > 0);
    }
    builder(node) {
        if (!this.getSelectedLabelSchema(node)) {
            node.data.labelSchemaId = this.labelSchemas[0].id;
        }
        if (!this.getSelectedLabellingGroup(node)) {
            node.data.labellingGroupId = this.getSelectedLabelSchema(node).labelling_groups[0].id;
        }
        if (!this.getSelectedLabelling(node)) {
            node.data.labellingId = this.getSelectedLabellingGroup(node).labellings[0].id;
        }
        node.addControl(new SelectControl_1.SelectControl('labelSchemaId', () => this.labelSchemas, this.updateLabelSchema.bind(this, node), 'Label schema'));
        node.addControl(new SelectControl_1.SelectControl('labellingGroupId', () => this.getSelectedLabelSchema(node).labelling_groups, this.updateLabellingGroup.bind(this, node), 'Labelling'));
        node.addControl(new SelectControl_1.SelectControl('labellingId', () => this.getSelectedLabellingGroup(node).labellings.map(labelling => ({
            id: labelling.id,
            name: labelling.name,
        })), undefined, 'Layer'));
        this.updateOutputs(node);
    }
    getSelectedLabelSchema(node) {
        return this.labelSchemas.find(schema => schema.id === node.data.labelSchemaId);
    }
    getSelectedLabellingGroup(node) {
        return this.getSelectedLabelSchema(node).labelling_groups.find(group => group.id === node.data.labellingGroupId);
    }
    getSelectedLabelling(node) {
        return this.getSelectedLabellingGroup(node).labellings.find(labelling => labelling.id === node.data.labellingId);
    }
    updateLabelSchema(node) {
        this.updateOutputs(node);
        node.update();
        node.data.labellingGroupId = this.getSelectedLabelSchema(node).labelling_groups[0].id;
        node.data.labellingId = this.getSelectedLabellingGroup(node).labellings[0].id;
        node.controls.get("labellingGroupId").update();
        node.controls.get("labellingId").update();
    }
    updateLabellingGroup(node) {
        node.data.labellingId = this.getSelectedLabellingGroup(node).labellings[0].id;
        node.controls.get("labellingId").update();
    }
    updateOutputs(node) {
        node.getConnections().forEach(c => this.editor.removeConnection(c));
        Array.from(node.outputs.values()).forEach(output => node.removeOutput(output));
        this.getSelectedLabelSchema(node).labels.forEach(label => node.addOutput(new rete_1.Output(label.index.toString(), label.label, sockets_1.setSocket)));
    }
    worker(node, inputs, outputs) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`/labellings/${node.data.labellingId}.json`);
            const labelling = yield response.json();
            labelling.data = Array.from(Uint8Array.from(atob(labelling.data), c => c.charCodeAt(0)));
            this.getSelectedLabelSchema(node).labels.forEach(label => {
                const out = outputs[label.index.toString()] = new TileGrid_1.BooleanTileGrid(labelling.zoom, labelling.x, labelling.y, labelling.width, labelling.height);
                labelling.data.forEach((idx, i) => out.data[i] = (label.index === idx));
            });
        });
    }
}
exports.InputLabellingComponent = InputLabellingComponent;
