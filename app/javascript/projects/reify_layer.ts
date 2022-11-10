import { memoize } from 'lodash'
import { asArray } from 'ol/color'
import { Extent } from 'ol/extent'
import { bbox } from 'ol/loadingstrategy'
import GeoJSON from 'ol/format/GeoJSON'
import { Point } from 'ol/geom'
import olBaseLayer from 'ol/layer/Base'
import olTileLayer from 'ol/layer/Tile'
import olVectorLayer from 'ol/layer/Vector'
import { fromLonLat, ProjectionLike } from 'ol/proj'
import OSM from 'ol/source/OSM'
import VectorSource from 'ol/source/Vector'
import XYZ from 'ol/source/XYZ'
import { Circle, Fill, Stroke, Style, Text } from 'ol/style'
import { DBModels } from './db_models'
import { minMaxByNevoLevelAndProperty, minZoomByNevoLevel, NevoLevel } from './nevo'
import { Layer } from './state'
import { Map } from 'ol'

const osmSource = new OSM({ transition: 0 })
const createMapTileSource = memoize((id: number, minZoom: number, maxZoom: number) =>
  new XYZ({
    tileUrlFunction: p => `/map_tile_layers/${id}/map_tile?x=${p[1]}&y=${p[2]}&zoom=${p[0]}`,
    tilePixelRatio: 2,
    minZoom,
    maxZoom,
    transition: 0
  })
)
const createGeoJSONFormat = memoize((dataProjection?: ProjectionLike) => new GeoJSON({ dataProjection }))
const createOverlaySource = memoize((id: number) =>
  new VectorSource({ url: `/overlays/${id}`, format: createGeoJSONFormat() })
)
const createNevoSource = memoize((level: NevoLevel) =>
  new VectorSource({
    url: (extent: Extent) => `https://geo.leep.exeter.ac.uk/geoserver/nevo/wfs?bbox=${extent.join(",")},EPSG:3857&srsname=EPSG:3857&outputFormat=application/json&request=GetFeature&typename=nevo:explore_${level}_rounded&version=2.0.0`,
    strategy: bbox,
    attributions: '&copy; <a href="https://www.exeter.ac.uk/research/leep/research/nevo/">NEVO</a> Partners',
    format: createGeoJSONFormat(),
    overlaps: false,
  })
)
const createEmptyLayer = () => new olTileLayer()

export const reifyLayer = (layer: Layer, dbModels: DBModels, map: Map): olBaseLayer => {
  const layerType = layer.type
  switch (layerType) {
    case "OsmLayer": {
      return new olTileLayer({
        source: osmSource,
        visible: layer.visible,
        opacity: layer.opacity
      })
    }

    case "MapTileLayer": {
      const dbLayer = dbModels.mapTileLayers.find(mapTileLayer => mapTileLayer.id === layer.id)
      if (dbLayer === undefined) {
        return createEmptyLayer()
      }
      return new olTileLayer({
        source: createMapTileSource(dbLayer.id, dbLayer.minZoom, dbLayer.maxZoom),
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
        return createEmptyLayer()
      }
      const colourWithOpacity = asArray(`#${dbLayer.colour}`)
      colourWithOpacity[3] = layer.fillOpacity
      return new olVectorLayer({
        source: createOverlaySource(dbLayer.id),
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

    case "NevoLayer": {
      const source = createNevoSource(layer.level)

      return new olVectorLayer({
        source: source,
        style: (feature) => {
          const color = (() => {
            const [min, max] = minMaxByNevoLevelAndProperty[layer.level][layer.property]
            const value = feature.get(layer.property) / feature.get("tot_area")
            const normalisedValue = max === min ? 1 : (value - min) / (max - min)
            switch (layer.fill) {
              case "greyscale": return `hsl(0, 0%, ${100 * normalisedValue}%)`
              case "heatmap": return `hsl(${240 * (1 - normalisedValue)}, 100%, 50%)`
            }
          })()

          return new Style({
            fill: new Fill({ color }),
            stroke: new Stroke({ color: "rgba(255, 255, 255, 0.2)", width: 1 })
          })
        },
        visible: layer.visible,
        opacity: layer.opacity,
        minZoom: minZoomByNevoLevel[layer.level]
      })
    }

    default: {
      // Ensure this switch statement is exhaustive
      const unreachable: never = layerType
      return createEmptyLayer()
    }
  }
}
