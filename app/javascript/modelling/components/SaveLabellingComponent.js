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
exports.SaveLabellingComponent = void 0;
const rete_1 = require("rete");
const SaveLabellingControl_1 = require("../controls/SaveLabellingControl");
const SelectControl_1 = require("../controls/SelectControl");
const TextControl_1 = require("../controls/TextControl");
const sockets_1 = require("../sockets");
const TileGrid_1 = require("../TileGrid");
class SaveLabellingComponent extends rete_1.Component {
    constructor(regions) {
        super('Save labelling');
        this.category = 'Inputs & Outputs';
        this.regions = regions;
    }
    builder(node) {
        var _a;
        if (!this.getSelectedRegion(node)) {
            node.data.regionId = (_a = this.regions[0]) === null || _a === void 0 ? void 0 : _a.id;
        }
        node.addControl(new SelectControl_1.SelectControl('regionId', () => this.regions, () => {
            this.updateInputs(node);
            node.update();
        }, 'Region'));
        node.addControl(new TextControl_1.TextControl('labellingGroupName', 'Name'));
        node.addControl(new SaveLabellingControl_1.SaveLabellingControl({
            saveClicked: this.save.bind(this, node),
            deleteClicked: this.deleteSaved.bind(this, node),
            enabled: () => node.meta.hasOwnProperty('output'),
        }));
        this.updateInputs(node);
    }
    worker(node, inputs, outputs) {
        const editorNode = this.editor.nodes.find(n => n.id === node.id);
        delete editorNode.meta.errorMessage;
        try {
            const out = editorNode.meta.output = this.getSelectedRegion(node).map_tile_layers.map(layer => ({
                mapTileLayerId: layer.id,
                labelling: inputs[layer.id.toString()][0]
            })).filter(layer => layer.labelling);
            if (out.length === 0) {
                throw 'No inputs';
            }
            if (new Set(out.map(layer => layer.labelling.labelSchema)).size > 1) {
                throw 'All inputs must have same label schema';
            }
            if (new Set(out.map(layer => layer.labelling.zoom)).size > 1) {
                throw 'All inputs must have same zoom level';
            }
        }
        catch (ex) {
            delete editorNode.meta.output;
            editorNode.meta.errorMessage = ex;
        }
        finally {
            editorNode.controls.get('labellingGroupId').update();
            editorNode.update();
        }
    }
    getSelectedRegion(node) {
        return this.regions.find(region => region.id === node.data.regionId);
    }
    updateInputs(node) {
        node.getConnections().forEach(c => this.editor.removeConnection(c));
        Array.from(node.inputs.values()).forEach(input => node.removeInput(input));
        this.getSelectedRegion(node).map_tile_layers.forEach(layer => node.addInput(new rete_1.Input(layer.id.toString(), layer.name, sockets_1.layerSocket)));
    }
    save(node) {
        return __awaiter(this, void 0, void 0, function* () {
            delete node.data.labellingGroupId;
            node.controls.get('labellingGroupId').update();
            const layers = node.meta.output;
            const zoom = layers[0].labelling.zoom;
            const [x0, y0, x1, y1] = (layers.length === 1)
                ? (0, TileGrid_1.getExtent)(layers[0].labelling, zoom)
                : layers.map(l => (0, TileGrid_1.getExtent)(l.labelling, zoom)).reduce(TileGrid_1.mergeExtents);
            const labellingGroupParams = new FormData();
            labellingGroupParams.set('labelling_group[name]', node.data.labellingGroupName);
            labellingGroupParams.set('labelling_group[label_schema_id]', node.meta.output[0].labelling.labelSchema.id);
            labellingGroupParams.set('labelling_group[zoom]', zoom);
            labellingGroupParams.set('labelling_group[x]', x0);
            labellingGroupParams.set('labelling_group[y]', y0);
            labellingGroupParams.set('labelling_group[width]', x1 - x0);
            labellingGroupParams.set('labelling_group[height]', y1 - y0);
            const createLabellingGroupResponse = yield fetch(`/regions/${this.getSelectedRegion(node).id}/labelling_groups`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
                },
                body: labellingGroupParams,
            });
            const labellingGroup = yield createLabellingGroupResponse.json();
            node.data.labellingGroupId = labellingGroup.id;
            node.controls.get('labellingGroupId').update();
            layers.forEach((layer) => __awaiter(this, void 0, void 0, function* () {
                const labellingParams = new FormData();
                labellingParams.set('labelling[map_tile_layer_id]', layer.mapTileLayerId);
                labellingParams.set('labelling[data]', btoa(new TextDecoder('ascii').decode(layer.labelling.data)));
                const response = yield fetch(`/labelling_groups/${labellingGroup.id}/labellings`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
                    },
                    body: labellingParams,
                });
                const response_body = yield response.text();
                console.log(response_body);
            }));
        });
    }
    deleteSaved(node) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fetch(`/labelling_groups/${node.data.labellingGroupId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
                },
            });
            delete node.data.labellingGroupId;
            node.controls.get('labellingGroupId').update();
        });
    }
}
exports.SaveLabellingComponent = SaveLabellingComponent;
