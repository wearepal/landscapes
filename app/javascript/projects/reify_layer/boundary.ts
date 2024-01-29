import BaseLayer from "ol/layer/Base"
import { BoundaryLayer } from "../state"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import GeoJSON from "ol/format/GeoJSON"
import { bbox } from "ol/loadingstrategy"
import { Fill, Stroke, Style } from "ol/style"
import { memoize } from "lodash"
import { Map as m } from "ol"
import {Text} from "ol/style"


const boundaryColourMap = new Map<number, [number, number, number, number]>()

const getSource = memoize((id: string) => {

    const source = new VectorSource({
        url: extent => `https://landscapes.wearepal.ai/geoserver/shapefiles/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${id}&outputFormat=application/json&bbox=${extent.join(',')},EPSG:3857&crs=EPSG:3857`,
        format: new GeoJSON({
            extractGeometryName: true
        }),
        strategy: bbox,
        attributions: "&copy; <a href='https://www.ordnancesurvey.co.uk/'>Ordnance Survey</a>"
    })

    return source
})

const getStyle = (layer: BoundaryLayer, zoom: number | undefined) => (
        (feature) => {
            const properties = feature.getProperties()
            const col = boundaryColourMap.get(properties.geometry.ol_uid) || [Math.random() * 255, Math.random() * 255, Math.random() * 255, 1]
            boundaryColourMap.set(properties.geometry.ol_uid, col)
            return new Style({
                fill : new Fill({
                    color: `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${col[3]})`
                }),
                stroke: new Stroke({
                    color: `rgba(0, 0, 122, 1)`,
                    width: 2
                }),
                text: new Text({
                    text: properties.Name,
                    font: '16px Calibri,sans-serif',
                    fill: new Fill({
                        color: '#fff'
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: .5
                    })
                })
            })
        }
)

export function reifyBoundaryLayer (layer: BoundaryLayer, existingLayer: BaseLayer | null, map: m) {

    const vectLayer =  new VectorLayer({
        source: getSource(layer.identifier),
        style: getStyle(layer, map.getView().getZoom())
    })

    return vectLayer

}