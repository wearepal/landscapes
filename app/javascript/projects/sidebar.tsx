import * as React from 'react'
import './sidebar.css'
import { ReactSortable } from 'react-sortablejs'
import { nevoLevelNames, nevoPropertyNames } from './nevo'
import { Layer, ModelOutputLayer, NevoLayer, OverlayLayer, State } from './state'
import { iconForLayerType } from "./util"
import { getColorStops } from './reify_layer/model_output'
import { tileGridStats } from './modelling/tile_grid'

interface OverlayLayerSettingsProps {
  layer: OverlayLayer
  mutate: (data: any) => void
}
const OverlayLayerSettings = ({ layer, mutate }: OverlayLayerSettingsProps) => (
  <>
    <div className="d-flex align-items-center mt-3">
      Stroke width
      <input
        type="range"
        min="1"
        max="10"
        step="1"
        className="custom-range ml-3"
        value={layer.strokeWidth}
        onChange={e => mutate({ strokeWidth: Number(e.target.value) })}
      />
    </div>
    <div className="d-flex align-items-center mt-3">
      Fill opacity
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        className="custom-range ml-3"
        value={layer.fillOpacity}
        onChange={e => mutate({ fillOpacity: Number(e.target.value) })}
      />
    </div>
  </>
)

interface NevoLayerSettingsProps {
  layer: NevoLayer
  mutate: (data: any) => void
}
const NevoLayerSettings = ({ layer, mutate }: NevoLayerSettingsProps) => (
  <>
    <div className="d-flex align-items-center mt-3">
      Scale
      <select className="custom-select ml-3" value={layer.level} onChange={e => mutate({ level: e.target.value })}>
        {
          Object.keys(nevoLevelNames).map(level =>
            <option key={level} value={level}>{nevoLevelNames[level]}</option>
          )
        }
      </select>
    </div>
    <div className="d-flex align-items-center mt-3">
      Fill mode
      <select className="custom-select ml-3" value={layer.fill} onChange={e => mutate({ fill: e.target.value })}>
        <option value="heatmap">Heatmap</option>
        <option value="greyscale">Greyscale</option>
      </select>
    </div>
    <div className="d-flex flex-column mt-3">
      Visualised property
      <select className="custom-select" value={layer.property} onChange={e => mutate({ property: e.target.value })}>
        {
          Object.keys(nevoPropertyNames).map(property =>
            <option key={property} value={property}>
              {property} - {nevoPropertyNames[property]}
            </option>
          )
        }
      </select>
    </div>
  </>
)

const CehLandCoverLayerSettings = () => (
  <>
    <details className="mt-3">
      <summary>Legend</summary>
      <span className="swatch" style={{ backgroundColor: "rgb(255, 0, 0)" }} /> Broadleaved woodland<br />
      <span className="swatch" style={{ backgroundColor: "rgb(0, 102, 0)" }} /> Coniferous woodland<br />
      <span className="swatch" style={{ backgroundColor: "rgb(115, 38, 0)" }} /> Arable and horticulture<br />
      <span className="swatch" style={{ backgroundColor: "rgb(0, 255, 0)" }} /> Improved grassland<br />
      <span className="swatch" style={{ backgroundColor: "rgb(127, 229, 127)" }} /> Neutral grassland<br />
      <span className="swatch" style={{ backgroundColor: "rgb(112, 168, 0)" }} /> Calcareous grassland<br />
      <span className="swatch" style={{ backgroundColor: "rgb(153, 129, 0)" }} /> Acid grassland<br />
      <span className="swatch" style={{ backgroundColor: "rgb(255, 255, 0)" }} /> Fen, marsh and swamp<br />
      <span className="swatch" style={{ backgroundColor: "rgb(128, 26, 128)" }} /> Heather<br />
      <span className="swatch" style={{ backgroundColor: "rgb(230, 140, 166)" }} /> Heather grassland<br />
      <span className="swatch" style={{ backgroundColor: "rgb(0, 128, 115)" }} /> Bog<br />
      <span className="swatch" style={{ backgroundColor: "rgb(210, 210, 255)" }} /> Inland rock<br />
      <span className="swatch" style={{ backgroundColor: "rgb(0, 0, 128)" }} /> Saltwater<br />
      <span className="swatch" style={{ backgroundColor: "rgb(0, 0, 255)" }} /> Freshwater<br />
      <span className="swatch" style={{ backgroundColor: "rgb(204, 179, 0)" }} /> Supralittoral rock<br />
      <span className="swatch" style={{ backgroundColor: "rgb(204, 179, 0)" }} /> Supralittoral sediment<br />
      <span className="swatch" style={{ backgroundColor: "rgb(255, 255, 128)" }} /> Littoral rock<br />
      <span className="swatch" style={{ backgroundColor: "rgb(255, 255, 128)" }} /> Littoral sediment<br />
      <span className="swatch" style={{ backgroundColor: "rgb(128, 128, 255)" }} /> Saltmarsh<br />
      <span className="swatch" style={{ backgroundColor: "rgb(0, 0, 0)" }} /> Urban<br />
      <span className="swatch" style={{ backgroundColor: "rgb(128, 128, 128)" }} /> Suburban
    </details>
  </>
)

interface ModelOutputLayerSettingsProps {
  layer: ModelOutputLayer
  mutate: (data: any) => void
}

const ModelOutputLayerSettings = ({ layer, mutate }: ModelOutputLayerSettingsProps) => (
  <div className="d-flex align-items-center mt-3">
    Fill mode
    <select className="custom-select ml-3" value={layer.fill} onChange={e => mutate({ fill: e.target.value })}>
      <option value="greyscale">Greyscale</option>
      <option value="heatmap">Heatmap</option>
    </select>
  </div>
)

interface ModelOutputLayerLegendProps {
  layer: ModelOutputLayer
  getLayerData: (id: number) => tileGridStats
}

export function Legend({ colors, minValue, maxValue, type }) {

  if (type === undefined) {
    // if layer is still loading stats will be unavailable.
    return <div></div>
  } else if (type === "BooleanTileGrid") {
    colors = [colors[0], colors[colors.length - 1]]

    const data = [{ color: colors[0], label: "False" }, { color: colors[colors.length - 1], label: "True" }]

    return (
      <div className="color-bar-container-cat">
        <div className="color-bar-legend-cat">
          {data.map(({ color, label }) => (
            <div key={label} className="color-bar-label">
              <div
                style={{ backgroundColor: `rgb(${color.join(",")})` }}
                className="color-bar-color-cat"
              />
              <div className="color-bar-label-text">{label}</div>
            </div>
          ))}
        </div>
      </div>
    )

  } else {

    const mean = ((maxValue - minValue) / 2)

    return (
      <div className="color-bar-container">
        <div className="color-bar">
          {colors.map((color) => (
            <div
              key={color.join(",")}
              style={{ backgroundColor: `rgb(${color.join(",")})` }}
              className="color-bar-item"
            />
          ))}
        </div>
        <div className="color-bar-legend">
          <div title={minValue.toString()} >{minValue.toFixed(3)}</div>
          <div title={mean.toString()} >{mean.toFixed(3)}</div>
          <div title={maxValue.toString()} >{maxValue.toFixed(3)}</div>
        </div>
      </div>
    )
  }

}

function ModelOutputLayerLegend({ layer, getLayerData }: ModelOutputLayerLegendProps) {

  const stats = getLayerData(layer.nodeId)

  const colors = getColorStops((layer.fill == "greyscale" ? "greys" : "jet"), 50).filter(c => typeof c !== "number").reverse()

  return (
    <div>
      <Legend colors={colors} minValue={stats.min} maxValue={stats.max} type={stats.type} />
    </div>
  )
}

interface SidebarProps {
  state: State
  selectLayer: (id: number | undefined) => void
  mutateLayer: (id: number, data: Partial<Layer>) => void
  deleteLayer: (id: number) => void
  setLayerOrder: (ids: number[]) => void
  showLayerPalette: () => void
  hide: () => void
  getLayerData: (id: number) => tileGridStats
}

export const Sidebar = ({ state, selectLayer, mutateLayer, deleteLayer, setLayerOrder, showLayerPalette, hide, getLayerData }: SidebarProps) => {
  const selectedLayer = state.selectedLayer === undefined ? null : state.project.layers[state.selectedLayer]
  return <div className="d-flex flex-column" style={{ width: "300px" }}>
    <div className="px-3 py-2 border-top border-bottom d-flex align-items-center bg-light">
      <div className="flex-grow-1">Layers</div>
      <i className="ml-2 fas fa-plus fa-fw" style={{ cursor: "pointer" }} onClick={showLayerPalette} />
      <i className="ml-2 fas fa-angle-double-right" style={{ cursor: "pointer" }} onClick={hide} />
    </div>
    <div
      className="flex-grow-1 bg-white"
      style={{ overflowY: "auto", flexBasis: "0px" }}
      onClick={() => selectLayer(undefined)}
    >
      <ReactSortable
        list={Array.from(state.project.allLayers).reverse().map(id => ({ id }))}
        setList={(list: { id: number }[]) => { setLayerOrder(list.map(item => item.id).reverse()) }}
      >
        {
          Array.from(state.project.allLayers).reverse().map(id =>
            <div
              key={id}
              className={id === state.selectedLayer ? "d-flex align-items-center bg-primary text-white px-3 py-2" : "align-items-center d-flex px-3 py-2"}
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation()
                selectLayer(id === state.selectedLayer ? undefined : id)
              }}
            >
              <div><i className={`fas fa-fw ${iconForLayerType(state.project.layers[id].type)}`} /></div>
              <span className="ml-2 mr-3 flex-grow-1" style={{ overflowX: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {state.project.layers[id].name}
              </span>
              <span
                onClick={(e) => {
                  e.stopPropagation()
                  mutateLayer(id, { visible: !state.project.layers[id].visible })
                }}
              >
                {
                  state.project.layers[id].visible ?
                    <i className="fas fa-fw fa-eye" /> :
                    <i className="fas fa-fw fa-eye-slash" />
                }
              </span>
            </div>
          )
        }
      </ReactSortable>
    </div>
    {
      selectedLayer?.type == "ModelOutputLayer" &&
      (
        <div className="px-3 py-2 border-top border-bottom bg-light">Layer legend</div>
      )
    }
    {
      selectedLayer?.type == "ModelOutputLayer" &&
      <ModelOutputLayerLegend
        layer={selectedLayer}
        getLayerData={getLayerData}
      />
    }
    <div className="px-3 py-2 border-top border-bottom bg-light">Layer settings</div>
    <div className="p-3 bg-white text-nowrap" style={{ maxHeight: "50vh", overflowY: "auto" }}>
      {
        selectedLayer !== null ?
          <>
            <input
              type="text"
              className="form-control"
              placeholder="Layer name"
              value={selectedLayer.name}
              onChange={
                e => state.selectedLayer !== undefined &&
                  mutateLayer(state.selectedLayer, { name: e.target.value })
              }
            />
            <div className="d-flex align-items-center mt-3">
              Opacity
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                className="custom-range ml-3"
                value={selectedLayer.opacity}
                onChange={
                  e => state.selectedLayer !== undefined &&
                    mutateLayer(state.selectedLayer, { opacity: Number(e.target.value) })
                }
              />
            </div>
            {
              selectedLayer?.type == "OverlayLayer" &&
              <OverlayLayerSettings
                layer={selectedLayer}
                mutate={
                  data => state.selectedLayer !== undefined &&
                    mutateLayer(state.selectedLayer, data)
                }
              />
            }
            {
              selectedLayer?.type == "NevoLayer" &&
              <NevoLayerSettings
                layer={selectedLayer}
                mutate={
                  data => state.selectedLayer !== undefined &&
                    mutateLayer(state.selectedLayer, data)
                }
              />
            }
            {
              selectedLayer?.type == "ModelOutputLayer" &&
              <ModelOutputLayerSettings
                layer={selectedLayer}
                mutate={
                  data => state.selectedLayer !== undefined &&
                    mutateLayer(state.selectedLayer, data)
                }
              />
            }
            {
              selectedLayer?.type == "CehLandCoverLayer" &&
              <CehLandCoverLayerSettings />
            }
          </> :
          <em>No layer selected</em>
      }
    </div>
    <button
      disabled={state.selectedLayer === undefined || state.project.layers[state.selectedLayer].type === "ModelOutputLayer"}
      className="btn btn-outline-danger rounded-0 border-left-0 border-right-0 border-bottom-0"
      onClick={
        () => state.selectedLayer !== undefined &&
          deleteLayer(state.selectedLayer)
      }
      title={
        state.selectedLayer !== undefined && state.project.layers[state.selectedLayer].type === "ModelOutputLayer" ?
          "You can't delete model outputs from this view; please switch to the model editor and delete the corresponding node." : undefined
      }
    >
      Delete layer
    </button>
  </div>
}

interface CollapsedSidebarProps {
  show: () => void
}
export const CollapsedSidebar = ({ show }: CollapsedSidebarProps) => (
  <div className="bg-light">
    <div className="px-3 py-2 border-top border-bottom">
      <i className="fas fa-angle-double-left" style={{ cursor: "pointer" }} onClick={show} />
    </div>
  </div>
)
