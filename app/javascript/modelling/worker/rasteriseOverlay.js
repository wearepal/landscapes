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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rasteriseOverlay = void 0;
const extent_1 = require("ol/extent");
const GeoJSON_1 = __importDefault(require("ol/format/GeoJSON"));
const GeometryType_1 = __importDefault(require("ol/geom/GeometryType"));
const tilegrid_1 = require("ol/tilegrid");
const TileGrid_1 = require("../TileGrid");
function rasteriseOverlay(overlayId, zoom) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`/overlays/${overlayId}`);
        if (!response.ok)
            throw new Error();
        const json = yield response.json();
        const features = new GeoJSON_1.default({ dataProjection: (_b = (_a = json.crs) === null || _a === void 0 ? void 0 : _a.properties) === null || _b === void 0 ? void 0 : _b.name, featureProjection: "EPSG:3857" }).readFeatures(json);
        const extent = features.reduce((extent, feature) => (0, extent_1.extend)(extent, feature.getGeometry().getExtent()), (0, extent_1.createEmpty)());
        const tileGrid = (0, tilegrid_1.createXYZ)();
        const outputTileRange = tileGrid.getTileRangeForExtentAndZ(extent, zoom);
        const result = new TileGrid_1.BooleanTileGrid(zoom, outputTileRange.minX, outputTileRange.minY, outputTileRange.getWidth(), outputTileRange.getHeight());
        features.forEach(feature => {
            const geom = feature.getGeometry();
            if (geom.getType() === GeometryType_1.default.POINT) {
                const [, x, y] = tileGrid.getTileCoordForCoordAndZ(geom.getCoordinates(), zoom);
                result.set(x, y, true);
            }
            else {
                const featureTileRange = tileGrid.getTileRangeForExtentAndZ(geom.getExtent(), zoom);
                for (let x = featureTileRange.minX; x <= featureTileRange.maxX; ++x) {
                    for (let y = featureTileRange.minY; y <= featureTileRange.maxY; ++y) {
                        const tileExtent = tileGrid.getTileCoordExtent([zoom, x, y]);
                        if (geom.intersectsExtent(tileExtent)) {
                            result.set(x, y, true);
                        }
                    }
                }
            }
        });
        return result;
    });
}
exports.rasteriseOverlay = rasteriseOverlay;
