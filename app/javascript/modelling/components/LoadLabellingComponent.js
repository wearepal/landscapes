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
exports.LoadLabellingComponent = void 0;
const rete_1 = require("rete");
const SelectControl_1 = require("../controls/SelectControl");
const sockets_1 = require("../sockets");
const TileGrid_1 = require("../TileGrid");
class LoadLabellingComponent extends rete_1.Component {
    constructor(regions, labelSchemas) {
        super('Load labelling');
        this.category = 'Inputs & Outputs';
        this.regions = regions;
        this.labelSchemas = labelSchemas;
        // TODO: remove regions with no labellings
    }
    builder(node) {
        if (!this.getSelectedRegion(node)) {
            node.data.regionId = this.regions[0].id;
        }
        if (!this.getSelectedLabellingGroup(node)) {
            node.data.labellingGroupId = this.getSelectedRegion(node).labelling_groups[0].id;
        }
        node.addControl(new SelectControl_1.SelectControl('regionId', () => this.regions, this.updateRegion.bind(this, node), 'Region'));
        node.addControl(new SelectControl_1.SelectControl('labellingGroupId', () => this.getSelectedRegion(node).labelling_groups, this.updateOutputs.bind(this, node), 'Labelling'));
        this.updateOutputs(node);
    }
    worker(node, inputs, outputs) {
        return __awaiter(this, void 0, void 0, function* () {
            const labellingGroup = this.getSelectedLabellingGroup(node);
            yield Promise.all(labellingGroup.labellings.map((labelling) => __awaiter(this, void 0, void 0, function* () {
                const response = yield fetch(`/labellings/${labelling.id}.json`);
                const labellingData = yield response.json();
                const out = outputs[labelling.id.toString()] = new TileGrid_1.LabelledTileGrid(labellingData.zoom, labellingData.x, labellingData.y, labellingData.width, labellingData.height, this.labelSchemas.find(schema => schema.id === labellingGroup.label_schema_id));
                out.data = Uint8Array.from(atob(labellingData.data), c => c.charCodeAt(0));
                out.name = labelling.name;
            })));
        });
    }
    getSelectedRegion(node) {
        return this.regions.find(region => region.id === node.data.regionId);
    }
    getSelectedLabellingGroup(node) {
        return this.getSelectedRegion(node).labelling_groups.find(group => group.id === node.data.labellingGroupId);
    }
    updateRegion(node) {
        node.data.labellingGroupId = this.getSelectedRegion(node).labelling_groups[0].id;
        node.controls.get('labellingGroupId').update();
        this.updateOutputs(node);
    }
    updateOutputs(node) {
        node.getConnections().forEach(c => this.editor.removeConnection(c));
        Array.from(node.outputs.values()).forEach(output => node.removeOutput(output));
        this.getSelectedLabellingGroup(node).labellings.forEach(labelling => node.addOutput(new rete_1.Output(labelling.id.toString(), labelling.name, sockets_1.layerSocket)));
        node.update();
    }
}
exports.LoadLabellingComponent = LoadLabellingComponent;
