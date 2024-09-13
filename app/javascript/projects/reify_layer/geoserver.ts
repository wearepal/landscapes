import BaseLayer from "ol/layer/Base"
import { GeoserverLayer } from "../state"
import TileLayer from "ol/layer/Tile"
import TileWMS from "ol/source/TileWMS"
import { memoize } from "lodash"



const getSourceWMS = memoize((layer: GeoserverLayer) =>
    new TileWMS({
        url: 'https://landscapes.wearepal.ai/geoserver/wms',
        params: {'LAYERS': layer.layerName, 'TILED': true},
        serverType: 'geoserver',
        imageSmoothing: false
    })
)

export function reifyGeoserverWMSLayer (layer: GeoserverLayer, existingLayer: BaseLayer | null) {

    return new TileLayer({
        source: getSourceWMS(layer)
    })
}
