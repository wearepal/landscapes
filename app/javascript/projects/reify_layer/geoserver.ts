import BaseLayer from "ol/layer/Base"
import { MLLayer } from "../state"
import TileLayer from "ol/layer/Tile"
import TileWMS from "ol/source/TileWMS"
import { memoize } from "lodash"



const getSourceWMS = memoize((layer: MLLayer) =>
    new TileWMS({
        url: 'https://landscapes.wearepal.ai/geoserver/wms',
        params: {'LAYERS': layer.layerName, 'TILED': true, 'STYLES': 'ml:treesandhedges'},
        serverType: 'geoserver',
        imageSmoothing: false
    })
)


export function reifyGeoserverWMSLayer (layer: MLLayer, existingLayer: BaseLayer | null) {

    return new TileLayer({
        source: getSourceWMS(layer)
    })
}
