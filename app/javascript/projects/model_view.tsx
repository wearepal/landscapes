import { debounce, every } from 'lodash'
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
import { NodeComponent } from './node_component'
import { SaveModel } from './modelling/components/save_model_component'

// Rete doesn't export `Transform`, so we have to re-define it ourselves
export interface Transform {
  k: number;
  x: number;
  y: number;
}
export interface ModelViewProps {
  visible: boolean
  initialTransform: Transform
  setTransform: (transform: Transform) => void
  initialModel: Data | null
  setModel: (model: Data) => void
  createOutputLayer: (id: number) => void
  deleteOutputLayer: (id: number) => void
  saveMapLayer: SaveMapLayer
  setProcessing: (processing: boolean) => void
  autoProcessing: boolean
  process: boolean
  setProcess: (process: boolean) => void
  saveModel: SaveModel
}
export function ModelView({ visible, initialTransform, setTransform, initialModel, setModel, createOutputLayer, deleteOutputLayer, saveMapLayer, setProcessing, autoProcessing, process, setProcess, saveModel }: ModelViewProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [editor, setEditor] = React.useState<NodeEditor>()
  const [engine, setEngine] = React.useState<Engine>()

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
    editor.use(ReactRenderPlugin, { component: NodeComponent })
    editor.use(ContextMenuPlugin, {
      searchBar: false, // Too buggy
      delay: 100,
      allocate: (component: BaseComponent) =>
        component.category ? [component.category] : [],
      rename: (component: BaseComponent) =>
        component.contextMenuName || component.name,
    })

    const engine = new Engine("landscapes@1.0.0")
    createDefaultComponents(saveMapLayer, saveModel).forEach(component => {
      editor.register(component)
      engine.register(component)
    })

    const addNodeSyncListeners = () => {
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

    const writeModel = () => {
      // Use JSON.stringify and JSON.parse to perform a deep copy
      setModel(JSON.parse(JSON.stringify(editor.toJSON())))
    }
    const addWriteModelListener = () => editor.on(
      ["nodecreated", "noderemoved", "connectioncreated", "connectionremoved", "nodetranslated", "nodedragged", "process"],
      writeModel
    )

    if (initialModel !== null) {
      editor.fromJSON(initialModel).then(addNodeSyncListeners).then(addWriteModelListener)
    }
    else {
      addNodeSyncListeners()
      addWriteModelListener()
    }

    setEngine(engine)
    setEditor(editor)

    return () => {
      writeModel()
      editor.destroy()
      engine.destroy()
      setEditor(undefined)
      setEngine(undefined)
    }
  }, [ref])

  React.useEffect(() => {

    // TOGGLES MANUAL/AUTOMATIC RECALCULATION

    // a little messy and hacky but hopefully i'll think up a better solution. TODO: change this, please. 

    editor?.events.noderemoved.forEach((e, i, o) => {
      if (e.name === "debounced") o.splice(i, 1)
    })
    editor?.events.connectioncreated.forEach((e, i, o) => {
      if (e.name === "debounced") o.splice(i, 1)
    })
    editor?.events.connectionremoved.forEach((e, i, o) => {
      if (e.name === "debounced") o.splice(i, 1)
    })
    editor?.events.process.forEach((e, i, o) => {
      if (e.name === "debounced") o.splice(i, 1)
    })

    editor?.on(
      ["noderemoved", "connectioncreated", "connectionremoved", "process"],
      debounce(async () => {
        if (autoProcessing) {
          setProcessing(true)
          await engine?.abort()
          await engine?.process(editor.toJSON())
          setProcessing(false)
        }
      })
    )

  }, [editor, engine, autoProcessing])

  React.useEffect(() => {

    // MANUAL RECALCULATION TRIGGER

    const processManual = async () => {

      if (engine && editor && process) {
        setProcessing(true)
        await engine.abort()
        await engine.process(editor.toJSON())
        setProcessing(false)
        setProcess(false)
      }
    }

    processManual()

  }, [process])

  React.useEffect(() => {
    // Fix bug where connectors appear in wrong place when user first switches to model view
    editor?.nodes.forEach(node => editor.view?.updateConnections({ node }))
  }, [editor, visible])

  return <div className={`model-editor bg-dark flex-grow-1 ${!visible ? "d-none" : ""}`} ref={ref}></div>
}
