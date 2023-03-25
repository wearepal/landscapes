import * as React from 'react'
import { Engine, NodeEditor } from 'rete'
import ConnectionPlugin from 'rete-connection-plugin'
import ContextMenuPlugin from 'rete-context-menu-plugin'
import MinimapPlugin from 'rete-minimap-plugin'
import ReactRenderPlugin from 'rete-react-render-plugin'
import { Data } from 'rete/types/core/data'
import { createDefaultComponents } from './modelling/components'
import { BaseComponent } from './modelling/components/base_component'
import { SaveMapLayer } from './modelling/components/map_layer_component'

import "./model_view.css"

// Rete doesn't export `Transform`, so we have to re-define it ourselves
export interface Transform {
  k: number;
  x: number;
  y: number;
}
export interface ModelViewProps {
  initialTransform: Transform
  setTransform: (transform: Transform) => void
  initialModel: Data | null
  setModel: (model: Data) => void
  createOutputLayer: (id: number) => void
  deleteOutputLayer: (id: number) => void
  saveMapLayer: SaveMapLayer
  setProcessing: (processing: boolean) => void
}
export function ModelView({ initialTransform, setTransform, initialModel, setModel, createOutputLayer, deleteOutputLayer, saveMapLayer, setProcessing }: ModelViewProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if (ref.current === null) return

    const editor = new NodeEditor("landscapes@1.0.0", ref.current)
    editor.view.area.transform = initialTransform
    editor.view.area.update()
    const updateTransform = () => setTransform(editor.view.area.transform)
    editor.on("zoomed", updateTransform)
    editor.on("translated", () => updateTransform)
    editor.use(ConnectionPlugin)
    editor.use(MinimapPlugin)
    editor.use(ReactRenderPlugin)
    editor.use(ContextMenuPlugin, {
      searchBar: false, // Too buggy
      delay: 100,
      allocate: (component: BaseComponent) => 
        component.category ? [component.category] : [],
      rename: (component: BaseComponent) =>
        component.contextMenuName || component.name,
    })
    const engine = new Engine("landscapes@1.0.0")
    createDefaultComponents(saveMapLayer).forEach(component => {
      editor.register(component)
      engine.register(component)
    })

    const hookNodeCreation = () => {
      editor.on("nodecreated", e => {
        if (e.name === "Map layer") {
          createOutputLayer(e.id)
        }
      })

      editor.on("noderemoved", e => {
        if (e.name === "Map layer") {
          deleteOutputLayer(e.id)
        }
      })
    }

    if (initialModel !== null) {
      editor.fromJSON(initialModel).then(hookNodeCreation).then(() => {
        const process = async () => {
          setProcessing(true)
          await engine.abort()
          await engine.process(editor.toJSON())
          setProcessing(false)
        }
        editor.on(["nodecreated", "noderemoved", "connectioncreated", "connectionremoved"], process)
        process()
      })
    }
    else {
      hookNodeCreation()
    }


    const save = () => {
      // Use JSON.stringify and JSON.parse to perform a deep copy
      setModel(JSON.parse(JSON.stringify(editor.toJSON())))
    }

    editor.on(
      ["nodecreated", "noderemoved", "connectioncreated", "connectionremoved", "nodetranslated", "nodedragged"],
      save
    )

    return () => {
      save()
      editor.destroy()
      engine.destroy()
    }
  }, [ref])

  return <div className="flex-grow-1" ref={ref}></div>
}
