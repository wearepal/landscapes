import BaseLayer from "ol/layer/Base"
import { KewLayer, KewPointLayer } from "../state"
import VectorLayer from "ol/layer/Vector"
import { memoize } from "lodash"
import VectorSource from "ol/source/Vector"
import GeoJSON from "ol/format/GeoJSON"
import { bbox } from "ol/loadingstrategy"
import { Fill, RegularShape, Stroke, Style, Text } from "ol/style"
import { Map, Overlay } from "ol"



const getSource = memoize((location: string) => {
    const source = new VectorSource({
        url: extent => `https://landscapes.wearepal.ai/geoserver/kew/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${location}&outputFormat=application/json&bbox=${extent.join(',')},EPSG:3857&crs=EPSG:3857`,
        format: new GeoJSON({
            extractGeometryName: true
        }),
        strategy: bbox,
        attributions: '&copy; <a href="https://www.kew.org/">Kew</a> Partners',
    })

    console.log(source)

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

const getPointStyle = (map: Map) => (
    (feature) => {

        const props = feature.getProperties()
        const metric = props.crbn_st || -1
        const realWorldSize = 4; 
        const resolution = map.getView().getResolution()! 
        const pixelSize = realWorldSize / resolution;

        return new Style({
            image: new RegularShape({
                points: 4, 
                radius: pixelSize, 
                angle: Math.PI / 4,
                fill: new Fill({
                    color: `rgba(${metric * 2},0,0,${metric === -1 ? 0 : 1 })` 
                }),
                stroke: new Stroke({
                    color: 'rgba(0,0,0,.1)',
                    width: 1
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
    const vectLayer = new VectorLayer({
        source: getSource(layer.identifier),
        style: getPointStyle(map)
    })

    return vectLayer
}