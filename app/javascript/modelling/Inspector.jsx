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
const ol_1 = require("ol");
const GeoJSON_1 = __importDefault(require("ol/format/GeoJSON"));
const geom_1 = require("ol/geom");
const Group_1 = __importDefault(require("ol/layer/Group"));
const Image_1 = __importDefault(require("ol/layer/Image"));
const Tile_1 = __importDefault(require("ol/layer/Tile"));
const Vector_1 = __importDefault(require("ol/layer/Vector"));
const proj_1 = require("ol/proj");
const source_1 = require("ol/source");
const ImageCanvas_1 = __importDefault(require("ol/source/ImageCanvas"));
const Vector_2 = __importDefault(require("ol/source/Vector"));
const style_1 = require("ol/style");
const tilegrid_1 = require("ol/tilegrid");
const react_1 = __importStar(require("react"));
const labelling_1 = __importDefault(require("../sources/labelling"));
const TileGrid_1 = require("./TileGrid");
const tileGrid = (0, tilegrid_1.createXYZ)();
class InspectorSource extends ImageCanvas_1.default {
    constructor(nodeOutput) {
        super({
            canvasFunction: (extent, resolution, pixelRatio, size, projection) => this.drawCanvas(extent, pixelRatio, size)
        });
        this.nodeOutput = nodeOutput;
        Object.assign(this, {
            zoom: nodeOutput.zoom,
            x0: nodeOutput.x,
            x1: nodeOutput.x + nodeOutput.width,
            y0: nodeOutput.y,
            y1: nodeOutput.y + nodeOutput.height,
            data: nodeOutput.data,
        });
        this.minValue = Infinity;
        this.maxValue = -Infinity;
        nodeOutput.data.forEach(val => {
            if (isFinite(val)) {
                this.minValue = Math.min(val, this.minValue);
                this.maxValue = Math.max(val, this.maxValue);
            }
        });
    }
    drawCanvas(extent, pixelRatio, size) {
        const canvas = document.createElement("canvas");
        canvas.width = size[0];
        canvas.height = size[1];
        const ctx = canvas.getContext("2d");
        tileGrid.forEachTileCoord(extent, this.zoom, (coord) => {
            const x = coord[1];
            const y = coord[2];
            if (x >= this.x0 && x < this.x1 && y >= this.y0 && y < this.y1) {
                const value = this.data[(x - this.x0) * (this.y1 - this.y0) + (y - this.y0)];
                const tileExtent = tileGrid.getTileCoordExtent([this.zoom, x, y]);
                const tileX0 = (tileExtent[0] - extent[0]) / (extent[2] - extent[0]) * size[0];
                const tileX1 = (tileExtent[2] - extent[0]) / (extent[2] - extent[0]) * size[0];
                const tileY0 = (tileExtent[3] - extent[1]) / (extent[3] - extent[1]) * size[1];
                const tileY1 = (tileExtent[1] - extent[1]) / (extent[3] - extent[1]) * size[1];
                if (value === null) {
                    ctx.fillStyle = '#FF0000';
                }
                else {
                    const shade = Math.floor(255 * (value - this.minValue) / (this.maxValue - this.minValue));
                    ctx.fillStyle = `#${shade.toString(16).padStart(2, '0').repeat(3)}`;
                }
                ctx.fillRect(Math.floor(tileX0), Math.ceil(size[1] - tileY1), Math.ceil(tileX1 - tileX0), Math.floor(tileY1 - tileY0));
            }
        });
        return canvas;
    }
}
function createOverlayLayer(id, colour) {
    return new Vector_1.default({
        source: new Vector_2.default({
            url: `/overlays/${id}`,
            format: new GeoJSON_1.default(),
        }),
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
                    stroke: new style_1.Stroke({ color: `#${colour}` }),
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
    });
}
function useFetchedArray(url) {
    const [data, setData] = (0, react_1.useState)([]);
    function fetchArray() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(url);
            setData(yield response.json());
        });
    }
    (0, react_1.useEffect)(() => fetchArray(), []);
    return data;
}
function default_1({ teamId, nodeLabel, nodeOutput, close }) {
    const mapRef = (0, react_1.useRef)();
    const [map, setMap] = (0, react_1.useState)(null);
    const [osmVisible, setOsmVisible] = (0, react_1.useState)(true);
    const [opacity, setOpacity] = (0, react_1.useState)(0.5);
    const regions = useFetchedArray(`/teams/${teamId}/regions.json`);
    const mapTileLayers = useFetchedArray(`/teams/${teamId}/map_tile_layers.json`);
    const overlays = useFetchedArray(`/teams/${teamId}/overlays.json`);
    const [visibleOverlayIds, setVisibleOverlayIds] = (0, react_1.useState)(new Set());
    const [selectedLayerId, setSelectedLayerId] = (0, react_1.useState)(null);
    const [labelVisibility, setLabelVisibility] = (0, react_1.useState)(nodeOutput instanceof TileGrid_1.LabelledTileGrid ? new Map(nodeOutput.labelSchema.labels.map(l => [l.index, true])) : new Map());
    const { x, y, width, height, zoom } = nodeOutput;
    (0, react_1.useEffect)(() => {
        const newMap = new ol_1.Map({
            target: mapRef.current,
            layers: [
                new Tile_1.default(),
                new Tile_1.default({ source: new source_1.OSM() }),
                new Image_1.default({ opacity }),
                new Group_1.default()
            ]
        });
        newMap.getView().fit(tileGrid.getTileRangeExtent(zoom, new ol_1.TileRange(x, x + width, -y - height, -y)));
        setMap(newMap);
        return () => { newMap.dispose(); };
    }, []);
    (0, react_1.useEffect)(() => {
        if (!map)
            return;
        const layer = map.getLayers().item(0);
        if (selectedLayerId === null) {
            layer.setVisible(false);
        }
        else {
            const layerMeta = mapTileLayers.find(l => l.id === selectedLayerId);
            const extent = (0, proj_1.fromLonLat)([...layerMeta.south_west_extent].reverse()).concat((0, proj_1.fromLonLat)([...layerMeta.north_east_extent].reverse()));
            layer.setSource(new source_1.XYZ({
                tileUrlFunction: p => `/map_tile_layers/${selectedLayerId}/map_tile?x=${p[1]}&y=${p[2]}&zoom=${p[0]}`,
                tilePixelRatio: 2,
                minZoom: layerMeta.min_zoom,
                maxZoom: layerMeta.max_zoom
            }));
            layer.setExtent(extent);
            layer.setVisible(true);
        }
    }, [selectedLayerId]);
    (0, react_1.useEffect)(() => {
        if (!map)
            return;
        const osmLayer = map.getLayers().item(1);
        osmLayer.setVisible(osmVisible);
        osmLayer.setOpacity(selectedLayerId === null ? 1 : 0.5);
    }, [selectedLayerId, osmVisible]);
    (0, react_1.useEffect)(() => {
        if (!map)
            return;
        map.getLayers().item(2).setOpacity(opacity);
    }, [opacity]);
    (0, react_1.useEffect)(() => {
        if (!map)
            return;
        const group = map.getLayers().item(3);
        group.setLayers(new ol_1.Collection([...visibleOverlayIds].map(id => createOverlayLayer(id, overlays.find(o => o.id === id).colour))));
    }, [visibleOverlayIds]);
    (0, react_1.useEffect)(() => {
        if (!map)
            return;
        map.getLayers().item(2).setSource((nodeOutput instanceof TileGrid_1.LabelledTileGrid ?
            new labelling_1.default(x, y, x + width, y + height, zoom, nodeOutput.data, nodeOutput.labelSchema.labels.reduce((acc, l) => {
                const { index, colour } = l;
                return Object.assign(Object.assign({}, acc), { [index]: colour });
            }, {}), (id) => labelVisibility.get(id)) :
            new InspectorSource(nodeOutput)));
    }, [map, labelVisibility]);
    return (<div>
      <div className="bg-dark" style={{ position: 'absolute', top: '3.5rem', left: '0rem', bottom: '0rem', right: '0rem' }}>
        <div className="btn-toolbar bg-light p-2 border-top">
          <div className="small" style={{ lineHeight: '1.9375rem' }}>
            Inspecting <code>{nodeLabel}</code>
          </div>
          <button type="button" className="ml-auto btn btn-sm btn-outline-secondary" onClick={close}>
            <i className="fas fa-times"></i>
            &nbsp;
            Close inspector
          </button>
        </div>

        <div ref={mapRef} style={{ width: 'calc(100% - 250px)', height: 'calc(100% - 3.0625rem)' }}></div>

        <div className="bg-light map__sidebar" style={{ top: '3.0625rem' }}>
          <div className="map__sidebar-section">
            <a className="map__sidebar-section-heading collapsed" data-toggle="collapse" href="#sidebar-section-base-layers">
              <i className="fas fa-caret-right accordion-toggle__indicator mr-2"></i>
              <i className="fas fa-layer-group fa-fw fa-lg align-middle"></i>
              &nbsp;
              Base layers
            </a>
            <div id="sidebar-section-base-layers" className="collapse">
              <div className="map__sidebar-section-content">
                <div className="custom-control custom-radio">
                  <input type="radio" className="custom-control-input" id="layer-none" checked={selectedLayerId === null} onChange={() => setSelectedLayerId(null)}/>
                  <label className="custom-control-label" htmlFor="layer-none">No imagery</label>
                </div>
                {regions.map(region => <details key={region.id}>
                    <summary>{region.name}</summary>
                    {mapTileLayers.filter(l => l.region_id === region.id).map(layer => <div key={layer.id} className="custom-control custom-radio">
                        <input type="radio" className="custom-control-input" id={`layer-${layer.id}`} checked={selectedLayerId === layer.id} onChange={() => setSelectedLayerId(layer.id)}/>
                        <label className="custom-control-label" htmlFor={`layer-${layer.id}`}>
                          {layer.name}
                        </label>
                      </div>)}
                  </details>)}
                <hr />
                <div className="custom-control custom-checkbox">
                  <input type="checkbox" className="custom-control-input" id="osm" checked={osmVisible} onChange={() => setOsmVisible(!osmVisible)}/>
                  <label className="custom-control-label" htmlFor="osm">OpenStreetMap</label>
                </div>
              </div>
            </div>
          </div>

          <div className="map__sidebar-section">
            <a className="map__sidebar-section-heading collapsed" data-toggle="collapse" href="#sidebar-section-overlays">
              <i className="fas fa-caret-right accordion-toggle__indicator mr-2"></i>
              <i className="fas fa-layer-group fa-fw fa-lg align-middle"></i>
              &nbsp;
              Overlays
            </a>
            <div id="sidebar-section-overlays" className="collapse">
              <div className="map__sidebar-section-content">
                {regions.map(region => <details key={region.id}>
                    <summary>{region.name}</summary>
                    {overlays.filter(o => o.region_id === region.id).map(overlay => <div key={overlay.id} className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id={`overlay-${overlay.id}`} checked={visibleOverlayIds.has(overlay.id)} onChange={(e) => {
                    const newValue = new Set(visibleOverlayIds);
                    if (e.target.checked) {
                        newValue.add(overlay.id);
                    }
                    else {
                        newValue.delete(overlay.id);
                    }
                    setVisibleOverlayIds(newValue);
                }}/>
                        <label className="custom-control-label" htmlFor={`overlay-${overlay.id}`}>
                          <div className="swatch" style={{ backgroundColor: `#${overlay.colour}` }}/>
                          &nbsp;
                          {overlay.name}
                        </label>
                      </div>)}
                  </details>)}
              </div>
            </div>
          </div>

          {nodeOutput instanceof TileGrid_1.LabelledTileGrid &&
            <div className="map__sidebar-section">
              <a className="map__sidebar-section-heading" data-toggle="collapse" href="#sidebar-section-view-labels">
                <i className="fas fa-caret-right accordion-toggle__indicator mr-2"></i>
                <i className="fas fa-tags fa-fw fa-lg align-middle"></i>
                &nbsp;
                Labels
              </a>
              <div id="sidebar-section-view-labels" className="collapse show">
                <div className="map__sidebar-section-content">
                  {nodeOutput.labelSchema.labels.map(label => <div key={label.id} className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id={`label-${label.id}`} checked={labelVisibility.get(label.index)} onChange={e => {
                        const newValue = new Map(labelVisibility);
                        newValue.set(label.index, e.target.checked);
                        setLabelVisibility(newValue);
                    }}/>
                        <label className="custom-control-label" htmlFor={`label-${label.id}`}>
                          <div className="swatch" style={{ backgroundColor: `#${label.colour}` }}/>
                          &nbsp;
                          {label.label}
                        </label>
                      </div>)}
                </div>
              </div>
            </div>}

          <div className="map__sidebar-section">
            <a className="map__sidebar-section-heading" data-toggle="collapse" href="#sidebar-section-view-settings">
              <i className="fas fa-caret-right accordion-toggle__indicator mr-2"></i>
              <i className="fas fa-eye fa-fw fa-lg align-middle"></i>
              &nbsp;
              View settings
            </a>
            <div id="sidebar-section-view-settings" className="collapse show">
              <div className="map__sidebar-section-content">
                Opacity<br />
                <input type="range" className="custom-range" min="0" max="1" step="0.01" value={opacity} onChange={e => setOpacity(Number(e.target.value))}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
exports.default = default_1;
