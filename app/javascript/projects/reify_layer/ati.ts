import BaseLayer from "ol/layer/Base"
import { AtiLayer, ColourMapATI } from "../state"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import GeoJSON from "ol/format/GeoJSON"
import { Circle, Fill, RegularShape, Stroke, Style } from "ol/style"
import { bbox } from "ol/loadingstrategy"
import { Map } from "ol"
import Select from "ol/interaction/Select"
import { click } from "ol/events/condition"
import { bboxFromExtent } from "../modelling/bounding_box"

const statusToColor = (status: string, colors: ColourMapATI) => {
    switch (status) {
        case "Ancient tree": 
        case "Lost Ancient tree": 
            return `rgba(${colors.ancient[0]}, ${colors.ancient[1]}, ${colors.ancient[2]}, 1)`
        case "Veteran tree": 
        case "Lost Veteran tree": 
            return `rgba(${colors.veteran[0]}, ${colors.veteran[1]}, ${colors.veteran[2]}, 1)`
        case "Notable tree": 
        case "Lost Notable tree": 
            return `rgba(${colors.notable[0]}, ${colors.notable[1]}, ${colors.notable[2]}, 1)`
        default: 
            return 'rgba(0, 255, 251, 1)'
    }
}

const accessibilityToStroke = (accessibility: string, colors: ColourMapATI) => {
    switch (accessibility) {
        case "Public": return `rgba(${colors.public[0]}, ${colors.public[1]}, ${colors.public[2]}, 1)`
        case "Private": return `rgba(${colors.private[0]}, ${colors.private[1]}, ${colors.private[2]}, 1)`
        default: return 'rgba(200, 200, 200, 1)'
    }
}

const getSource = () => (
    new VectorSource({
        url: extent => `https://landscapes.wearepal.ai/geoserver/nateng/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nateng:ATIData_Public&bbox=${bboxFromExtent(extent)}&outputFormat=application%2Fjson`, 
        attributions: '&copy; <a href="https://ati.woodlandtrust.org.uk/">Woodland Trust ATI</a>',
        format: new GeoJSON(),
        strategy: bbox,
    })
)

const getStyleFunction = (layer: AtiLayer, zoom: number | undefined) => (
    (feature) => {
        const properties = feature.getProperties()
        
        const status = properties.VeteranSta
        const accessibility = properties.PublicAcce
        const lost = (properties.VeteranSta === "Lost Veteran tree" || properties.VeteranSta === "Lost Ancient tree" || properties.VeteranSta === "Lost Notable tree")

        const pointStyle = new Style({
            image: new Circle({
                radius: zoom ? (zoom > 16 ? 10 : 5) : 5,
                fill: new Fill({ 
                    color: statusToColor(status, layer.colors)
                }),
                stroke: new Stroke({ 
                    color: accessibility ? accessibilityToStroke(accessibility.split(" ")[0], layer.colors) : 'rgba(255, 255, 255, 1)',
                    width: 2
                }),
            }),
        })

        const cross = new Style({
            image: new RegularShape({
                stroke: new Stroke({
                    color: 'rgba(255, 0, 0, 1)',
                    width: 3
                }),
                points: 4,
                radius: zoom ? (zoom > 16 ? 10 : 5) : 5,
                radius2: 0,
                angle: Math.PI / 4,
            })
        })

        return !lost ? [pointStyle] : [pointStyle, cross]
    }
)


export function reifyAtiLayer (layer: AtiLayer, existingLayer: BaseLayer | null, map: Map) {

    if (existingLayer instanceof VectorLayer) {
        const source = existingLayer.getSource()
        if (source instanceof VectorSource && source === getSource()) return existingLayer
    }


    const vectLayer =  new VectorLayer({
        source: getSource(),
        style: getStyleFunction(layer, map.getView().getZoom()),
        minZoom: 10,
    })

    const select = new Select({
        condition: click,
        layers: [vectLayer]
    })

    select.on('select', (e) => {
        const selected = e.selected[0]
        if (selected) {
            const url = `https://ati.woodlandtrust.org.uk/tree-search/tree?treeid=${selected.getProperties().Id}`
            window.open(url, '_blank')
        }
    })

    map.addInteraction(select)

    return vectLayer

}