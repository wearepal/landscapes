"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workerPool = void 0;
const threads_1 = require("threads");
exports.workerPool = new threads_1.Pool(() => (0, threads_1.spawn)(new threads_1.Worker('/modelling_worker.js')));
