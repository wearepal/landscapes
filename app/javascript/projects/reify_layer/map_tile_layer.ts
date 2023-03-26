import BaseLayer from "ol/layer/Base"
import TileLayer from "ol/layer/Tile"
import { fromLonLat } from "ol/proj"
import XYZ from "ol/source/XYZ"
import { DBModels } from "../db_models"
import { MapTileLayer } from "../state"
import { MapTileLayer as dbMapTileLayer } from "../db_models"

class MapTileLayerSource extends XYZ {
  readonly id: number

  constructor(dbLayer: dbMapTileLayer) {
    super({
      tileUrlFunction: p => `/map_tile_layers/${dbLayer.id}/map_tile?x=${p[1]}&y=${p[2]}&zoom=${p[0]}`,
      tilePixelRatio: 2,
      minZoom: dbLayer.minZoom,
      maxZoom: dbLayer.maxZoom,
    })
    this.id = dbLayer.id
  }
}

export function reifyMapTileLayer(layer: MapTileLayer, existingLayer: BaseLayer | null, dbModels: DBModels) {
  const dbLayer = dbModels.mapTileLayers.find(mapTileLayer => mapTileLayer.id === layer.id)
  if (dbLayer === undefined) {
    return new TileLayer()
  }

  if (existingLayer instanceof TileLayer) {
    const source = existingLayer.getSource()
    if (source instanceof MapTileLayerSource && source.id === dbLayer.id) {
      return existingLayer
    }
  }

  return new TileLayer({
    source: new MapTileLayerSource(dbLayer),
    extent: fromLonLat([...dbLayer.southWestExtent].reverse()).concat(
      fromLonLat([...dbLayer.northEastExtent].reverse())
    ),
  })
}
