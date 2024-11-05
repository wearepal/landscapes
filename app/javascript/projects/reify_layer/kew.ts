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
import { numericDataSocket } from "../modelling/socket_types"

export const KewPointOptions: KewOption[] = [
    {
        value: "carbon",
        label: "Carbon",
        socket: numericDataSocket
    },
    {
        value: "nitrogn",
        label: "Nitrogen",
        socket: numericDataSocket
    },
    {
        value: "ph",
        label: "pH",
        max: 14,
        socket: numericDataSocket
    },
    {
        value: "sl_dnst",
        label: "Soil Density",
        socket: numericDataSocket
    },
    {
        value: "dry_mtt",
        label: "Dry Matter",
        socket: numericDataSocket
    },
    {
        value: "sodium",
        label: "Sodium",
        socket: numericDataSocket
    },
    {
        value: "calcium",
        label: "Calcium",
        socket: numericDataSocket
    },
    {
        value: "magnesm",
        label: "Magnesium",
        socket: numericDataSocket
    },
    {
        value: "potassm",
        label: "Potassium",
        socket: numericDataSocket
    },
    {
        value: "sulphat",
        label: "Sulphate",
        socket: numericDataSocket
    },
    {
        value: "phsphrs",
        label: "Phosphorus",
        socket: numericDataSocket
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
        label: "Sand",
        socket: numericDataSocket
    },
    {
        value: "silt",
        label: "Silt",
        socket: numericDataSocket
    },
    {
        value: "clay",
        label: "Clay",
        socket: numericDataSocket
    },
    {
        value: "avrg_dp",
        label: "Average Depth",
        socket: numericDataSocket
    },
    {
        value: "crbn_st",
        label: "Carbon Stock",
        socket: numericDataSocket
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
                    color: `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${(metric === -99999) ? 0 : 1})`}
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

    const popupContainer = document.getElementById("popup")
    const popupCloser = document.getElementById("popup-closer")
    const popupContent = document.getElementById("popup-content")

    const overlay = new Overlay({
        element: popupContainer!,
        autoPan: true,
        autoPanAnimation: { duration: 450 },
    })

    popupCloser!.onclick = () => {
        overlay.setPosition(undefined)
        popupCloser?.blur()
        return false
    }

    map.addOverlay(overlay)

    const handleClick = (event) => {
        map.forEachFeatureAtPixel(event.pixel, (feature, clickedLayer) => {
            if (feature && clickedLayer === v) {
                const properties = feature.getProperties()

                const plotId = properties.plot_id
                popupContainer!.style.display = "block"
                popupContent!.innerHTML = `
                    <div class="border-top bg-light border-bottom text-center fw-bold mb-3">
                        Plot ID: ${plotId}
                    </div>
                    
                    <div class="row text-center">
                        <div class="col-6"><strong>Season:</strong> ${properties?.season || 'N/A'}</div>
                        <div class="col-6"><strong>Date:</strong> ${properties?.date || 'N/A'}</div>
                    </div>

                    <div class="row text-center">
                        <div class="col-6"><strong>Carbon Stock:</strong> ${(properties?.crbn_st as number).toFixed(3) || 'N/A'} t/ha </div>
                        <div class="col-6"><strong>pH:</strong> ${properties?.ph || 'N/A'} ph </div>
                    </div>

                    <div class="row text-center">
                        <div class="col-6"><strong>Soil Density:</strong> ${(properties?.sl_dnst) || 'N/A'}</div>
                        <div class="col-6"><strong>Dry Matter</strong> ${properties?.dry_mtt || 'N/A'}</div>
                    </div>

                    <div class="row text-center">
                        <div class="col-6"><strong>Carbon:</strong> ${(properties?.carbon) || 'N/A'}</div>
                        <div class="col-6"><strong>Magnesium</strong> ${properties?.magnesm || 'N/A'}</div>
                    </div>

                    <div class="row text-center">
                        <div class="col-6"><strong>Potassium:</strong> ${(properties?.potassm) || 'N/A'}</div>
                        <div class="col-6"><strong>Sodium</strong> ${properties?.sodium || 'N/A'}</div>
                    </div>

                    <div class="row text-center">
                        <div class="col-6"><strong>Phosphorus</strong> ${(properties?.phsphrs) || 'N/A'}</div>
                        <div class="col-6"><strong>Sulphate</strong> ${properties?.sulphat || 'N/A'}</div>
                    </div>


                    <div class="row text-center">
                        <div class="col-6"><strong>Calcium</strong> ${(properties?.calcium) || 'N/A'}</div>
                        <div class="col-6"><strong>Sand</strong> ${properties?.sand || 'N/A'}</div>
                    </div>

                    <div class="row text-center">
                        <div class="col-6"><strong>Silt</strong> ${(properties?.silt) || 'N/A'}</div>
                        <div class="col-6"><strong>Clay</strong> ${properties?.clay || 'N/A'}</div>
                    </div>


                `;
            

                overlay.setPosition(event.coordinate)
            }
        })
    }

    map.on('click', handleClick)

    return v

}