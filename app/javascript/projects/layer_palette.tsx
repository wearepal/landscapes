import * as React from 'react'
import { Layer, iconForLayerType } from './layers'

interface AddLayerButtonProps {
  prototype: Layer
  addLayer: (Layer) => void
}
const AddLayerButton = ({ prototype, addLayer }: AddLayerButtonProps) => (
  <div
    className="px-3 py-2 d-flex align-items-center add-layer-button"
    onClick={() => addLayer(prototype) }
  >
    <i className={`fas fa-fw ${iconForLayerType(prototype.type)}`}/>
    <div className="ml-2 mr-3 flex-grow-1">{ prototype.name }</div>
    <i className="fas fa-plus add-layer-button-plus"/>
  </div>
)

interface SectionProps {
  title: string
  children: React.ReactNode
}
const Section = ({ title, children }: SectionProps) => (
  <details>
    <summary className="px-3 py-2 bg-light border-bottom">{ title }</summary>
    <div className="d-flex flex-column border-bottom bg-white">
      { children }
    </div>
  </details>
)

interface LayerPaletteProps {
  addLayer: (Layer) => void
  hide: () => void
}
export const LayerPalette = ({ addLayer, hide }: LayerPaletteProps) => (
  <div className="bg-light border-right d-flex flex-column" style={{ minWidth: "300px" }}>
    <div className="px-3 py-2 border-top border-bottom d-flex align-items-center justify-content-between">
      Add layer
      <i className="fas fa-times" style={{ cursor: "pointer" }} onClick={ hide }/>
    </div>
    <div className="flex-grow-1">
      <Section title="Base layers">
        <AddLayerButton addLayer={addLayer} prototype={{ type: "OsmLayer", name: "OpenStreetMap", visible: true, opacity: 1 }}/>
      </Section>
    </div>
  </div>
)
