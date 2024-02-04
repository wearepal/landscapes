import BaseLayer from "ol/layer/Base"
import { AtiLayer, ColourMapATI } from "../state"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import GeoJSON from "ol/format/GeoJSON"
import { Circle, Fill, Stroke, Style } from "ol/style"
import { bbox } from "ol/loadingstrategy"
import { Map } from "ol"
import Select from "ol/interaction/Select"
import { click } from "ol/events/condition"
import { bboxFromExtent } from "../modelling/bounding_box"

const statusToColor = (status: string, colors: ColourMapATI) => {
    switch (status) {
        case "Ancient tree": return `rgba(${colors.ancient[0]}, ${colors.ancient[1]}, ${colors.ancient[2]}, 1)`
        case "Lost Ancient tree": return `rgba(${colors.lost_ancient[0]}, ${colors.lost_ancient[1]}, ${colors.lost_ancient[2]}, 1)`
        case "Veteran tree": return `rgba(${colors.veteran[0]}, ${colors.veteran[1]}, ${colors.veteran[2]}, 1)`
        case "Lost Veteran tree": return `rgba(${colors.lost_veteran[0]}, ${colors.lost_veteran[1]}, ${colors.lost_veteran[2]}, 1)`
        default: return 'rgba(0, 255, 251, 1)'
    }
}

const accessibilityToStroke = (accessibility: string, colors: ColourMapATI) => {
    switch (accessibility) {
        case "Public": return `rgba(${colors.public[0]}, ${colors.public[1]}, ${colors.public[2]}, 1)`
        case "Private": return `rgba(${colors.private[0]}, ${colors.private[1]}, ${colors.private[2]}, 1)`
        default: return 'rgba(255, 255, 255, 1)'
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
        
        const status = properties.VeteranStatus
        const accessibility = properties.PublicAccessibilityStatus

        const pointStyle = new Style({
            image: new Circle({
                radius: zoom ? (zoom > 10 ? 6 : 3) : 3,
                fill: new Fill({ 
                    color: statusToColor(status, layer.colors)
                }),
                stroke: new Stroke({ 
                    color: accessibility ? accessibilityToStroke(accessibility.split(" ")[0], layer.colors) : 'rgba(255, 255, 255, 1)',
                    width: 2 
                }),
            })
        })

        return [pointStyle]
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
        minZoom: 12,
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