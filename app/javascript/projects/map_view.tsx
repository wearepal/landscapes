import * as React from 'react'

import { Map, View } from 'ol'
import BaseLayer from 'ol/layer/Base'

interface MapViewProps {
  layers: BaseLayer[]
}
export const MapView = ({ layers }: MapViewProps) => {
  const mapRef = React.useRef<HTMLDivElement>()
  const [map, setMap] = React.useState<Map | null>(null)

  React.useEffect(() => {
    const map = new Map({
      view: new View({
        center: [0, 0],
        zoom: 1
      }),
      target: mapRef.current
    });

    setMap(map)

    return () => {
      map.dispose()
      setMap(null)
    }
  }, [])

  React.useEffect(() => map?.setLayers(layers), [map, layers])

  React.useEffect(() => map?.updateSize())

  return <div className="flex-grow-1 bg-dark" ref={mapRef as any}></div>
}
