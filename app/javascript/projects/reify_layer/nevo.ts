import VectorSource from "ol/source/Vector"
import { bbox } from "ol/loadingstrategy"
import GeoJSON from "ol/format/GeoJSON"
import VectorLayer from "ol/layer/Vector"
import { minMaxByNevoLevelAndProperty, minZoomByNevoLevel, NevoLevel } from "../nevo"
import { NevoLayer } from "../state"
import BaseLayer from "ol/layer/Base"
import { Fill, Stroke, Style } from "ol/style"
import { memoize } from "lodash"

// TODO: don't use memoize

const getSourceForLevel = memoize((level: NevoLevel) =>
  new VectorSource({
    url: extent => `https://geo.leep.exeter.ac.uk/geoserver/nevo/wfs?bbox=${extent.join(",")},EPSG:3857&srsname=EPSG:3857&outputFormat=application/json&request=GetFeature&typename=nevo:explore_${level}_rounded&version=2.0.0`,
    strategy: bbox,
    attributions: '&copy; <a href="https://www.exeter.ac.uk/research/leep/research/nevo/">NEVO</a> Partners',
    format: new GeoJSON(),
    overlaps: false,
  })
)

const getStyleFunctionForLayer = memoize((layer: NevoLayer) =>
  (feature) => {
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
  }
)

export function reifyNevoLayer(layer: NevoLayer, existingLayer: BaseLayer | null) {
  if (existingLayer instanceof VectorLayer && existingLayer.getStyleFunction() == getStyleFunctionForLayer(layer)) {
    const source = existingLayer.getSource()
    if (source instanceof VectorSource && source === getSourceForLevel(layer.level)) {
      return existingLayer
    }
  }

  return new VectorLayer({
    source: getSourceForLevel(layer.level),
    style: getStyleFunctionForLayer(layer),
    minZoom: minZoomByNevoLevel[layer.level]
  })
}
