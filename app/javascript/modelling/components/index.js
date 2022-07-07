"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultComponents = void 0;
const BinaryOpComponent_1 = require("./BinaryOpComponent");
const DistanceMapComponent_1 = require("./DistanceMapComponent");
const InputLabellingComponent_1 = require("./InputLabellingComponent");
const InputOverlayComponent_1 = require("./InputOverlayComponent");
const NumericConstantComponent_1 = require("./NumericConstantComponent");
const BuildLabellingLayerComponent_1 = require("./BuildLabellingLayerComponent");
const UnaryOpComponent_1 = require("./UnaryOpComponent");
const sockets_1 = require("../sockets");
const VariadicOpComponent_1 = require("./VariadicOpComponent");
const SaveLabellingComponent_1 = require("./SaveLabellingComponent");
const LoadLabellingComponent_1 = require("./LoadLabellingComponent");
const SplitLabellingLayerComponent_1 = require("./SplitLabellingLayerComponent");
const AreaComponent_1 = require("./AreaComponent");
const BarChartComponent_1 = require("./BarChartComponent");
const SankeyComponent_1 = require("./SankeyComponent");
const MaskLabellingComponent_1 = require("./MaskLabellingComponent");
function createDefaultComponents({ label_schemas, regions }) {
    return [
        new InputLabellingComponent_1.InputLabellingComponent(label_schemas),
        new LoadLabellingComponent_1.LoadLabellingComponent(regions, label_schemas),
        new SplitLabellingLayerComponent_1.SplitLabellingLayerComponent(label_schemas),
        new InputOverlayComponent_1.InputOverlayComponent(regions),
        new BuildLabellingLayerComponent_1.BuildLabellingLayerComponent(label_schemas),
        new NumericConstantComponent_1.NumericConstantComponent(),
        new SaveLabellingComponent_1.SaveLabellingComponent(regions),
        new VariadicOpComponent_1.VariadicOpComponent('Union', '⋃', sockets_1.setSocket, sockets_1.setSocket, 'Set operations'),
        new VariadicOpComponent_1.VariadicOpComponent('Intersection', '⋂', sockets_1.setSocket, sockets_1.setSocket, 'Set operations'),
        new BinaryOpComponent_1.BinaryOpComponent('Set difference', '−', sockets_1.setSocket, sockets_1.setSocket, 'Set operations'),
        new VariadicOpComponent_1.VariadicOpComponent('Symmetric difference', 'Δ', sockets_1.setSocket, sockets_1.setSocket, 'Set operations'),
        new UnaryOpComponent_1.UnaryOpComponent('Complement', '′', 'postfix', sockets_1.setSocket, sockets_1.setSocket, 'Set operations'),
        new VariadicOpComponent_1.VariadicOpComponent('Sum', '∑', sockets_1.mapSocket, sockets_1.mapSocket, 'Arithmetic'),
        new VariadicOpComponent_1.VariadicOpComponent('Product', '∏', sockets_1.mapSocket, sockets_1.mapSocket, 'Arithmetic'),
        new BinaryOpComponent_1.BinaryOpComponent('Add', '+', sockets_1.mapSocket, sockets_1.mapSocket, 'Arithmetic'),
        new BinaryOpComponent_1.BinaryOpComponent('Subtract', '−', sockets_1.mapSocket, sockets_1.mapSocket, 'Arithmetic'),
        new BinaryOpComponent_1.BinaryOpComponent('Multiply', '×', sockets_1.mapSocket, sockets_1.mapSocket, 'Arithmetic'),
        new BinaryOpComponent_1.BinaryOpComponent('Divide', '÷', sockets_1.mapSocket, sockets_1.mapSocket, 'Arithmetic'),
        new BinaryOpComponent_1.BinaryOpComponent('Power', '^', sockets_1.mapSocket, sockets_1.mapSocket, 'Arithmetic'),
        new UnaryOpComponent_1.UnaryOpComponent('Negate', '−', 'prefix', sockets_1.mapSocket, sockets_1.mapSocket, 'Arithmetic'),
        new UnaryOpComponent_1.UnaryOpComponent('Reciprocal', '⁻¹', 'postfix', sockets_1.mapSocket, sockets_1.mapSocket, 'Arithmetic'),
        new BinaryOpComponent_1.BinaryOpComponent('Less', '<', sockets_1.mapSocket, sockets_1.setSocket, 'Comparisons'),
        new BinaryOpComponent_1.BinaryOpComponent('Greater', '>', sockets_1.mapSocket, sockets_1.setSocket, 'Comparisons'),
        new AreaComponent_1.AreaComponent(),
        new BarChartComponent_1.BarChartComponent(),
        new SankeyComponent_1.SankeyComponent(),
        new DistanceMapComponent_1.DistanceMapComponent(),
        new MaskLabellingComponent_1.MaskLabellingComponent(),
    ];
}
exports.createDefaultComponents = createDefaultComponents;
