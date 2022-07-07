"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveLabellingControl = void 0;
const rete_1 = require("rete");
const SaveLabellingButton_1 = __importDefault(require("./SaveLabellingButton"));
class SaveLabellingControl extends rete_1.Control {
    constructor({ enabled, saveClicked, deleteClicked }) {
        super('labellingGroupId');
        this.component = SaveLabellingButton_1.default;
        this.props = {
            getLabellingGroupId: this.getData.bind(this, 'labellingGroupId'),
            enabled,
            saveClicked,
            deleteClicked,
        };
    }
}
exports.SaveLabellingControl = SaveLabellingControl;
