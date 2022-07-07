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
exports.InputOverlayComponent = void 0;
const rete_1 = require("rete");
const NumberControl_1 = require("../controls/NumberControl");
const PreviewControl_1 = require("../controls/PreviewControl");
const SelectControl_1 = require("../controls/SelectControl");
const sockets_1 = require("../sockets");
const TileGrid_1 = require("../TileGrid");
const workerPool_1 = require("../workerPool");
class InputOverlayComponent extends rete_1.Component {
    constructor(regions) {
        super('Input overlay');
        this.category = 'Inputs & Outputs';
        this.regions = regions.filter(region => region.overlays.length > 0);
    }
    getSelectedRegion(node) {
        return this.regions.find(region => region.id === node.data.regionId);
    }
    getSelectedOverlay(node) {
        return this.getSelectedRegion(node).overlays.find(overlay => overlay.id === node.data.overlayId);
    }
    builder(node) {
        var _a;
        if (!this.getSelectedRegion(node)) {
            node.data.regionId = (_a = this.regions[0]) === null || _a === void 0 ? void 0 : _a.id;
        }
        if (!this.getSelectedOverlay(node)) {
            node.data.overlayId = this.getSelectedRegion(node).overlays[0].id;
        }
        if (!node.data.hasOwnProperty('zoom')) {
            node.data.zoom = 18;
        }
        node.addOutput(new rete_1.Output('out', 'Tiles intersecting overlay', sockets_1.setSocket));
        node.addControl(new SelectControl_1.SelectControl('regionId', () => this.regions, () => {
            node.data.overlayId = this.getSelectedRegion(node).overlays[0].id;
            node.controls.get("overlayId").update();
        }, 'Region'));
        node.addControl(new SelectControl_1.SelectControl('overlayId', () => this.getSelectedRegion(node).overlays, () => { }, 'Overlay'));
        node.addControl(new NumberControl_1.NumberControl('zoom', 'Zoom level'));
        node.addControl(new PreviewControl_1.PreviewControl(() => node.meta.output || new TileGrid_1.BooleanTileGrid(0, 0, 0, 1, 1)));
    }
    worker(node, inputs, outputs) {
        return __awaiter(this, void 0, void 0, function* () {
            const { overlayId, zoom } = node.data;
            const editorNode = this.editor.nodes.find(n => n.id === node.id);
            editorNode.meta.output = outputs['out'] = yield workerPool_1.workerPool.queue((worker) => __awaiter(this, void 0, void 0, function* () { return worker.rasteriseOverlay(overlayId, zoom); }));
            editorNode.controls.get('preview').update();
        });
    }
}
exports.InputOverlayComponent = InputOverlayComponent;
