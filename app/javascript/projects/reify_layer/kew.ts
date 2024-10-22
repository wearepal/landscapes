import BaseLayer from "ol/layer/Base"
import { KewLayer, KewOption, KewPointLayer } from "../state"
import VectorLayer from "ol/layer/Vector"
import { memoize } from "lodash"
import VectorSource from "ol/source/Vector"
import GeoJSON from "ol/format/GeoJSON"
import { bbox } from "ol/loadingstrategy"
import { Fill, RegularShape, Stroke, Style, Text } from "ol/style"
import { Map, Overlay } from "ol"
import { getColorStops } from "./model_output"
import { findColor } from "../analysis_panel_tools/subsection"

export const KewPointOptions: KewOption[] = [
    {
        value: "carbon",
        label: "Carbon",
    },
    {
        value: "nitrogn",
        label: "Nitrogen",
    },
    {
        value: "ph",
        label: "pH",
        max: 14
    },
    {
        value: "sl_dnst",
        label: "Soil Density"
    },
    {
        value: "dry_mtt",
        label: "Dry Matter"
    },
    {
        value: "sodium",
        label: "Sodium"
    },
    {
        value: "calcium",
        label: "Calcium"
    },
    {
        value: "magnesm",
        label: "Magnesium"
    },
    {
        value: "potassm",
        label: "Potassium"
    },
    {
        value: "sulphat",
        label: "Sulphate"
    },
    {
        value: "phsphrs",
        label: "Phosphorus"
    },
    {
        value: "cndctvt",
        label: "cndctvt"
    },
    {
        value: "ctn_xch",
        label: "ctn_xch"
    },
    {
        value: "sand",
        label: "Sand"
    },
    {
        value: "silt",
        label: "Silt"
    },
    {
        value: "clay",
        label: "Clay"
    },
    {
        value: "avrg_dp",
        label: "Average Depth"
    },
    {
        value: "crbn_st",
        label: "Carbon Stock"
    },
    {
        value: "cn_rati",
        label: "cn_rati"
    },
    {
        value: "np_rati",
        label: "np_rati"
    }
]

function getMinMaxMetric(vectorSource: VectorSource, metricKey: string) {
    const features = vectorSource.getFeatures()

    const metricValues = features
        .map(feature => feature.getProperties()[metricKey])
        .filter(value => value !== undefined && value !== null)

    if (metricValues.length === 0) {
        return { min: null, max: null };
    }

    const min = Math.min(...metricValues);
    const max = Math.max(...metricValues);

    return { min, max };
}

// Collection of functions that reify a KewLayer or KewPointLayer into an OpenLayers layer

const getSource = memoize((location: string) => {
    const source = new VectorSource({
        url: extent => `https://landscapes.wearepal.ai/geoserver/kew/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${location}&outputFormat=application/json&bbox=${extent.join(',')},EPSG:3857&crs=EPSG:3857`,
        format: new GeoJSON({
            extractGeometryName: true
        }),
        strategy: bbox,
        attributions: '&copy; <a href="https://www.kew.org/">Kew</a> Partners',
    })

    return source

})

const getStyle = (layer: KewLayer, zoom: number | undefined) => (
    (feature) => {
        const properties = feature.getProperties()
        let metric
        let dmax = layer.typeOptions.filter(opt => opt.value == layer.metric)[0].max || 100
        layer.periodOptions.filter(opt => opt.selected).forEach(option => {
            metric = properties[[option.value, layer.loc, layer.metric].filter(a => a).join("_")] || metric
        })
        const [min, max] = [0, dmax]
        const color = metric ? `rgba(${255 * (1 - ((metric - min) / (max - min)))}, ${(metric - min) / (max - min) * 255}, 0, 1)` : "rgba(0,0,0,.1)"

        return new Style({
            fill : new Fill({
                color
            }),
            stroke: new Stroke({
                color: `rgba(0,0,0,.5)`,
                width: 1
            }),
            text: new Text({
                text: `${metric ? metric : ""} ${zoom ? (zoom > 21 ? `(${properties.GRID_ID})` : "") : ""}`,
                font: `${zoom ? (zoom > 21 ? 16 : 12) : 12}px Calibri,sans-serif`,
                fill: new Fill({
                    color: metric ? '#fff' : "rgba(0,0,0,.1)"
                }),
                stroke: new Stroke({
                    color: metric ? '#fff' : "rgba(0,0,0,.1)",
                    width: zoom ? (zoom > 10 ? .2 : 0) : 0
                })
            
            })
        })
    }
)

const getPointStyle = (map: Map, layer: KewPointLayer, min: number | null, max: number | null, colMap: any[]) => (
    (feature) => {

        const props = feature.getProperties()
        const metric = props[layer.metric.value] || -99999
        const realWorldSize = 4; 
        const resolution = map.getView().getResolution()! 
        const pixelSize = realWorldSize / resolution;

        let normalizedMetric = 0

        if(min !== null && max !== null) {
            normalizedMetric = (metric - min) / (max - min)
            normalizedMetric = isNaN(normalizedMetric) || metric === -99999 ? 0 : normalizedMetric
        }

        const col = findColor(normalizedMetric, colMap)

        return new Style({
            image: new RegularShape({
                points: 4, 
                radius: pixelSize, 
                angle: Math.PI / 4,
                fill: new Fill({
                    color: `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${metric === -99999 ? 0 : 1})`}
                ),
                stroke: new Stroke({
                    color: 'rgba(0,0,0,1)',
                    width: .3 / resolution
                })
            })
        })
    }
)


export function reifyKewLayer (layer: KewLayer, existingLayer: BaseLayer | null , map: Map) {

    const vectLayer =  new VectorLayer({
        source: getSource(layer.location),
        style: getStyle(layer, map.getView().getZoom())
    })

    return vectLayer

}

export function reifyKewPointLayer(layer: KewPointLayer, existingLayer: BaseLayer | null, map: Map) {

    const vectorSource = getSource(layer.identifier)

    const { min, max } = layer.metric.max ? {min: 0, max: layer.metric.max}  : getMinMaxMetric(vectorSource, layer.metric.value)

    const colMap = getColorStops(layer.fill, 100).reverse()

    layer.min = min ?? 0
    layer.max = max ?? 0

    const v = new VectorLayer({
        source: vectorSource,
        style: getPointStyle(map, layer, min, max, colMap)
    })

    return v

}