import { debounce } from 'lodash'
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
import { getDatasets } from './modelling/components/dataset_component'
import { Extent } from 'ol/extent'

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
  getDatasets: getDatasets
  extent: Extent
  zoom: number
}
export function ModelView({ visible, initialTransform, setTransform, initialModel, setModel, createOutputLayer, deleteOutputLayer, saveMapLayer, setProcessing, autoProcessing, process, setProcess, saveModel, getDatasets, extent, zoom }: ModelViewProps) {
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
    createDefaultComponents(saveMapLayer, saveModel, getDatasets, extent, zoom).forEach(component => {
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
      setModel(updateForBackwardsCompatibility(initialModel, editor.components))
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

    function updateForBackwardsCompatibility(initialModel: Data, components: any): Data {

      let model = initialModel;
      let nodeNames = Object.keys(model.nodes)
      let activeComponents = Array.from(components.keys())
      let inactiveComponents: number[] = []

      // remove and log any components that have been deleted/updated
      for (let i = 0; i < nodeNames.length; i++) {
        let node = model.nodes[nodeNames[i]]
        if(!activeComponents.includes(node.name)) {
          inactiveComponents.push(node.id)
          delete model.nodes[nodeNames[i]]
          nodeNames[i] = "deleted"
        }
      }

      // remove any connections that are connected to deleted/updated components
      if(inactiveComponents.length > 0) {
        for (let i = 0; i < nodeNames.length; i++) {
          if(nodeNames[i] !== "deleted") {
            let node = model.nodes[nodeNames[i]]
            let inputs = Object.keys(node.inputs)
            let outputs = Object.keys(node.outputs)

            for (let j = 0; j < inputs.length; j++) {
              let input = node.inputs[inputs[j]]
              input.connections.forEach((connection: any, index: number) => {
                if(inactiveComponents.includes(connection.node)) {
                  input.connections.splice(index, 1)
                }
              })
              model.nodes[nodeNames[i]].inputs[inputs[j]] = input
            }
            

            for (let j = 0; j < outputs.length; j++) {
              let output = node.outputs[outputs[j]]
              output.connections.forEach((connection: any, index: number) => {
                if(inactiveComponents.includes(connection.node)) {
                  output.connections.splice(index, 1)
                }
              })
              model.nodes[nodeNames[i]].outputs[outputs[j]] = output
            }
            
            
          }
      
        }
      }

      return model
    }
