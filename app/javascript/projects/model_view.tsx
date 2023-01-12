import * as React from 'react'
import { Engine, NodeEditor } from 'rete'
import ConnectionPlugin from 'rete-connection-plugin'
import MinimapPlugin from 'rete-minimap-plugin'
import ReactRenderPlugin from 'rete-react-render-plugin'
import { TestComponent } from './modelling/components/test_component'

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
}
export function ModelView({ initialTransform, setTransform }: ModelViewProps) {
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
    const component = new TestComponent()
    editor.register(component)
    setTimeout(async () => editor.addNode(await component.createNode()), 1)
    //const engine = new Engine("landscapes@1.0.0")
    return () => {
      editor.destroy()
      //engine.destroy()
    }
  }, [ref])

  return <div className="flex-grow-1" ref={ref}></div>
}
