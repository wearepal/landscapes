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
exports.BinaryOpComponent = void 0;
const rete_1 = require("rete");
const PreviewControl_1 = require("../controls/PreviewControl");
const TileGrid_1 = require("../TileGrid");
const workerPool_1 = require("../workerPool");
class BinaryOpComponent extends rete_1.Component {
    constructor(operation, operator, inputSocket, outputSocket, category) {
        super(operation);
        Object.assign(this, {
            operator,
            inputSocket,
            outputSocket,
            category,
            contextMenuName: `${operation} (${operator})`,
        });
    }
    builder(node) {
        node.addControl(new PreviewControl_1.PreviewControl(() => node.meta.output || new TileGrid_1.BooleanTileGrid(0, 0, 0, 1, 1)));
        node.addInput(new rete_1.Input('a', 'A', this.inputSocket));
        node.addInput(new rete_1.Input('b', 'B', this.inputSocket));
        node.addOutput(new rete_1.Output('out', `A ${this.operator} B`, this.outputSocket));
    }
    worker(node, inputs, outputs) {
        return __awaiter(this, void 0, void 0, function* () {
            const editorNode = this.editor.nodes.find(n => n.id === node.id);
            if (inputs['a'][0] === undefined || inputs['b'][0] === undefined) {
                editorNode.meta.errorMessage = 'Not enough inputs';
            }
            else {
                delete editorNode.meta.errorMessage;
                editorNode.meta.output = outputs['out'] = yield workerPool_1.workerPool.queue((worker) => __awaiter(this, void 0, void 0, function* () { return worker.performOperation(this.name, inputs['a'][0], inputs['b'][0]); }));
                outputs['out'].name = node.data.name;
                editorNode.controls.get('preview').update();
            }
            editorNode.update();
        });
    }
}
exports.BinaryOpComponent = BinaryOpComponent;
