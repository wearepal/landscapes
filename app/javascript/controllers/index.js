"use strict";
// Load all the controllers within this directory and all subdirectories. 
// Controller files must be named *_controller.js.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const stimulus_1 = require("stimulus");
const webpack_helpers_1 = require("stimulus/webpack-helpers");
const Sentry = __importStar(require("@sentry/browser"));
const application = stimulus_1.Application.start();
if (process.env.NODE_ENV === "production") {
    const defaultErrorHandler = application.handleError;
    application.handleError = (ex) => {
        Sentry.captureException(ex);
        defaultErrorHandler(ex);
    };
}
const context = require.context("controllers", true, /_controller\.jsx?$/);
application.load((0, webpack_helpers_1.definitionsFromContext)(context));
