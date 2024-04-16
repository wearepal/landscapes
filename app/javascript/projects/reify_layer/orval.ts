import BaseLayer from "ol/layer/Base"
import { ORValLayer } from "../state"
import { Map } from "ol"
import TileWMS from "ol/source/TileWMS"
import { memoize } from "lodash"
import TileLayer from "ol/layer/Tile"


const getSourceWMS = memoize((layer: ORValLayer) =>
    new TileWMS({
        url: 'https://landscapes.wearepal.ai/geoserver/wms',
        params: {
            'LAYERS': layer.source, 
            'TILED': true,
            'STYLES': layer.style
        },
        serverType: 'geoserver',
        imageSmoothing: false,
        attributions: '&copy; <a href="https://www.leep.exeter.ac.uk/orval/">ORVal</a> Partners'
    })
)

export function reifyOrvalLayer (layer: ORValLayer, existingLayer: BaseLayer | null, map: Map) {
    return new TileLayer({
        source: getSourceWMS(layer)
    })
}