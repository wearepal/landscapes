import { asArray } from "ol/color"
import GeoJSON from "ol/format/GeoJSON"
import { Point } from "ol/geom"
import BaseLayer from "ol/layer/Base"
import TileLayer from "ol/layer/Tile"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import { Fill, Stroke, Style, Text } from "ol/style"
import CircleStyle from "ol/style/Circle"
import { DBModels } from "../db_models"
import { OverlayLayer } from "../state"

class OverlaySource extends VectorSource {
  readonly id: number

  constructor(id: number) {
    super({ url: `/overlays/${id}`, format: new GeoJSON() })
    this.id = id
  }
}

export function reifyOverlayLayer(layer: OverlayLayer, existingLayer: BaseLayer | null, dbModels: DBModels) {
  const dbLayer = dbModels.overlays.find(overlay => overlay.id === layer.id)
  if (dbLayer === undefined) {
    return new TileLayer()
  }

  if (existingLayer instanceof VectorLayer) {
    const source = existingLayer.getSource()
    if (source instanceof OverlaySource && source.id === layer.id) {
      return existingLayer
    }
  }

  console.log("reinit")

  const colourWithOpacity = asArray(`#${dbLayer.colour}`)
  colourWithOpacity[3] = layer.fillOpacity
  return new VectorLayer({
    source: new OverlaySource(layer.id),
    style: (feature) => {
      if (feature.getGeometry() instanceof Point && !feature.get('name')) {
        return new Style({
          image: new CircleStyle({
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
  })
}
