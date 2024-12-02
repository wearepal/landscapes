import BaseLayer from "ol/layer/Base"
import { WFSLayer } from "../state"
import GeoJSON from "ol/format/GeoJSON"
import Map from "ol/Map"
import VectorLayer from "ol/layer/Vector"
import { memoize } from "lodash"
import VectorSource from "ol/source/Vector"
import { bbox } from "ol/loadingstrategy"
import { Fill, Stroke, Style } from "ol/style"
import { natmap_outputs } from "../modelling/components/natmap_soil_component"
import { findColor } from "../analysis_panel_tools/subsection"
import { getColorStops } from "./model_output"

const getSource = memoize((id: string, attribution: undefined | string) => {

    const store = id.split(":")[0]

    const source = new VectorSource({
        url: extent => `https://landscapes.wearepal.ai/geoserver/${store}/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${id}&outputFormat=application/json&bbox=${extent.join(',')},EPSG:3857&crs=EPSG:3857`,
        format: new GeoJSON({
            extractGeometryName: true
        }),
        strategy: bbox,
        attributions: attribution
    })

    return source

})

const getStyle = (layer: WFSLayer, colMap: any[]) => (
    (feature) => {

        const propIdx = layer.propIdx
        const prop = natmap_outputs[propIdx]
        const val = feature.get(prop.key)
        const [min, max] = [prop.min, prop.max]

        const normalisedValue = prop.min > prop.max ? 1 - (val - min) / (max - min) : (val - min) / (max - min)
        const col = findColor(normalisedValue, colMap)
        
        return new Style({
            fill: new Fill({ color: `rgba(${col[0]}, ${col[1]}, ${col[2]}, 1)`})
        })

    }
)

export function reifyWFSLayer (layer: WFSLayer, existingLayer: BaseLayer | null, map: Map) {

    const colMap = getColorStops(layer.fill === "heatmap" ? "jet" : (layer.fill === "greyscale" ? "greys" : layer.fill), 100).reverse()
    
    const vectLayer =  new VectorLayer({
        source: getSource(layer.layer, layer.attribution),
        style: getStyle(layer, colMap),
    })

    return vectLayer
    
}