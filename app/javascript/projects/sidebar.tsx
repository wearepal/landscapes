import * as React from 'react'

import { Project } from './project'
import { iconForLayerType } from './layers'

interface SidebarProps {
  project: Project
  selectLayer: (id: number | undefined) => void
  mutateLayer: (id: number, data: any) => void
  deleteLayer: (id: number) => void
  showLayerPalette: () => void
  hide: () => void
}
export const Sidebar = ({ project, selectLayer, mutateLayer, deleteLayer, showLayerPalette, hide }: SidebarProps) => (
  <div className="d-flex flex-column" style={{ width: "300px" }}>
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
      {
        Array.from(project.allLayers).reverse().map(id =>
          <div
            key={id}
            className={id === project.selectedLayer ? "d-flex align-items-center bg-primary text-white px-3 py-2" : "align-items-center d-flex px-3 py-2"}
            style={{ cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation()
              selectLayer(id === project.selectedLayer ? undefined : id)
            }}
          >
            <div><i className={`fas fa-fw ${iconForLayerType(project.layers[id].type)}`}/></div>
            <span className="ml-2 mr-3 flex-grow-1" style={{ overflowX: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              { project.layers[id].name }
            </span>
            <span
              onClick={(e) => {
                e.stopPropagation()
                mutateLayer(id, { visible: !project.layers[id].visible })
              }}
            >
              {
                project.layers[id].visible ?
                  <i className="fas fa-fw fa-eye"/> :
                  <i className="fas fa-fw fa-eye-slash"/>
              }
            </span>
          </div>
        )
      }
    </div>
    <div className="px-3 py-2 border-top border-bottom bg-light">Layer settings</div>
    <div className="p-3 bg-white">
      {
        project.selectedLayer ?
          <>
            Name
            <br/>
            <input
              type="text"
              className="form-control"
              value={project.layers[project.selectedLayer].name}
              onChange={e => project.selectedLayer && mutateLayer(project.selectedLayer, { name: e.target.value })}
            />
            <br/>
            Opacity
            <br/>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              className="custom-range"
              value={project.layers[project.selectedLayer].opacity} 
              onChange={e => project.selectedLayer && mutateLayer(project.selectedLayer, { opacity: Number(e.target.value) })}
            />
          </> :
          <em>No layer selected</em>
      }
    </div>
    <button
      disabled={project.selectedLayer === undefined}
      className="btn btn-outline-danger rounded-0 border-left-0 border-right-0 border-bottom-0"
      onClick={() => project.selectedLayer && deleteLayer(project.selectedLayer)}
    >
      Delete layer
    </button>
  </div>
)

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
