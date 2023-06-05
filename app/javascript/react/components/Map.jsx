import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

import * as ol from 'ol'
import { asArray } from 'ol/color'
import { defaults as defaultControls, ZoomToExtent } from 'ol/control'
import { GeoJSON } from 'ol/format'
import { Image as olImageLayer, Tile as olTileLayer, Vector as olVectorLayer } from 'ol/layer'
import ImageStatic from 'ol/source/ImageStatic'
import VectorSource from 'ol/source/Vector'
import OSM from 'ol/source/OSM'
import XYZ from 'ol/source/XYZ'
import { fromLonLat } from 'ol/proj'
import { Circle, Fill, Stroke, Style, Text } from 'ol/style'
import { Point } from 'ol/geom'

const MapContext = createContext()

const useMapLayerBinding = (map, layer) => {
  useEffect(() => {
    if (map !== null && layer !== null) {
      map.addLayer(layer)
      return () => map.removeLayer(layer)
    }
  }, [map, layer])
}

export const Map = ({ extent, children }) => {
  const mapRef = useRef()
  const [map, setMap] = useState(null)

  useEffect(() => {
    const labelElement = document.createElement("i")
    labelElement.classList.add("fas", "fa-expand")
    const map = new ol.Map({
      target: mapRef.current,
      view: new ol.View({ center: [0, 0], zoom: 0 }),
      controls: defaultControls().extend([
        new ZoomToExtent({ extent, label: labelElement, tipLabel: "Reset view" })
      ])
    })

    setMap(map)

    return () => {
      map.dispose()
      setMap(null)
    }
  }, [])

  useEffect(() => {
    if (map === null) { return }
    map.getView().fit(extent)
    let zoomControl = map.getControls().item(map.getControls().getLength() - 1)
    zoomControl.extent = extent
  }, [map, extent[0], extent[1], extent[2], extent[3]])

  return <MapContext.Provider value={map}>
    <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
    {children}
  </MapContext.Provider>
}

export const OSMLayer = ({ visible }) => {
  const map = useContext(MapContext)
  const [layer, setLayer] = useState(null)

  useEffect(() => {
    setLayer(new olTileLayer({ source: new OSM(), visible }))
    return () => setLayer(null)
  }, [])

  useEffect(() => {
    layer?.setVisible(visible)
  }, [layer, visible])

  useMapLayerBinding(map, layer)

  return null
}

export const OverlayLayer = ({ visible, id, colour, strokeWidth, backgroundOpacity }) => {
  const colourWithOpacity = asArray(`#${colour}`)
  colourWithOpacity[3] = backgroundOpacity

  const map = useContext(MapContext)
  const [layer, setLayer] = useState(null)

  useEffect(() => {
    setLayer(new olVectorLayer({
      source: new VectorSource({ url: `/overlays/${id}`, format: new GeoJSON() }),
      style: (feature) => {
        if (feature.getGeometry() instanceof Point && !feature.get('name')) {
          return new Style({
            image: new Circle({
              radius: 2,
              fill: new Fill({ color: `#${colour}` }),
            })
          })
        }
        else {
          return new Style({
            stroke: new Stroke({ color: `#${colour}`, width: strokeWidth }),
            fill: new Fill({ color: colourWithOpacity }),
            text: new Text({
              font: `300 14px ${getComputedStyle(document.documentElement).getPropertyValue('--font-family-sans-serif')}`,
              text: feature.get('name'),
              fill: new Fill({
                color: `#${colour}`
              }),
            }),
          })
        }
      },
    }))
    return () => setLayer(null)
  }, [id, colour, strokeWidth, backgroundOpacity])

  useEffect(() => {
    layer?.setVisible(visible)
  }, [layer, visible])

  useMapLayerBinding(map, layer)

  return null
}

export const TileLayer = ({ opacity, visible, mapTileLayer }) => {
  const map = useContext(MapContext)
  const [layer, setLayer] = useState(null)

  useEffect(() => {
    setLayer(new olTileLayer({ opacity, visible }))
    return () => setLayer(null)
  }, [])

  useEffect(() => {
    if (mapTileLayer === null) return
    const { id, minZoom, maxZoom, southWestExtent, northEastExtent } = mapTileLayer
    layer?.setSource(
      new XYZ({
        tileUrlFunction: p => `/map_tile_layers/${id}/map_tile?x=${p[1]}&y=${p[2]}&zoom=${p[0]}`,
        tilePixelRatio: 2,
        minZoom,
        maxZoom
      })
    )
    layer?.setExtent(
      fromLonLat([...southWestExtent].reverse()).concat(
        fromLonLat([...northEastExtent].reverse())
      )
    )
    return () => layer?.setSource(null)
  }, [layer, mapTileLayer])

  useEffect(() => {
    layer?.setVisible(visible)
  }, [layer, visible])

  useEffect(() => {
    layer?.setOpacity(opacity)
  }, [layer, opacity])

  useMapLayerBinding(map, layer)

  return null
}

export const ImageLayer = ({ url, imageExtent, opacity, visible }) => {
  const map = useContext(MapContext)
  const [layer, setLayer] = useState(null)

  useEffect(() => {
    setLayer(new olImageLayer({ opacity, visible }))
    return () => setLayer(null)
  }, [])

  useEffect(() => {
    layer?.setVisible(visible)
  }, [layer, visible])

  useEffect(() => {
    layer?.setOpacity(opacity)
  }, [layer, opacity])

  useEffect(() => {
    if (layer === null) { return }
    layer?.setSource(
      new ImageStatic({
        url,
        imageExtent,
        imageSmoothing: false,
      })
    )
    return () => layer?.setSource(null)
  }, [layer, url, imageExtent])

  useMapLayerBinding(map, layer)

  return null
}
