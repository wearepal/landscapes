"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreviewControl = void 0;
const rete_1 = require("rete");
const PreviewImage_1 = __importDefault(require("./PreviewImage"));
class PreviewControl extends rete_1.Control {
    constructor(getTileGrid) {
        super('preview');
        this.component = PreviewImage_1.default;
        this.props = { getTileGrid };
    }
}
exports.PreviewControl = PreviewControl;
