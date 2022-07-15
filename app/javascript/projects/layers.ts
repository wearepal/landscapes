import olBaseLayer from 'ol/layer/Base'
import olTileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import XYZ from 'ol/source/XYZ'
import { fromLonLat } from 'ol/proj'
import { DBModels } from './db_models'
import olVectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import { asArray } from 'ol/color'
import { Circle, Fill, Stroke, Style, Text } from 'ol/style'
import { Point } from 'ol/geom'

interface BaseLayer {
  name: string
  visible: boolean
  opacity: number
}

export interface OsmLayer extends BaseLayer {
  type: "OsmLayer"
}

export interface MapTileLayer extends BaseLayer {
  type: "MapTileLayer"
  mapTileLayerId: number // TODO: rename to simply "id"
}

export interface OverlayLayer extends BaseLayer {
  type: "OverlayLayer"
  id: number
  strokeWidth: number
  fillOpacity: number
}

export type Layer = OsmLayer | MapTileLayer | OverlayLayer

export function iconForLayerType(type: Layer['type']) {
  switch (type) {
    case "OsmLayer":
    case "MapTileLayer":
      return "fa-image"
    case "OverlayLayer":
      return "fa-draw-polygon"
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
    case "MapTileLayer": {
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
    case "OverlayLayer": {
      const dbLayer = dbModels.overlays.find(overlay => overlay.id === layer.id)
      if (dbLayer === undefined) {
        // TODO: return an empty layer or one that renders an error message
        throw ""
      }
      const colourWithOpacity = asArray(`#${dbLayer.colour}`)
      colourWithOpacity[3] = layer.fillOpacity
      return new olVectorLayer({
        source: new VectorSource({ url: `/overlays/${dbLayer.id}`, format: new GeoJSON() }),
        style: (feature) => {
          if (feature.getGeometry() instanceof Point && !feature.get('name')) {
            return new Style({
              image: new Circle({
                radius: 2,
                fill: new Fill({ color: `#${dbLayer.colour}` }),
              })
            })
          }
          else {
            return new Style({
              stroke: new Stroke({ color: `#${dbLayer.colour}`, width: layer.strokeWidth }),
              fill: new Fill({ color: colourWithOpacity }),
              text: new Text({
                font: `300 14px ${getComputedStyle(document.documentElement).getPropertyValue('--font-family-sans-serif')}`,
                text: feature.get('name'),
                fill: new Fill({
                  color: `#${dbLayer.colour}`
                }),
              }),
            })
          }
        },
        visible: layer.visible,
        opacity: layer.opacity
      })
    }
  }
}
