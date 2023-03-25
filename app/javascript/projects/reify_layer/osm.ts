import BaseLayer from "ol/layer/Base"
import TileLayer from "ol/layer/Tile"
import OSM from "ol/source/OSM"

const source = new OSM()

export function reifyOsmLayer(existingLayer: BaseLayer | null) {
  if (existingLayer instanceof TileLayer && existingLayer.getSource() === source) {
    return existingLayer
  }
  
  return new TileLayer({ source })
}
