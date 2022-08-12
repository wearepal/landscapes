import * as React from 'react'

import { State } from './state'
import { Layer, OverlayLayer } from './state'
import { iconForLayerType } from "./util"
import { ReactSortable } from 'react-sortablejs'

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

interface SidebarProps {
  state: State
  selectLayer: (id: number | undefined) => void
  mutateLayer: (id: number, data: Partial<Layer>) => void
  deleteLayer: (id: number) => void
  setLayerOrder: (ids: number[]) => void
  showLayerPalette: () => void
  hide: () => void
}
export const Sidebar = ({ state, selectLayer, mutateLayer, deleteLayer, setLayerOrder, showLayerPalette, hide }: SidebarProps) => {
  const selectedLayer = state.selectedLayer === undefined ? null : state.project.layers[state.selectedLayer]
  return <div className="d-flex flex-column" style={{ width: "300px" }}>
    <div className="px-3 py-2 border-top border-bottom d-flex align-items-center bg-light">
      <div className="flex-grow-1">Layers</div>
      <i className="ml-2 fas fa-plus fa-fw" style={{ cursor: "pointer" }} onClick={showLayerPalette}/>
      <i className="ml-2 fas fa-angle-double-right" style={{ cursor: "pointer" }} onClick={hide}/>
    </div>
    <div
      className="flex-grow-1 bg-white"
      style={{ overflowY: "auto", flexBasis: "0px" }}
      onClick={() => selectLayer(undefined)}
    >
      <ReactSortable
        list={Array.from(state.project.allLayers).reverse().map(id => ({ id }))}
        setList={(list: {id: number}[]) => { setLayerOrder(list.map(item => item.id).reverse()) }}
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
              <div><i className={`fas fa-fw ${iconForLayerType(state.project.layers[id].type)}`}/></div>
              <span className="ml-2 mr-3 flex-grow-1" style={{ overflowX: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                { state.project.layers[id].name }
              </span>
              <span
                onClick={(e) => {
                  e.stopPropagation()
                  mutateLayer(id, { visible: !state.project.layers[id].visible })
                }}
              >
                {
                  state.project.layers[id].visible ?
                    <i className="fas fa-fw fa-eye"/> :
                    <i className="fas fa-fw fa-eye-slash"/>
                }
              </span>
            </div>
          )
        }
      </ReactSortable>
    </div>
    <div className="px-3 py-2 border-top border-bottom bg-light">Layer settings</div>
    <div className="p-3 bg-white text-nowrap">
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
          </> :
          <em>No layer selected</em>
      }
    </div>
    <button
      disabled={state.selectedLayer === undefined}
      className="btn btn-outline-danger rounded-0 border-left-0 border-right-0 border-bottom-0"
      onClick={
        () => state.selectedLayer !== undefined &&
        deleteLayer(state.selectedLayer)
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
      <i className="fas fa-angle-double-left" style={{ cursor: "pointer" }} onClick={show}/>
    </div>
  </div>
)
