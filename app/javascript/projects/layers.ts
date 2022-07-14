import olBaseLayer from 'ol/layer/Base'
import olTileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'

interface BaseLayer {
  name: string
  visible: boolean
  opacity: number
}

interface OsmLayer extends BaseLayer {
  type: "OsmLayer"
}

interface MapTileLayer extends BaseLayer {
  type: "MapTileLayer"
  mapTileLayerId: number
}

export type Layer = OsmLayer | MapTileLayer

export function iconForLayerType(type: Layer['type']) {
  switch (type) {
    case "OsmLayer":
    case "MapTileLayer":
      return "fa-image"
    default:
      return "fa-layer-group"
  }
}

export function layerToOpenLayers(layer: Layer): olBaseLayer {
  switch (layer.type) {
    case "OsmLayer": return new olTileLayer({ source: new OSM({ transition: 0 }), visible: layer.visible, opacity: layer.opacity })
    case "MapTileLayer": throw "Unimplemented"
  }
}
