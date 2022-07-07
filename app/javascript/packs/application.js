"use strict";
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Sentry = __importStar(require("@sentry/browser"));
if (process.env.NODE_ENV === "production") {
    Sentry.init({
        dsn: "https://947e82282a23489f91fd18ad21ffac44@o28290.ingest.sentry.io/5304857",
        environment: "production"
    });
}
require("@rails/ujs").start();
require("turbolinks").start();
require("@rails/activestorage").start();
require("channels");
require("bootstrap");
const vue_turbolinks_1 = __importDefault(require("vue-turbolinks"));
const vue_1 = __importDefault(require("vue"));
vue_1.default.use(vue_turbolinks_1.default);
const jquery_1 = __importDefault(require("jquery"));
const bs_custom_file_input_1 = __importDefault(require("bs-custom-file-input"));
document.addEventListener("turbolinks:load", () => bs_custom_file_input_1.default.init());
document.addEventListener("turbolinks:load", () => (0, jquery_1.default)("[title]").tooltip());
// Stop ImageStatic from resampling its image on load
const ImageStatic_1 = __importDefault(require("ol/source/ImageStatic"));
delete ImageStatic_1.default.prototype.handleImageChange;
// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)
require("../stylesheets/application");
require("controllers");
