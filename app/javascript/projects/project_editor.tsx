import * as React from 'react'
import './project_editor.css'
import { LayerPalette } from './layer_palette'
import { Toolbar } from './toolbar'
import { reifyLayer } from './reify_layer'
import { Project } from './state'
import { Sidebar, CollapsedSidebar } from './sidebar'
import { MapView } from './map_view'
import { DBModels } from './db_models'
import { reduce } from './reducer'

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
