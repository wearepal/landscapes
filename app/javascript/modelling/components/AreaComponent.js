"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AreaComponent = void 0;
const sphere_1 = require("ol/sphere");
const Polygon_1 = require("ol/geom/Polygon");
const tilegrid_1 = require("ol/tilegrid");
const rete_1 = require("rete");
const LabelControl_1 = require("../controls/LabelControl");
const sockets_1 = require("../sockets");
const TileGrid_1 = require("../TileGrid");
class AreaComponent extends rete_1.Component {
    constructor() {
        super('Area');
        this.category = 'Calculations';
    }
    builder(node) {
        node.data.summary = '0 km²';
        node.addInput(new rete_1.Input('in', 'Set', sockets_1.setSocket));
        node.addOutput(new rete_1.Output('out', 'Area', sockets_1.mapSocket));
        node.addControl(new LabelControl_1.LabelControl('summary'));
    }
    worker(node, inputs, outputs) {
        const tileGrid = (0, tilegrid_1.createXYZ)();
        const input = inputs['in'][0];
        let numTiles = 0;
        let totalArea = 0;
        for (let x = input.x; x < input.x + input.width; ++x) {
            for (let y = input.y; y < input.y + input.height; ++y) {
                if (input.get(x, y)) {
                    ++numTiles;
                    totalArea += (0, sphere_1.getArea)((0, Polygon_1.fromExtent)(tileGrid.getTileCoordExtent([input.zoom, x, y])));
                }
            }
        }
        totalArea /= 1000000;
        outputs['out'] = new TileGrid_1.NumericTileGrid(0, 0, 0, 1, 1, totalArea);
        outputs['out'].name = node.data.name;
        // TODO: this should be node meta not data(?)
        node.data.summary = `${totalArea.toLocaleString()} km²`;
        const editorNode = this.editor.nodes.find(n => n.id === node.id);
        editorNode.controls.get('summary').update();
    }
}
exports.AreaComponent = AreaComponent;
