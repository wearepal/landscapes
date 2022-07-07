"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.performOperation = void 0;
const TileGrid_1 = require("../TileGrid");
const operations = new Map();
operations.set('Union', { inputType: TileGrid_1.BooleanTileGrid, outputType: TileGrid_1.BooleanTileGrid, fn: (...inputs) => inputs.reduce((a, b) => a || b) });
operations.set('Intersection', { inputType: TileGrid_1.BooleanTileGrid, outputType: TileGrid_1.BooleanTileGrid, fn: (...inputs) => inputs.reduce((a, b) => a && b) });
operations.set('Set difference', { inputType: TileGrid_1.BooleanTileGrid, outputType: TileGrid_1.BooleanTileGrid, fn: (a, b) => (a && !b) });
operations.set('Symmetric difference', { inputType: TileGrid_1.BooleanTileGrid, outputType: TileGrid_1.BooleanTileGrid, fn: (...inputs) => inputs.reduce((a, b) => (a || b) && !(a && b)) });
operations.set('Sum', { inputType: TileGrid_1.NumericTileGrid, outputType: TileGrid_1.NumericTileGrid, fn: (...inputs) => inputs.reduce((a, b) => a + b) });
operations.set('Product', { inputType: TileGrid_1.NumericTileGrid, outputType: TileGrid_1.NumericTileGrid, fn: (...inputs) => inputs.reduce((a, b) => a * b) });
operations.set('Add', { inputType: TileGrid_1.NumericTileGrid, outputType: TileGrid_1.NumericTileGrid, fn: (a, b) => (a + b) });
operations.set('Subtract', { inputType: TileGrid_1.NumericTileGrid, outputType: TileGrid_1.NumericTileGrid, fn: (a, b) => (a - b) });
operations.set('Multiply', { inputType: TileGrid_1.NumericTileGrid, outputType: TileGrid_1.NumericTileGrid, fn: (a, b) => (a * b) });
operations.set('Divide', { inputType: TileGrid_1.NumericTileGrid, outputType: TileGrid_1.NumericTileGrid, fn: (a, b) => (a / b) });
operations.set('Power', { inputType: TileGrid_1.NumericTileGrid, outputType: TileGrid_1.NumericTileGrid, fn: (a, b) => Math.pow(a, b) });
operations.set('Less', { inputType: TileGrid_1.NumericTileGrid, outputType: TileGrid_1.BooleanTileGrid, fn: (a, b) => (a < b) });
operations.set('Greater', { inputType: TileGrid_1.NumericTileGrid, outputType: TileGrid_1.BooleanTileGrid, fn: (a, b) => (a > b) });
operations.set('Complement', { inputType: TileGrid_1.BooleanTileGrid, outputType: TileGrid_1.BooleanTileGrid, fn: a => (!a) });
operations.set('Negate', { inputType: TileGrid_1.NumericTileGrid, outputType: TileGrid_1.NumericTileGrid, fn: a => (-a) });
operations.set('Reciprocal', { inputType: TileGrid_1.NumericTileGrid, outputType: TileGrid_1.NumericTileGrid, fn: a => (1 / a) });
function performOperation(operationName, ...inputs) {
    const operation = operations.get(operationName);
    const zoom = Math.max(...inputs.map(i => i.zoom));
    const combineExtents = (operation.inputType === TileGrid_1.BooleanTileGrid) ? TileGrid_1.mergeExtents : TileGrid_1.intersectExtents;
    const [x0, y0, x1, y1] = (inputs.length === 1)
        ? (0, TileGrid_1.getExtent)(inputs[0], zoom)
        : inputs.map(i => (0, TileGrid_1.getExtent)(i, zoom)).reduce((a, b) => combineExtents(a, b));
    const out = new operation.outputType(zoom, x0, y0, x1 - x0, y1 - y0);
    for (let x = out.x; x < out.x + out.width; ++x) {
        for (let y = out.y; y < out.y + out.height; ++y) {
            out.set(x, y, operation.fn(...inputs.map(i => i.get(x, y, zoom))));
        }
    }
    return out;
}
exports.performOperation = performOperation;
