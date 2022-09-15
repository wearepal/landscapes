import * as React from 'react'
import { Map, View } from 'ol'
import { Control, defaults as defaultControls } from 'ol/control'
import { createEmpty as createEmptyExtent, extend, isEmpty } from 'ol/extent'
import olBaseLayer from 'ol/layer/Base'
import VectorLayer from 'ol/layer/Vector'
import { createIconElement } from './util'
import { Layer } from './state'
import { reifyLayer } from './reify_layer'
import { DBModels } from './db_models'

function getLayerExtent(layer: olBaseLayer) {
  if (layer instanceof VectorLayer) {
    return layer.getSource().getExtent()
  }
  else {
    return layer.getExtent()
  }
}

class FitViewControl extends Control {
  constructor() {
    const button = document.createElement("button")
    button.appendChild(createIconElement("search-location"))
    button.title = "Zoom to fit"

    const element = document.createElement("div")
    element.className = "ol-unselectable ol-control"
    element.style.left = ".5em"
    element.style.top = "4em"
    element.appendChild(button)

    super({ element })

    button.addEventListener('click', this.handleClick.bind(this), false)
  }

  handleClick() {
    const map = this.getMap()
    const view = map?.getView()
    const extent = createEmptyExtent()
    map?.getLayers().forEach(layer => {
      const layerExtent = getLayerExtent(layer)
      if (layerExtent !== undefined) {
        extend(extent, layerExtent)
      }
    })
    view?.fit(isEmpty(extent) ? view.getProjection().getExtent() : extent)
  }
}

interface MapViewProps {
  layers: Layer[]
  dbModels: DBModels
}
export const MapView = ({ layers, dbModels }: MapViewProps) => {
  const mapRef = React.useRef<HTMLDivElement>()
  const [map, setMap] = React.useState<Map | null>(null)

  React.useEffect(() => {
    const newMap = new Map({
      view: new View({
        center: [0, 0],
        zoom: 1
      }),
      controls: defaultControls({
        zoomOptions: {
          zoomInLabel: createIconElement("search-plus"),
          zoomOutLabel: createIconElement("search-minus")
        }
      }).extend([new FitViewControl()]),
      target: mapRef.current
    });

    setMap(newMap)

    return () => {
      newMap.dispose()
      setMap(null)
    }
  }, [])

  React.useEffect(() => map?.setLayers(layers.map(l => reifyLayer(l, dbModels, map))), [map, layers])

  React.useEffect(() => map?.updateSize())

  return <div className="flex-grow-1 bg-dark" ref={mapRef as any}></div>
}
