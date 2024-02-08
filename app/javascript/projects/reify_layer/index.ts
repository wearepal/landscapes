import { Map } from 'ol'
import BaseLayer from 'ol/layer/Base'
import TileLayer from 'ol/layer/Tile'
import { DBModels } from '../db_models'
import { DatasetCache, ModelOutputCache } from '../map_view'
import { DatasetLayer, Layer } from '../state'
import { reifyCehLandCoverLayer } from './ceh_land_cover'
import { reifyMapTileLayer } from './map_tile_layer'
import { reifyModelOutputLayer } from './model_output'
import { reifyNevoLayer } from './nevo'
import { reifyOsmLayer } from './osm'
import { reifyOverlayLayer } from './overlay'
import { reifyCropMapLayer } from './crop_map_layer'
import { reifyAtiLayer } from './ati'
import { reifyShapeFileLayer } from './shapefile'
import { reifyBoundaryLayer } from './boundary'
import { reifyGeoserverWMSLayer } from './geoserver'

export const reifyLayer = (layer: Layer, existingLayer: BaseLayer | null, dbModels: DBModels, map: Map, modelOutputCache: ModelOutputCache, DatasetCache: DatasetCache, loadteamDataset: (layer: DatasetLayer) => void): BaseLayer => {
  const layerType = layer.type
  switch (layerType) {
    case "OsmLayer": return reifyOsmLayer(existingLayer)
    case "MapTileLayer": return reifyMapTileLayer(layer, existingLayer, dbModels)
    case "OverlayLayer": return reifyOverlayLayer(layer, existingLayer, dbModels)
    case "NevoLayer": return reifyNevoLayer(layer, existingLayer)
    case "CehLandCoverLayer": return reifyCehLandCoverLayer(existingLayer)
    case "ModelOutputLayer": return reifyModelOutputLayer(layer, existingLayer, modelOutputCache, loadteamDataset)
    case "DatasetLayer": return reifyModelOutputLayer(layer, existingLayer, DatasetCache, loadteamDataset)
    case "CropMapLayer": return reifyCropMapLayer(layer, existingLayer)
    case "AtiLayer" : return reifyAtiLayer(layer, existingLayer, map)
    case "ShapeLayer": return reifyShapeFileLayer(layer, existingLayer, map)
    case "BoundaryLayer": return reifyBoundaryLayer(layer, existingLayer, map)
    case "MLLayer": return reifyGeoserverWMSLayer(layer, existingLayer)
    default: {
      // Ensure this switch statement is exhaustive
      const unreachable: never = layerType
      return new TileLayer()
    }
  }
}
