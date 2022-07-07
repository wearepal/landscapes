"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ImageCanvas_1 = __importDefault(require("ol/source/ImageCanvas"));
const tilegrid_1 = require("ol/tilegrid");
const tileGrid = (0, tilegrid_1.createXYZ)();
class LabellingSource extends ImageCanvas_1.default {
    constructor(x0, y0, x1, y1, zoom, labels, colours, isLabelVisible = (id) => true) {
        super({
            canvasFunction: (extent, resolution, pixelRatio, size, projection) => this.drawCanvas(extent, pixelRatio, size)
        });
        this.x0 = x0;
        this.y0 = y0;
        this.x1 = x1;
        this.y1 = y1;
        this.zoom = zoom;
        this.labels = labels;
        this.colours = colours;
        this.isLabelVisible = isLabelVisible;
    }
    drawCanvas(extent, pixelRatio, size) {
        const canvas = document.createElement("canvas");
        canvas.width = size[0];
        canvas.height = size[1];
        const ctx = canvas.getContext("2d");
        tileGrid.forEachTileCoord(extent, this.zoom, (coord) => {
            const x = coord[1];
            const y = coord[2];
            if (x >= this.x0 && x < this.x1 && y >= this.y0 && y < this.y1) {
                const label = this.labels[(x - this.x0) * (this.y1 - this.y0) + (y - this.y0)];
                const tileExtent = tileGrid.getTileCoordExtent([this.zoom, x, y]);
                const tileX0 = (tileExtent[0] - extent[0]) / (extent[2] - extent[0]) * size[0];
                const tileX1 = (tileExtent[2] - extent[0]) / (extent[2] - extent[0]) * size[0];
                const tileY0 = (tileExtent[3] - extent[1]) / (extent[3] - extent[1]) * size[1];
                const tileY1 = (tileExtent[1] - extent[1]) / (extent[3] - extent[1]) * size[1];
                if (label !== 255 && this.isLabelVisible(label)) {
                    const colour = this.colours[label];
                    if (colour) {
                        ctx.fillStyle = `#${colour}`;
                        ctx.fillRect(tileX0, size[1] - tileY1, tileX1 - tileX0, tileY1 - tileY0);
                    }
                }
                if (Math.abs(tileX1 - tileX0) >= 4 * pixelRatio && Math.abs(tileY1 - tileY0) >= 4 * pixelRatio) {
                    ctx.strokeStyle = "#ffffff88";
                    ctx.strokeRect(tileX0, size[1] - tileY1, tileX1 - tileX0, tileY1 - tileY0);
                }
            }
        });
        return canvas;
    }
}
exports.default = LabellingSource;
