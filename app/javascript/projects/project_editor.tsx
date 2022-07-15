import * as React from 'react'
import { cloneDeep } from 'lodash'

import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'

import './project_editor.css'
import { ActionType, Action } from './actions'
import { LayerPalette } from './layer_palette'
import { Toolbar } from './toolbar'
import { Layer, layerToOpenLayers } from './layers'
import { Project } from './project'
import { Sidebar, CollapsedSidebar } from './sidebar'
import { MapView } from './map_view'
import { DBModels } from './db_models'

const reduce = (state: Project, action: Action): Project => {
  switch (action.type) {
    case ActionType.SET_NAME:
      return { ...state, name: action.payload }
    case ActionType.SELECT_LAYER:
      return { ...state, selectedLayer: action.payload }
    case ActionType.ADD_LAYER: {
      const layers = cloneDeep(state.layers)
      const nextId = Math.max(0, ...Object.keys(layers).map(k => parseInt(k))) + 1
      layers[nextId] = action.payload
      return { ...state, layers, allLayers: state.allLayers.concat(nextId) }
    }
    case ActionType.DELETE_LAYER: {
      const layers = cloneDeep(state.layers)
      delete layers[action.payload]
      return { ...state, selectedLayer: undefined, layers, allLayers: state.allLayers.filter(e => e !== action.payload) }
    }
    case ActionType.MUTATE_LAYER: {
      const { id, data } = action.payload
      const layers = cloneDeep(state.layers)
      Object.assign(layers[id], data)
      return { ...state, layers }
    }
    default:
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
      <Toolbar backButtonPath={backButtonPath} projectName={project.name} setProjectName={name => dispatch({ type: ActionType.SET_NAME, payload: name })}/>
      <div className="flex-grow-1 d-flex">
        <MapView layers={Object.values(project.layers).map(layer => layerToOpenLayers(layer, dbModels))}/>
        {
          layerPaletteVisible &&
          <LayerPalette
            hide={() => setLayerPaletteVisible(false)}
            addLayer={layer => dispatch({ type: ActionType.ADD_LAYER, payload: layer })}
            dbModels={dbModels}
          />
        }
        {
          sidebarVisible
          ? <Sidebar
              project={project}
              selectLayer={id => dispatch({ type: ActionType.SELECT_LAYER, payload: id })}
              mutateLayer={(id, data) => dispatch({ type: ActionType.MUTATE_LAYER, payload: { id, data } })}
              deleteLayer={id => dispatch({ type: ActionType.DELETE_LAYER, payload: id })}
              showLayerPalette={() => setLayerPaletteVisible(true)}
              hide={() => setSidebarVisible(false)}
            />
          : <CollapsedSidebar show={() => setSidebarVisible(true)}/>
        }
      </div>
    </div>
  )
}
