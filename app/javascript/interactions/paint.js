"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Pointer_1 = __importDefault(require("ol/interaction/Pointer"));
const condition_1 = require("ol/events/condition");
const Feature_1 = __importDefault(require("ol/Feature"));
const Circle_1 = __importDefault(require("ol/geom/Circle"));
class PaintInteraction extends Pointer_1.default {
    constructor(source, onPaint) {
        super({
            handleMoveEvent: (event) => {
                if ((0, condition_1.noModifierKeys)(event)) {
                    this.mouseCoordinate = event.coordinate;
                    this.drawPaintBrush();
                    return true;
                }
                else
                    return false;
            },
            handleDownEvent: (event) => {
                if ((0, condition_1.noModifierKeys)(event) && (0, condition_1.primaryAction)(event)) {
                    onPaint(event.coordinate, this.radius);
                    return true;
                }
                else
                    return false;
            },
            handleDragEvent: (event) => {
                this.mouseCoordinate = event.coordinate;
                this.drawPaintBrush();
                onPaint(event.coordinate, this.radius);
                return true;
            },
        });
        this.source = source;
    }
    drawPaintBrush() {
        this.source.clear();
        this.source.addFeature(new Feature_1.default(new Circle_1.default(this.mouseCoordinate, this.radius)));
    }
    setRadius(radius) {
        this.radius = radius;
    }
}
exports.default = PaintInteraction;
