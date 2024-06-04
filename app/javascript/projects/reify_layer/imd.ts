import VectorLayer from "ol/layer/Vector"
import { IMDLayer } from "../state"
import BaseLayer from "ol/layer/Base"
import { memoize } from "lodash"
import VectorSource from "ol/source/Vector"
import { Fill, Stroke, Style, Text } from "ol/style"
import GeoJSON from "ol/format/GeoJSON"
import { bbox } from "ol/loadingstrategy"
import { Map } from "ol"
import { getColorStops } from "./model_output"
import { findColor } from "../analysis_panel_tools/subsection"

interface IMDProperty {
    name: string
    propName: string
    min: number
    max: number
}

export const IMDProperties: IMDProperty[] = [
    {
        name: "IMD - Decile",
        propName: "IMD_Decile",
        min: 10,
        max: 1
    },
    {
        name: "IMD - Rank",
        propName: "IMD_Rank",
        min: 32844,
        max: 1
    },
    {
        name: "Income - Decile",
        propName: "IncDec",
        min: 10,
        max: 1
    },
    {
        name: "Income - Rank",
        propName: "IncRank",
        min: 32844,
        max: 1
    },
    {
        name: "Employment - Decile",
        propName: "EmpDec",
        min: 10,
        max: 1
    },
    {
        name: "Employment - Rank",
        propName: "EmpRank",
        min: 32844,
        max: 1
    },
    {
        name: "Education, Skills and Training - Decile",
        propName: "EduDec",
        min: 10,
        max: 1
    },
    {
        name: "Education, Skills and Training - Rank",
        propName: "EduRank",
        min: 32844,
        max: 1
    },
    {
        name: "Health Deprivation and Disability - Decile",
        propName: "HDDec",
        min: 10,
        max: 1
    },
    {
        name: "Health Deprivation and Disability - Rank",
        propName: "HDDRank",
        min: 32844,
        max: 1
    },
    {
        name: "Crime - Decile",
        propName: "CriDec",
        min: 10,
        max: 1
    },
    {
        name: "Crime - Rank",
        propName: "CriRank",
        min: 32844,
        max: 1
    },
    {
        name: "Barriers to Housing and Services - Decile",
        propName: "BHSDec",
        min: 10,
        max: 1
    },
    {
        name: "Barriers to Housing and Services - Rank",
        propName: "BHSRank",
        min: 32844,
        max: 1
    },
    {
        name: "Living Environment - Decile",
        propName: "EnvDec",
        min: 10,
        max: 1
    },
    {
        name: "Living Environment - Rank",
        propName: "EnvRank",
        min: 32844,
        max: 1
    }
]

export type IMDProp = typeof IMDProperties[number]

const imdSource = memoize(() =>
    new VectorSource({
        url: extent => `https://landscapes.wearepal.ai/geoserver/shapefiles/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=shapefiles:IMD_2019&outputFormat=application/json&bbox=${extent.join(',')},EPSG:3857&crs=EPSG:3857`,
        format: new GeoJSON(),
        strategy: bbox,
        attributions: '&copy; <a href="https://data.cdrc.ac.uk/dataset/index-multiple-deprivation-imd">Consumer Data Research Centre</a>'
    })
)

const styleFn = memoize((colMap : any[], prop : IMDProperty) => 
    (feature) => {

        const val = feature.get(prop.propName)
        const [min, max] = prop.min > prop.max ? [prop.max, prop.min] : [prop.min, prop.max]
        const normalisedValue = prop.min > prop.max ? 1 - (val - min) / (max - min) : (val - min) / (max - min)
        const col = findColor(normalisedValue, colMap)

        return new Style({
            fill: new Fill({ color: `rgba(${col[0]}, ${col[1]}, ${col[2]}, 1)`})
        })
    }
)

export function reifyIMDLayer(layer: IMDLayer, existingLayer: BaseLayer | null, map: Map) {

    const colMap = getColorStops(layer.fill === "heatmap" ? "jet" : (layer.fill === "greyscale" ? "greys" : layer.fill), 100).reverse()

    return new VectorLayer({
        source: imdSource(),
        style: styleFn(colMap, layer.property),
    })
  }
  