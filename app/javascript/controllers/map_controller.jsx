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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stimulus_1 = require("stimulus");
const react_1 = __importStar(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const lodash_1 = require("lodash");
const base58_js_1 = require("base58-js");
const varint_1 = require("varint");
const components_1 = require("../react/components");
const proj_1 = require("ol/proj");
function toggle(array, value) {
    return array.includes(value) ? array.filter(v => v !== value) : [...array, value];
}
const convertExtent = (src) => (0, proj_1.fromLonLat)([src[1], src[0]]).concat((0, proj_1.fromLonLat)([src[3], src[2]]));
const LabelToggles = ({ labelSchemaName, labels, visibleIds, toggleLabel, toggleAllLabels }) => <>
  <components_1.ToggleAllCheckbox collection={labels} toggledIds={visibleIds} toggleAll={toggleAllLabels} label={labelSchemaName}/>
  <components_1.CollectionToggles items={labels} toggledIds={visibleIds} toggleId={toggleLabel}/>
</>;
const serialise = (state) => {
    let buffer = [];
    const write = (value) => buffer.push(...(0, varint_1.encode)(value));
    write(0);
    write(state.regionId);
    write((state.osmVisible && 1) | (state.imageryVisible && 2) | (state.labellingId && 4));
    write(state.mapTileLayerId);
    if (state.labellingId) {
        write(state.labellingId);
        write(state.labellingOpacity * 10);
        write(state.visibleLabels.length);
        state.visibleLabels.forEach(write);
    }
    write(state.visibleOverlays.length);
    state.visibleOverlays.forEach(write);
    if (state.visibleOverlays.length > 0) {
        write(state.overlayLineWidth);
        write(state.overlayOpacity * 10);
    }
    return (0, base58_js_1.binary_to_base58)(buffer);
};
const deserialise = (string) => {
    try {
        let buffer = (0, base58_js_1.base58_to_binary)(string);
        const read = () => {
            const result = (0, varint_1.decode)(buffer);
            buffer = buffer.subarray(varint_1.decode.bytes);
            return result;
        };
        if (read() != 0) {
            throw 'Invalid version number';
        }
        const state = {};
        state.regionId = read();
        const flags = read();
        state.osmVisible = !!(flags & 1);
        state.imageryVisible = !!(flags & 2);
        state.mapTileLayerId = read();
        if (flags & 4) {
            state.labellingId = read();
            state.labellingOpacity = read() / 10;
            state.visibleLabels = [];
            const numVisibleLabels = read();
            for (let i = 0; i < numVisibleLabels; ++i) {
                state.visibleLabels.push(read());
            }
        }
        else {
            state.labellingId = null;
            state.labellingOpacity = 0.4;
            state.visibleLabels = [];
        }
        state.visibleOverlays = [];
        const numVisibleOverlays = read();
        for (let i = 0; i < numVisibleOverlays; ++i) {
            state.visibleOverlays.push(read());
        }
        state.overlayLineWidth = numVisibleOverlays > 0 ? read() : 2;
        state.overlayOpacity = numVisibleOverlays > 0 ? read() / 10 : 0.1;
        return state;
    }
    catch (_a) {
        return null;
    }
};
const MapView = ({ labels, labellingGroups, labellings, labelSchemas, mapTileLayers, overlays, regions }) => {
    const reducer = (state, action) => {
        var _a;
        switch (action.type) {
            case 'SET_REGION_ID':
                return Object.assign(Object.assign({}, state), { regionId: action.value, labellingId: null, mapTileLayerId: (_a = (0, lodash_1.last)(mapTileLayers.filter(l => l.regionId === action.value))) === null || _a === void 0 ? void 0 : _a.id, visibleOverlays: [] });
            case 'SET_LABELLING_GROUP_ID':
                if (action.value === null) {
                    return Object.assign(Object.assign({}, state), { labellingId: null, visibleLabels: [] });
                }
                else {
                    const oldLabelling = labellings.find(l => l.id === state.labellingId);
                    const oldLabellingGroup = oldLabelling && labellingGroups.find(g => g.id === oldLabelling.labellingGroupId);
                    const newLabellingGroup = labellingGroups.find(g => g.id === action.value);
                    const labelSchemaChanged = (oldLabellingGroup === null || oldLabellingGroup === void 0 ? void 0 : oldLabellingGroup.labelSchemaId) !== newLabellingGroup.labelSchemaId;
                    const newLabelSchema = labelSchemas.find(s => s.id === newLabellingGroup.labelSchemaId);
                    const newLabels = labels.filter(l => l.labelSchemaId === newLabellingGroup.labelSchemaId);
                    const newLabelling = labellings.find(l => l.labellingGroupId === action.value);
                    return Object.assign(Object.assign({}, state), { labellingId: newLabelling.id, mapTileLayerId: newLabelling.mapTileLayerId, visibleLabels: labelSchemaChanged ? newLabels.map(l => l.id) : state.visibleLabels });
                }
            case 'SET_LABELLING_ID':
                return Object.assign(Object.assign({}, state), { labellingId: action.value, mapTileLayerId: labellings.find(l => l.id === action.value).mapTileLayerId });
            case 'SET_MAP_TILE_LAYER_ID':
                return Object.assign(Object.assign({}, state), { mapTileLayerId: action.value, imageryVisible: true });
            case 'SET_LABELLING_OPACITY':
                return Object.assign(Object.assign({}, state), { labellingOpacity: action.value });
            case 'SET_OVERLAY_LINE_WIDTH':
                return Object.assign(Object.assign({}, state), { overlayLineWidth: action.value });
            case 'SET_OVERLAY_OPACITY':
                return Object.assign(Object.assign({}, state), { overlayOpacity: action.value });
            case 'TOGGLE_IMAGERY_VISIBILITY':
                return Object.assign(Object.assign({}, state), { imageryVisible: !state.imageryVisible });
            case 'TOGGLE_OSM_VISIBILITY':
                return Object.assign(Object.assign({}, state), { osmVisible: !state.osmVisible });
            case 'TOGGLE_LABEL_VISIBILITY':
                return Object.assign(Object.assign({}, state), { visibleLabels: toggle(state.visibleLabels, action.value) });
            case 'TOGGLE_ALL_LABELS_VISIBILITY':
                return Object.assign(Object.assign({}, state), { visibleLabels: state.visibleLabels.length === 0 ? labels.filter(l => l.labelSchemaId === labellingGroups.find(g => g.id === labellings.find(l => l.id === state.labellingId).labellingGroupId).labelSchemaId).map(l => l.id) : [] });
            case 'TOGGLE_OVERLAY_VISIBILITY':
                return Object.assign(Object.assign({}, state), { visibleOverlays: toggle(state.visibleOverlays, action.value) });
            default:
                return state;
        }
    };
    const initState = () => {
        var _a, _b;
        return deserialise(window.location.hash.replace('#', '')) || {
            regionId: (_a = regions[0]) === null || _a === void 0 ? void 0 : _a.id,
            mapTileLayerId: (_b = (0, lodash_1.last)(mapTileLayers.filter(l => { var _a; return l.regionId === ((_a = regions[0]) === null || _a === void 0 ? void 0 : _a.id); }))) === null || _b === void 0 ? void 0 : _b.id,
            labellingId: null,
            imageryVisible: true,
            osmVisible: false,
            visibleLabels: [],
            visibleOverlays: [],
            labellingOpacity: 0.4,
            overlayLineWidth: 2,
            overlayOpacity: 0.1,
        };
    };
    const [state, dispatch] = (0, react_1.useReducer)(reducer, undefined, initState);
    const { regionId, mapTileLayerId, imageryVisible, osmVisible, labellingId, labellingOpacity, overlayLineWidth, overlayOpacity, visibleOverlays, visibleLabels } = state;
    const labelling = labellings.find(l => l.id === labellingId);
    const labellingGroup = labelling ? labellingGroups.find(g => g.id === labelling.labellingGroupId) : null;
    const region = regions.find(r => r.id === regionId);
    const extent = labellingId !== null ?
        convertExtent(labellingGroup.extent) :
        (0, proj_1.fromLonLat)([...region.southWestExtent].reverse()).concat((0, proj_1.fromLonLat)([...region.northEastExtent].reverse()));
    (0, react_1.useEffect)(() => history.replaceState(undefined, undefined, `#${serialise(state)}`));
    return (<div className="d-flex align-items-stretch" style={{ height: "calc(100vh - 3.5rem)" }}>
      <div className="flex-grow-1 bg-dark" style={{ height: "100%" }}>
        <components_1.Map extent={extent}>
          <components_1.OSMLayer visible={osmVisible}/>
          <components_1.TileLayer mapTileLayer={mapTileLayers.find(l => l.id === mapTileLayerId)} visible={imageryVisible} opacity={osmVisible ? 0.6 : 1.0}/>
          <components_1.ImageLayer visible={labellingId !== null} url={labellingId && `/labellings/${labellingId}.png?${visibleLabels.map(id => labels.find(l => l.id === id)).map(l => `labels[]=${l.index}`).join('&')}`} imageExtent={labellingGroup && convertExtent(labellingGroup.extent)} opacity={labellingOpacity}/>
          {overlays.filter(o => o.regionId === regionId).map(o => <components_1.OverlayLayer key={o.id} id={o.id} visible={visibleOverlays.includes(o.id)} colour={o.colour} backgroundOpacity={overlayOpacity} strokeWidth={overlayLineWidth}/>)}
        </components_1.Map>
      </div>
      <div className="bg-light px-3 py-2" style={{ width: "350px", height: "100%", overflowY: "auto" }}>
        <div className="lead">Region</div>
        <components_1.CollectionSelect items={regions} id={regionId} setId={value => dispatch({ type: 'SET_REGION_ID', value })}/>

        <hr />

        <div className="lead">Base layers</div>
        
        <components_1.Checkbox checked={imageryVisible} change={() => dispatch({ type: 'TOGGLE_IMAGERY_VISIBILITY' })}>Imagery</components_1.Checkbox>
        
        <div className="ml-4 my-1">
          <components_1.CollectionSelect items={mapTileLayers.filter(l => l.regionId === regionId)} id={mapTileLayerId} setId={value => dispatch({ type: 'SET_MAP_TILE_LAYER_ID', value })}/>
        </div>

        <components_1.Checkbox checked={osmVisible} change={() => dispatch({ type: 'TOGGLE_OSM_VISIBILITY' })}>OpenStreetMap</components_1.Checkbox>

        <hr />

        <div className="lead">Labels</div>

        <div className="mb-2">
          <components_1.CollectionSelect items={labellingGroups.filter(g => g.regionId === regionId)} id={labellingGroup === null || labellingGroup === void 0 ? void 0 : labellingGroup.id} setId={value => dispatch({ type: 'SET_LABELLING_GROUP_ID', value })} placeholder="No labelling"/>
        </div>

        {labellingId !== null &&
            <>
            <div className="mb-2">
              <components_1.CollectionSelect items={labellings.filter(l => l.labellingGroupId === labellingGroup.id).map(l => ({ id: l.id, name: mapTileLayers.find(m => m.id === l.mapTileLayerId).name }))} id={labellingId} setId={value => dispatch({ type: 'SET_LABELLING_ID', value })}/>
            </div>

            <LabelToggles labelSchemaName={labelSchemas.find(s => s.id === labellingGroup.labelSchemaId).name} labels={labels.filter(l => l.labelSchemaId === labellingGroup.labelSchemaId)} visibleIds={visibleLabels} toggleLabel={value => dispatch({ type: 'TOGGLE_LABEL_VISIBILITY', value })} toggleAllLabels={() => dispatch({ type: 'TOGGLE_ALL_LABELS_VISIBILITY' })}/>

            <components_1.Slider icon="fa-eye" min="0" max="1" step="0.1" value={labellingOpacity} setValue={value => dispatch({ type: 'SET_LABELLING_OPACITY', value })}/>
          </>}

        <hr />

        <div className="lead">Overlays</div>

        <components_1.CollectionToggles items={overlays.filter(o => o.regionId === regionId)} toggledIds={visibleOverlays} toggleId={value => dispatch({ type: 'TOGGLE_OVERLAY_VISIBILITY', value })}/>

        <components_1.Slider icon="fa-arrows-alt-h" min="1" max="10" value={overlayLineWidth} setValue={value => dispatch({ type: 'SET_OVERLAY_LINE_WIDTH', value })}/>

        <components_1.Slider icon="fa-eye" min="0" max="1" step="0.1" value={overlayOpacity} setValue={value => dispatch({ type: 'SET_OVERLAY_OPACITY', value })}/>
      </div>
    </div>);
};
class default_1 extends stimulus_1.Controller {
    connect() {
        react_dom_1.default.render(<MapView {...JSON.parse(this.data.get("defs"))}/>, this.element);
    }
    disconnect() {
        react_dom_1.default.unmountComponentAtNode(this.element);
    }
}
exports.default = default_1;
