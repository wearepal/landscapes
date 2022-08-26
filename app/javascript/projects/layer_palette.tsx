import * as React from 'react'
import { DBModels } from './db_models'
import { Layer } from './state'
import { iconForLayerType } from "./util"

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
  children?: React.ReactNode
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
  dbModels: DBModels
}
export const LayerPalette = ({ addLayer, hide, dbModels }: LayerPaletteProps) => (
  <div className="bg-light border-right d-flex flex-column" style={{ minWidth: "300px" }}>
    <div className="px-3 py-2 border-top border-bottom d-flex align-items-center justify-content-between">
      Add layer
      <i className="fas fa-times" style={{ cursor: "pointer" }} onClick={ hide }/>
    </div>
    <div className="flex-grow-1" style={{ overflowY: "auto", flexBasis: "0px" }}>
      {
        dbModels.overlays.length > 0 &&
        <Section title="Overlays">
          {
            dbModels.overlays.map(layer => (
              <AddLayerButton
                key={layer.id}
                addLayer={addLayer}
                prototype={{
                  type: "OverlayLayer",
                  name: layer.name,
                  visible: true,
                  opacity: 1,
                  id: layer.id,
                  strokeWidth: 2,
                  fillOpacity: 0.2
                }}
              />
            ))
          }
        </Section>
      }
      {
        dbModels.mapTileLayers.length > 0 &&
        <Section title="Aerial/Satellite imagery">
          {
            dbModels.mapTileLayers.map(layer => (
              <AddLayerButton
                key={layer.id}
                addLayer={addLayer}
                prototype={{
                  type: "MapTileLayer",
                  name: layer.name,
                  visible: true,
                  opacity: 1,
                  id: layer.id
                }}
              />
            ))
          }
        </Section>
      }
      <Section title="Base layers">
        <AddLayerButton
          addLayer={addLayer}
          prototype={{
            type: "OsmLayer",
            name: "OpenStreetMap",
            visible: true,
            opacity: 1
          }}
        />
      </Section>
    </div>
  </div>
)
