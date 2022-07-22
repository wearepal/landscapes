import * as React from 'react'
import { cloneDeep, isEqual } from 'lodash'
import './project_editor.css'
import { Action } from './actions'
import { LayerPalette } from './layer_palette'
import { Toolbar } from './toolbar'
import { reifyLayer } from './layers'
import { Project } from './project'
import { Sidebar, CollapsedSidebar } from './sidebar'
import { MapView } from './map_view'
import { DBModels } from './db_models'

const reduce = (state: Project, action: Action): Project => {
  const actionType = action.type
  switch (actionType) {
    case "SetProjectName":
      return { ...state, name: action.name }
    case "SelectLayer":
      return { ...state, selectedLayer: action.id }
    case "AddLayer": {
      const layers = cloneDeep(state.layers)
      const nextId = Math.max(0, ...Object.keys(layers).map(k => parseInt(k))) + 1
      layers[nextId] = action.layer
      return { ...state, layers, allLayers: state.allLayers.concat(nextId) }
    }
    case "DeleteLayer": {
      const layers = cloneDeep(state.layers)
      delete layers[action.id]
      return { ...state, selectedLayer: undefined, layers, allLayers: state.allLayers.filter(e => e !== action.id) }
    }
    case "MutateLayer": {
      const { id, data } = action
      const layers = cloneDeep(state.layers)
      Object.assign(layers[id], data)
      return { ...state, layers }
    }
    case "SetLayerOrder": {
      if (!isEqual([...state.allLayers].sort(), [...action.order].sort())) {
        throw new Error("Cannot add or remove layers via SET_LAYER_ORDER action")
      }
      return { ...state, allLayers: action.order }
    }
    default:
      // Ensure we've handled every action type
      const unreachable: never = actionType
      return { ...state }
  }
}

const defaultState: Project = {
  name: "Untitled project",
  layers: {
    1: { type: "OsmLayer", name: "OpenStreetMap", visible: true, opacity: 1 },
  },
  allLayers: [1]
}

interface ProjectEditorProps {
  projectSource: Project
  backButtonPath: string
  dbModels: DBModels
}
export function ProjectEditor({ projectSource, backButtonPath, dbModels }: ProjectEditorProps) {
  const [project, dispatch] = React.useReducer(reduce, { ...defaultState, ...projectSource })
  const [sidebarVisible, setSidebarVisible] = React.useState(true)
  const [layerPaletteVisible, setLayerPaletteVisible] = React.useState(false)

  return (
    <div style={{ height: "calc(100vh - 3.5rem)" }} className="d-flex flex-column">
      <Toolbar backButtonPath={backButtonPath} projectName={project.name} setProjectName={name => dispatch({ type: "SetProjectName", name })}/>
      <div className="flex-grow-1 d-flex">
        <MapView layers={project.allLayers.map(id => reifyLayer(project.layers[id], dbModels))}/>
        {
          layerPaletteVisible &&
          <LayerPalette
            hide={() => setLayerPaletteVisible(false)}
            addLayer={layer => dispatch({ type: "AddLayer", layer })}
            dbModels={dbModels}
          />
        }
        {
          sidebarVisible
          ? <Sidebar
              project={project}
              selectLayer={id => dispatch({ type: "SelectLayer", id })}
              mutateLayer={(id, data) => dispatch({ type: "MutateLayer", id, data })}
              deleteLayer={id => dispatch({ type: "DeleteLayer", id })}
              setLayerOrder={order => dispatch({ type: "SetLayerOrder", order })}
              showLayerPalette={() => setLayerPaletteVisible(true)}
              hide={() => setSidebarVisible(false)}
            />
          : <CollapsedSidebar show={() => setSidebarVisible(true)}/>
        }
      </div>
    </div>
  )
}
