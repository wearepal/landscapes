"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaskLabellingComponent = void 0;
const rete_1 = require("rete");
const PreviewControl_1 = require("../controls/PreviewControl");
const TileGrid_1 = require("../TileGrid");
const sockets_1 = require("../sockets");
class MaskLabellingComponent extends rete_1.Component {
    constructor() {
        super("Mask labelling layer");
        this.category = 'Labellings';
    }
    builder(node) {
        node.addControl(new PreviewControl_1.PreviewControl(() => node.meta.output || new TileGrid_1.BooleanTileGrid(0, 0, 0, 1, 1)));
        node.addInput(new rete_1.Input('labelling', 'Layer', sockets_1.layerSocket));
        node.addInput(new rete_1.Input('mask', 'Mask', sockets_1.setSocket));
        node.addOutput(new rete_1.Output('out', 'Masked layer', sockets_1.layerSocket));
    }
    worker(node, inputs, outputs) {
        const editorNode = this.editor.nodes.find(n => n.id === node.id);
        const labelling = inputs['labelling'][0];
        const mask = inputs['mask'][0];
        if (labelling === undefined || mask === undefined) {
            editorNode.meta.errorMessage = 'Not enough inputs';
        }
        else if (mask.zoom > labelling.zoom) {
            editorNode.meta.errorMessage = `Mask zoom level (${mask.zoom}) must not exceed labelling zoom level (${labelling.zoom})`;
        }
        else {
            delete editorNode.meta.errorMessage;
            const out = editorNode.meta.output = outputs['out'] = new TileGrid_1.LabelledTileGrid(labelling.zoom, labelling.x, labelling.y, labelling.width, labelling.height, labelling.labelSchema);
            for (let x = labelling.x; x < labelling.x + labelling.width; ++x) {
                for (let y = labelling.y; y < labelling.y + labelling.height; ++y) {
                    out.set(x, y, mask.get(x, y, labelling.zoom) ? labelling.get(x, y) : 255);
                }
            }
            out.name = node.data.name || 'Masked layer';
            editorNode.controls.get('preview').update();
        }
        editorNode.update();
    }
}
exports.MaskLabellingComponent = MaskLabellingComponent;
