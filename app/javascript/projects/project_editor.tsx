import * as React from 'react'
import './project_editor.css'
import { LayerPalette } from './layer_palette'
import { Toolbar } from './toolbar'
import { reifyLayer } from './reify_layer'
import { defaultProject, State, Project } from './state'
import { Sidebar, CollapsedSidebar } from './sidebar'
import { MapView } from './map_view'
import { DBModels } from './db_models'
import { reduce } from './reducer'

interface ProjectEditorProps {
  projectId: number
  projectSource: Project
  backButtonPath: string
  dbModels: DBModels
}
export function ProjectEditor({ projectId, projectSource, backButtonPath, dbModels }: ProjectEditorProps) {
  const [state, dispatch] = React.useReducer(reduce, {
    project: { ...defaultProject, ...projectSource },
    hasUnsavedChanges: false
  })
  const [sidebarVisible, setSidebarVisible] = React.useState(true)
  const [layerPaletteVisible, setLayerPaletteVisible] = React.useState(false)

  const saveProject = async () => {
    const method = 'PATCH'

    const headers = new Headers()
    headers.set('X-CSRF-Token', (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement).content)

    const body = new FormData()
    body.set('project[source]', JSON.stringify(state.project))

    const response = await fetch(`/projects/${projectId}`, { method, headers, body })

    if (response.ok) {
      dispatch({ type: "FinishSave" })
    }
    else {
      throw new Error(response.statusText)
    }
  }

  return (
    <div style={{ height: "calc(100vh - 3.5rem)" }} className="d-flex flex-column">
      <Toolbar
        backButtonPath={backButtonPath}
        projectName={state.project.name}
        hasUnsavedChanges={state.hasUnsavedChanges}
        setProjectName={name => dispatch({ type: "SetProjectName", name })}
        saveProject={saveProject}
      />
      <div className="flex-grow-1 d-flex">
        <MapView layers={state.project.allLayers.map(id => reifyLayer(state.project.layers[id], dbModels))}/>
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
              state={state}
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
