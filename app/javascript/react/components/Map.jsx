"use strict";
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
exports.ImageLayer = exports.TileLayer = exports.OverlayLayer = exports.OSMLayer = exports.Map = void 0;
const react_1 = __importStar(require("react"));
const ol = __importStar(require("ol"));
const color_1 = require("ol/color");
const control_1 = require("ol/control");
const format_1 = require("ol/format");
const layer_1 = require("ol/layer");
const source_1 = require("ol/source");
const proj_1 = require("ol/proj");
const style_1 = require("ol/style");
const geom_1 = require("ol/geom");
const MapContext = (0, react_1.createContext)();
const useMapLayerBinding = (map, layer) => {
    (0, react_1.useEffect)(() => {
        if (map !== null && layer !== null) {
            map.addLayer(layer);
            return () => map.removeLayer(layer);
        }
    }, [map, layer]);
};
const Map = ({ extent, children }) => {
    const mapRef = (0, react_1.useRef)();
    const [map, setMap] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const labelElement = document.createElement("i");
        labelElement.classList.add("fas", "fa-expand");
        const map = new ol.Map({
            target: mapRef.current,
            view: new ol.View({ center: [0, 0], zoom: 0 }),
            controls: (0, control_1.defaults)().extend([
                new control_1.ZoomToExtent({ extent, label: labelElement, tipLabel: "Reset view" })
            ])
        });
        setMap(map);
        return () => {
            map.dispose();
            setMap(null);
        };
    }, []);
    (0, react_1.useEffect)(() => {
        if (map === null) {
            return;
        }
        map.getView().fit(extent);
        let zoomControl = map.getControls().item(map.getControls().getLength() - 1);
        zoomControl.extent = extent;
    }, [map, extent[0], extent[1], extent[2], extent[3]]);
    return <MapContext.Provider value={map}>
    <div ref={mapRef} style={{ width: "100%", height: "100%" }}/>
    {children}
  </MapContext.Provider>;
};
exports.Map = Map;
const OSMLayer = ({ visible }) => {
    const map = (0, react_1.useContext)(MapContext);
    const [layer, setLayer] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        setLayer(new layer_1.Tile({ source: new source_1.OSM(), visible }));
        return () => setLayer(null);
    }, []);
    (0, react_1.useEffect)(() => {
        layer === null || layer === void 0 ? void 0 : layer.setVisible(visible);
    }, [layer, visible]);
    useMapLayerBinding(map, layer);
    return null;
};
exports.OSMLayer = OSMLayer;
const OverlayLayer = ({ visible, id, colour, strokeWidth, backgroundOpacity }) => {
    const colourWithOpacity = (0, color_1.asArray)(`#${colour}`);
    colourWithOpacity[3] = backgroundOpacity;
    const map = (0, react_1.useContext)(MapContext);
    const [layer, setLayer] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        setLayer(new layer_1.Vector({
            source: new source_1.Vector({ url: `/overlays/${id}`, format: new format_1.GeoJSON() }),
            style: (feature) => {
                if (feature.getGeometry() instanceof geom_1.Point && !feature.get('name')) {
                    return new style_1.Style({
                        image: new style_1.Circle({
                            radius: 2,
                            fill: new style_1.Fill({ color: `#${colour}` }),
                        })
                    });
                }
                else {
                    return new style_1.Style({
                        stroke: new style_1.Stroke({ color: `#${colour}`, width: strokeWidth }),
                        fill: new style_1.Fill({ color: colourWithOpacity }),
                        text: new style_1.Text({
                            font: `300 14px ${getComputedStyle(document.documentElement).getPropertyValue('--font-family-sans-serif')}`,
                            text: feature.get('name'),
                            fill: new style_1.Fill({
                                color: `#${colour}`
                            }),
                        }),
                    });
                }
            },
        }));
        return () => setLayer(null);
    }, [id, colour, strokeWidth, backgroundOpacity]);
    (0, react_1.useEffect)(() => {
        layer === null || layer === void 0 ? void 0 : layer.setVisible(visible);
    }, [layer, visible]);
    useMapLayerBinding(map, layer);
    return null;
};
exports.OverlayLayer = OverlayLayer;
const TileLayer = ({ opacity, visible, mapTileLayer }) => {
    const map = (0, react_1.useContext)(MapContext);
    const [layer, setLayer] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        setLayer(new layer_1.Tile({ opacity, visible }));
        return () => setLayer(null);
    }, []);
    (0, react_1.useEffect)(() => {
        if (mapTileLayer === null)
            return;
        const { id, minZoom, maxZoom, southWestExtent, northEastExtent } = mapTileLayer;
        layer === null || layer === void 0 ? void 0 : layer.setSource(new source_1.XYZ({
            tileUrlFunction: p => `/map_tile_layers/${id}/map_tile?x=${p[1]}&y=${p[2]}&zoom=${p[0]}`,
            tilePixelRatio: 2,
            minZoom,
            maxZoom
        }));
        layer === null || layer === void 0 ? void 0 : layer.setExtent((0, proj_1.fromLonLat)([...southWestExtent].reverse()).concat((0, proj_1.fromLonLat)([...northEastExtent].reverse())));
        return () => layer === null || layer === void 0 ? void 0 : layer.setSource(null);
    }, [layer, mapTileLayer]);
    (0, react_1.useEffect)(() => {
        layer === null || layer === void 0 ? void 0 : layer.setVisible(visible);
    }, [layer, visible]);
    (0, react_1.useEffect)(() => {
        layer === null || layer === void 0 ? void 0 : layer.setOpacity(opacity);
    }, [layer, opacity]);
    useMapLayerBinding(map, layer);
    return null;
};
exports.TileLayer = TileLayer;
const ImageLayer = ({ url, imageExtent, opacity, visible }) => {
    const map = (0, react_1.useContext)(MapContext);
    const [layer, setLayer] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        setLayer(new layer_1.Image({ opacity, visible }));
        return () => setLayer(null);
    }, []);
    (0, react_1.useEffect)(() => {
        layer === null || layer === void 0 ? void 0 : layer.setVisible(visible);
    }, [layer, visible]);
    (0, react_1.useEffect)(() => {
        layer === null || layer === void 0 ? void 0 : layer.setOpacity(opacity);
    }, [layer, opacity]);
    (0, react_1.useEffect)(() => {
        if (layer === null) {
            return;
        }
        layer === null || layer === void 0 ? void 0 : layer.setSource(new source_1.ImageStatic({
            url,
            imageExtent,
            imageSmoothing: false,
        }));
        return () => layer === null || layer === void 0 ? void 0 : layer.setSource(null);
    }, [layer, url, imageExtent]);
    useMapLayerBinding(map, layer);
    return null;
};
exports.ImageLayer = ImageLayer;
