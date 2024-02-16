import BaseLayer from "ol/layer/Base"
import { ShapeLayer } from "../state"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import GeoJSON from "ol/format/GeoJSON"
import { bbox } from "ol/loadingstrategy"
import { Fill, Stroke, Style } from "ol/style"
import { memoize } from "lodash"
import { Map } from "ol"


const getSource = memoize((id: string) => {

    const store = id.split(":")[0]

    const source = new VectorSource({
        url: extent => `https://landscapes.wearepal.ai/geoserver/${store}/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${id}&outputFormat=application/json&bbox=${extent.join(',')},EPSG:3857&crs=EPSG:3857`,
        format: new GeoJSON({
            extractGeometryName: true
        }),
        strategy: bbox,
    })

    return source
})

const getStyle = (layer: ShapeLayer, zoom: number | undefined) => (
        (feature) => {
            return new Style({
                fill : new Fill({
                    color: `rgba(${layer.colors.fill[0]}, ${layer.colors.fill[1]}, ${layer.colors.fill[2]}, ${layer.colors.fill[3]})`
                }),
                stroke: new Stroke({
                    color: `rgba(${layer.colors.stroke[0]}, ${layer.colors.stroke[1]}, ${layer.colors.stroke[2]}, ${layer.colors.stroke[3]})`,
                    width: layer.colors.strokeWidth || 1
                })
            })
        }
)

export function reifyShapeFileLayer (layer: ShapeLayer, existingLayer: BaseLayer | null, map: Map) {

    const vectLayer =  new VectorLayer({
        source: getSource(layer.identifier),
        style: getStyle(layer, map.getView().getZoom()),
        minZoom: layer.minZoom,
    })

    return vectLayer

}