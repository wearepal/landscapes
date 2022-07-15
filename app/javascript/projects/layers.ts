import olBaseLayer from 'ol/layer/Base'
import olTileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import XYZ from 'ol/source/XYZ'
import { fromLonLat } from 'ol/proj'
import { DBModels } from './db_models'

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

export function layerToOpenLayers(layer: Layer, dbModels: DBModels): olBaseLayer {
  switch (layer.type) {
    case "OsmLayer":
      return new olTileLayer({
        source: new OSM({ transition: 0 }),
        visible: layer.visible,
        opacity: layer.opacity
      })
    case "MapTileLayer":
      const dbLayer = dbModels.mapTileLayers.find(mapTileLayer => mapTileLayer.id === layer.mapTileLayerId)
      if (dbLayer === undefined) {
        // TODO: return an empty layer or one that renders an error message
        throw ""
      }
      return new olTileLayer({
        source: new XYZ({
          tileUrlFunction: p => `/map_tile_layers/${dbLayer.id}/map_tile?x=${p[1]}&y=${p[2]}&zoom=${p[0]}`,
          tilePixelRatio: 2,
          minZoom: dbLayer.minZoom,
          maxZoom: dbLayer.maxZoom
        }),
        extent: fromLonLat([...dbLayer.southWestExtent].reverse()).concat(
          fromLonLat([...dbLayer.northEastExtent].reverse())
        ),
        visible: layer.visible,
        opacity: layer.opacity
      })
  }
}
