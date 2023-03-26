import { Map } from 'ol'
import BaseLayer from 'ol/layer/Base'
import TileLayer from 'ol/layer/Tile'
import { DBModels } from '../db_models'
import { ModelOutputCache } from '../map_view'
import { Layer } from '../state'
import { reifyCehLandCoverLayer } from './ceh_land_cover'
import { reifyMapTileLayer } from './map_tile_layer'
import { reifyModelOutputLayer } from './model_output'
import { reifyNevoLayer } from './nevo'
import { reifyOsmLayer } from './osm'
import { reifyOverlayLayer } from './overlay'

export const reifyLayer = (layer: Layer, existingLayer: BaseLayer | null, dbModels: DBModels, map: Map, modelOutputCache: ModelOutputCache): BaseLayer => {
  const layerType = layer.type
  switch (layerType) {
    case "OsmLayer": return reifyOsmLayer(existingLayer)
    case "MapTileLayer": return reifyMapTileLayer(layer, existingLayer, dbModels)
    case "OverlayLayer": return reifyOverlayLayer(layer, existingLayer, dbModels)
    case "NevoLayer": return reifyNevoLayer(layer, existingLayer)
    case "CehLandCoverLayer": return reifyCehLandCoverLayer(existingLayer)
    case "ModelOutputLayer": return reifyModelOutputLayer(layer, existingLayer, modelOutputCache)
    default: {
      // Ensure this switch statement is exhaustive
      const unreachable: never = layerType
      return new TileLayer()
    }
  }
}
