"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapSocket = exports.setSocket = exports.layerSocket = void 0;
const rete_1 = require("rete");
exports.layerSocket = new rete_1.Socket('Layer');
exports.setSocket = new rete_1.Socket('Set');
exports.mapSocket = new rete_1.Socket('Map');
