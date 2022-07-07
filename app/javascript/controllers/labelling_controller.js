"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stimulus_1 = require("stimulus");
const Map_1 = __importDefault(require("ol/Map"));
const Control_1 = __importDefault(require("ol/control/Control"));
const LineString_1 = __importDefault(require("ol/geom/LineString"));
const Image_1 = __importDefault(require("ol/layer/Image"));
const Tile_1 = __importDefault(require("ol/layer/Tile"));
const Vector_1 = __importDefault(require("ol/layer/Vector"));
const Vector_2 = __importDefault(require("ol/source/Vector"));
const XYZ_1 = __importDefault(require("ol/source/XYZ"));
const Stroke_1 = __importDefault(require("ol/style/Stroke"));
const Style_1 = __importDefault(require("ol/style/Style"));
const control_1 = require("ol/control");
const interaction_1 = require("ol/interaction");
const proj_1 = require("ol/proj");
const tilegrid_1 = require("ol/tilegrid");
const DragPan_1 = __importDefault(require("ol/interaction/DragPan"));
const condition_1 = require("ol/events/condition");
const labelling_1 = __importDefault(require("../sources/labelling"));
const paint_1 = __importDefault(require("../interactions/paint"));
class default_1 extends stimulus_1.Controller {
    connect() {
        this.labels = Uint8Array.from(atob(this.data.get("labels")), c => c.charCodeAt(0));
        const southWest = (0, proj_1.fromLonLat)([
            Number(this.data.get("south-west-lng")),
            Number(this.data.get("south-west-lat"))
        ]);
        const northEast = (0, proj_1.fromLonLat)([
            Number(this.data.get("north-east-lng")),
            Number(this.data.get("north-east-lat"))
        ]);
        const extent = [southWest[0], southWest[1], northEast[0], northEast[1]];
        const baseLayer = new Tile_1.default({
            extent: extent,
            source: new XYZ_1.default({
                tileUrlFunction: p => `/map_tile_layers/${this.data.get("map-tile-layer-id")}/map_tile?x=${p[1]}&y=${p[2]}&zoom=${p[0]}`,
                tilePixelRatio: 2,
                minZoom: parseInt(this.data.get("zoom-min")),
                maxZoom: parseInt(this.data.get("zoom-max"))
            })
        });
        const zoom = parseInt(this.data.get("zoom"));
        const x0 = parseInt(this.data.get("x"));
        const y0 = parseInt(this.data.get("y"));
        const width = parseInt(this.data.get("width"));
        const height = parseInt(this.data.get("height"));
        const colours = JSON.parse(this.data.get("colours"));
        const labellingLayer = new Image_1.default({
            source: new labelling_1.default(x0, y0, x0 + width, y0 + height, zoom, this.labels, colours),
            opacity: 0.5,
        });
        const paintBrushSource = new Vector_2.default();
        this.paintInteraction = new paint_1.default(paintBrushSource, (coordinate, radius) => {
            const tileGrid = (0, tilegrid_1.createXYZ)();
            const label = parseInt(this.element.querySelector('input[name="brush"]:checked').value);
            tileGrid.forEachTileCoord([
                coordinate[0] - radius,
                coordinate[1] - radius,
                coordinate[0] + radius,
                coordinate[1] + radius
            ], zoom, (coord) => {
                const x = coord[1];
                const y = coord[2];
                if (x >= x0 && x < x0 + width && y >= y0 && y < y0 + height) {
                    const tileCenter = tileGrid.getTileCoordCenter(coord);
                    if (new LineString_1.default([coordinate, tileCenter]).getLength() < radius) {
                        this.labels[(x - x0) * height + (y - y0)] = label;
                    }
                }
            });
            labellingLayer.getSource().refresh();
            this.data.set("dirty", "true");
        });
        this.map = new Map_1.default({
            target: this.containerTarget,
            layers: [
                baseLayer,
                labellingLayer,
                new Vector_1.default({ source: paintBrushSource, style: new Style_1.default({ stroke: new Stroke_1.default({ color: "white" }) }) }),
            ],
            controls: (0, control_1.defaults)().extend(this.controlTargets.map(el => new Control_1.default({ element: document.importNode(el.content, true).querySelector("div") }))),
            interactions: (0, interaction_1.defaults)().extend([
                this.paintInteraction,
                new DragPan_1.default({ condition: condition_1.platformModifierKeyOnly }),
            ]),
        });
        this.map.getView().fit(extent, {
            size: [
                window.innerWidth - 250,
                window.innerHeight - 56
            ]
        });
        // Hack: sometimes the map doesn't display properly until the window is resized
        setTimeout(() => window.dispatchEvent(new Event('resize')), 2000);
        this.setBrushSize();
    }
    disconnect() {
        this.map.dispose();
        delete this.map;
        delete this.paintInteraction;
        delete this.labels;
    }
    setBrushSize() {
        const minRadius = 20000000 / (2 ** parseInt(this.data.get("zoom")));
        const maxRadius = minRadius * Math.max(parseInt(this.data.get("width")), parseInt(this.data.get("height")));
        const scale = Math.pow(Number(this.brushSizeTarget.value), 2);
        const radius = minRadius + scale * (maxRadius - minRadius);
        this.brushSizeLabelTarget.innerHTML = parseInt(radius).toLocaleString();
        this.paintInteraction.setRadius(radius);
    }
    save(event) {
        this.saveButtonTarget.disabled = true;
        const formData = new FormData();
        formData.set("data", btoa(new TextDecoder('ascii').decode(this.labels)));
        fetch(this.data.get("url"), {
            method: "PATCH",
            headers: {
                "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
            },
            body: formData
        })
            .then(response => {
            if (!response.ok) {
                throw new Error();
            }
            this.data.delete("dirty");
        })
            .catch(() => alert("An unexpected error occurred while trying to save your changes"))
            .finally(() => {
            this.saveButtonTarget.innerHTML = "Save complete";
            setTimeout(() => {
                this.saveButtonTarget.innerHTML = "Save changes";
                this.saveButtonTarget.disabled = false;
            }, 2000);
        });
    }
    warnIfUnsaved(event) {
        if (this.data.get("dirty") && !confirm("You have unsaved changes. Are you sure you want to leave this page without saving?")) {
            event.preventDefault();
        }
    }
    closeWindow(event) {
        this.warnIfUnsaved(event);
        if (!event.defaultPrevented) {
            window.close();
        }
    }
    handleShortcutKey(event) {
        const { key } = event;
        if (key === "[" || key === "]") {
            const slider = document.getElementById("brush-radius");
            key === "[" ? slider.stepDown() : slider.stepUp();
            slider.dispatchEvent(new Event('change'));
            this.paintInteraction.drawPaintBrush();
            event.preventDefault();
        }
        else if (key.length == 1) {
            const num = parseInt(key, 36);
            if (!isNaN(num)) {
                const elem = document.getElementById(`brush-${num}`);
                if (elem) {
                    elem.checked = true;
                    event.preventDefault();
                }
            }
        }
    }
}
exports.default = default_1;
default_1.targets = [
    "brushSize",
    "brushSizeLabel",
    "container",
    "control",
    "saveButton",
];
