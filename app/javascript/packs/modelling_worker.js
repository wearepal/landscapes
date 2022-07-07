"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const threads_1 = require("threads");
const generateDistanceMap_1 = require("../modelling/worker/generateDistanceMap");
const performOperation_1 = require("../modelling/worker/performOperation");
const rasteriseOverlay_1 = require("../modelling/worker/rasteriseOverlay");
(0, threads_1.expose)({
    generateDistanceMap: generateDistanceMap_1.generateDistanceMap,
    performOperation: performOperation_1.performOperation,
    rasteriseOverlay: rasteriseOverlay_1.rasteriseOverlay
});
