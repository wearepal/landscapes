import * as React from 'react'

import { Map, View } from 'ol'
import { defaults as defaultControls, ZoomToExtent } from 'ol/control'
import BaseLayer from 'ol/layer/Base'
import { createEmpty as createEmptyExtent, extend, isEmpty } from 'ol/extent'
import { createIconElement } from './util'

interface MapViewProps {
  layers: BaseLayer[]
}
export const MapView = ({ layers }: MapViewProps) => {
  const mapRef = React.useRef<HTMLDivElement>()
  const [map, setMap] = React.useState<Map | null>(null)
  const [zoomToExtent, setZoomToExtent] = React.useState<ZoomToExtent | null>(null)

  React.useEffect(() => {
    const zoomToExtent = new ZoomToExtent({ label: createIconElement("search-location") })
    const map = new Map({
      view: new View({
        center: [0, 0],
        zoom: 1
      }),
      controls: defaultControls({
        zoomOptions: {
          zoomInLabel: createIconElement("search-plus"),
          zoomOutLabel: createIconElement("search-minus")
        }
      }).extend([zoomToExtent]),
      target: mapRef.current
    });

    setMap(map)
    setZoomToExtent(zoomToExtent)

    return () => {
      map.dispose()
      setMap(null)
      setZoomToExtent(null)
    }
  }, [])

  React.useEffect(() => map?.setLayers(layers), [map, layers])

  React.useEffect(() => map?.updateSize())

  React.useEffect(() => {
    // TODO: doesn't calculate extent of overlay layers properly
    // TODO: maybe we should add a "zoom to selection" button as well?
    if (map !== null && zoomToExtent !== null) {
      const extent = createEmptyExtent()
      map.getLayers().forEach(layer => {
        const layerExtent = layer.getExtent()
        if (layerExtent !== undefined) {
          extend(extent, layerExtent)
        }
      })

      Object.assign(zoomToExtent, { extent: isEmpty(extent) ? undefined : extent })
    }
  })

  return <div className="flex-grow-1 bg-dark" ref={mapRef as any}></div>
}
