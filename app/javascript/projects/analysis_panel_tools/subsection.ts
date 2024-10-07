import { Extent } from "ol/extent"
import { BooleanTileGrid, CategoricalTileGrid, NumericTileGrid } from "../modelling/tile_grid"
import { createXYZ } from "ol/tilegrid"
import { getArea } from "ol/sphere"
import { fromExtent } from "ol/geom/Polygon"
import { getColorStops } from "../reify_layer/model_output"
import { re, sum } from "mathjs"
import { Geometry } from "ol/geom"

type Color = [number, number, number, number]

export interface NumericStats {
    sum: number
    min: number,
    max: number,
    range: number,
    mean: number,
    mode: number,
    step: number,
    median: number
}

export interface ChartData {
    count: Map<any, number>
    colors: Map<any, Color>
    numeric_stats?: NumericStats | undefined
    inputColors: Color[] | undefined
    inputFillType: string | undefined
    inputHistogramBins: number
}

export function findColor(value: number, colorArray: any[]): Color {
    var index = Math.floor(value * (colorArray.length / 2))
    index = Math.min(index, colorArray.length / 2 - 1)
    var alpha = colorArray[index * 2]
    return alpha
}

function medianFromMap(arr: [number, number][], total: number): number | undefined {
    let idx = total / 2;

    if (idx % 1 === 0) {
        for (let i = 0; i < arr.length; i++) {
            const [key, value] = arr[i];
            idx -= value;
            if (idx <= 0) return key;
        }
    } else {
        let [lower, upper] = [Math.floor(idx), Math.ceil(idx)];

        for (let i = 0; i < arr.length; i++) {
            const [key, value] = arr[i];
            lower -= value;
            upper -= value;
            if (lower <= 0) {
                if (upper <= 0) return key;
                else return (key + arr[i + 1][0]) / 2;
            }
        }
    }

    return undefined

}

let currentExtent: Extent = [0, 0, 0, 0]
let currentShape: Geometry | null = null
const chartDataCache = new Map<BooleanTileGrid | NumericTileGrid | CategoricalTileGrid, ChartData>()

export function extentToChartDataCached(colors: Color[] | undefined, model: BooleanTileGrid | NumericTileGrid | CategoricalTileGrid, extent: Extent, fillType: string | undefined, histogram_bins: number, shape: Geometry | null): ChartData {

    if(extent !== currentExtent || shape !== currentShape) {
        // if the extent has changed, clear the cache
        chartDataCache.clear()
        currentExtent = extent
        currentShape = shape
    }

    if(chartDataCache.has(model)) {
        const chartData = chartDataCache.get(model) as ChartData

        if(chartData.inputHistogramBins !== histogram_bins && model instanceof NumericTileGrid) {

            // if the histogram bins have changed, recalculate the chart data to reflect the new bins

            const newChartData = extentToChartData(colors, model, extent, fillType, histogram_bins, shape)
            chartDataCache.set(model, newChartData)

            return newChartData

        }else if(chartData.inputColors !== colors || chartData.inputFillType !== fillType ){

            // if the colors or fill type have changed, update the color map

            const newChartData = modifyChartDataColours(colors, fillType, histogram_bins, chartData, model)
            chartDataCache.set(model, newChartData)

            return newChartData

        }else{

            return chartData

        }
    }else{
        const chartData = extentToChartData(colors, model, extent, fillType, histogram_bins, shape)
        chartDataCache.set(model, chartData)
        return chartData
    }
}

function modifyChartDataColours(colors: Color[] | undefined, fillType: string | undefined, histogram_bins: number, chartData: ChartData, model: BooleanTileGrid | NumericTileGrid | CategoricalTileGrid): ChartData {


    if(fillType !== chartData.inputFillType && model instanceof NumericTileGrid && fillType){
    
        const newColorMap = new Map<any, Color>()
        const fillMap = getColorStops((fillType == "greyscale" ? "greys" : (fillType === "heatmap" ? "jet" : fillType)), 40).reverse()
        const [ds_min, ds_max] = [model.getStats().min, model.getStats().max]
    
        chartData.count.forEach((value, key) => {
            let val = key + (chartData.numeric_stats?.step! / 2)
            val = (val - ds_min) / (ds_max - ds_min)
            newColorMap.set(key, findColor(val, fillMap))
        })
    
        chartData.colors = newColorMap
        chartData.inputFillType = fillType

        return chartData

    }

    if(colors !== chartData.inputColors && colors && !(model instanceof NumericTileGrid)){

        const newColorMap = new Map<any, Color>()
        chartData.colors?.forEach((value, key) => {
            if(model instanceof CategoricalTileGrid){
                const labels = model.labels
                const newKey = Array.from(labels.keys()).find(k => labels.get(k) === key)
                newColorMap.set(key, newKey ? colors[newKey - 1] : [100, 100, 100, 1]) 
            }else{
                const col_value = colors[+key]
                newColorMap.set(key, col_value ?? [100, 100, 100, 1])
            }
        })

        chartData.colors = newColorMap

        chartData.inputColors = colors

        return chartData

    }

    return chartData

}

export function extentToChartData(colors: Color[] | undefined, model: BooleanTileGrid | NumericTileGrid | CategoricalTileGrid, extent: Extent, fillType: string | undefined, histogram_bins: number, shape: Geometry | null): ChartData {

    const tileGrid = createXYZ()
    const outputTileRange = tileGrid.getTileRangeForExtentAndZ(extent, model.zoom)

    let counts = new Map<any, number>()
    let color = new Map<any, [number, number, number, number]>()
    let numeric_stats: NumericStats | undefined

    for (let x = outputTileRange.minX; x <= outputTileRange.maxX; x++) {
        for (let y = outputTileRange.minY; y <= outputTileRange.maxY; y++) {

            if (shape && !shape.intersectsExtent(tileGrid.getTileCoordExtent([model.zoom, x, y]))) continue

            if (model instanceof CategoricalTileGrid) {

                const area = getArea(fromExtent(tileGrid.getTileCoordExtent([model.zoom, x, y]))) / 1000000

                const value = model.labels.get(model.get(x, y)) ? model.labels.get(model.get(x, y)) : "No Data"
                const count = counts.get(value) || 0
                counts.set(value, count + area)


                if (colors) {
                    const col_value = colors[model.get(x, y) - 1]
                    color.set(value, col_value ? col_value : [100, 100, 100, 1])
                }

            } else {

                const area = model instanceof NumericTileGrid ? 1 : getArea(fromExtent(tileGrid.getTileCoordExtent([model.zoom, x, y]))) / 1000000
                const value = model.get(x, y)

                const count = counts.get(value) || 0

                counts.set(value, count + area)

                if (colors && model instanceof BooleanTileGrid) {
                    const col_value = colors[value ? 1 : 0]
                    color.set(value, col_value ? col_value : [100, 100, 100, 1])
                }
            }
        }
    }

    if (model instanceof NumericTileGrid) {

        let mapEntries: [number, number][] = Array.from(counts.entries()).filter(([key, value]) => !isNaN(key) && !isNaN(value))

        if(mapEntries.length === 0) return {
            count: new Map(), 
            colors: new Map(), 
            numeric_stats: undefined, 
            inputColors: colors, 
            inputFillType: fillType, 
            inputHistogramBins: histogram_bins
        }

        mapEntries = mapEntries.sort((a, b) => a[0] - b[0])

        const bins = histogram_bins

        const min = mapEntries[0][0]
        const max = mapEntries[mapEntries.length - 1][0]
        const range = max - min
        const step = range / bins

        const _sum = sum(mapEntries.map((x) => x[1] * x[0]))
        const total_entries = mapEntries.reduce((acc, cur) => acc + cur[1], 0)

        const _mean = _sum / total_entries
        const _median = medianFromMap(mapEntries, total_entries)

        const mode = mapEntries.reduce((max, current) => {
            return current[1] > max[1] ? current : max
        }, mapEntries[0])[0]

        counts = new Map()
        const fillMap = fillType ? getColorStops((fillType == "greyscale" ? "greys" : (fillType === "heatmap" ? "jet" : fillType)), 40).reverse() : undefined
        const [ds_min, ds_max] = [model.getStats().min, model.getStats().max]

        for (let i = 0; i < bins; i++) {

            const [l, h] = [min + (i * step), min + (i + 1) * step]
            counts.set(l, 0)

            if (fillMap) {
                let val = l + (step / 2)
                val = (val - ds_min) / (ds_max - ds_min)
                color.set(l, findColor(val, fillMap))
            }

            for (let x = 0; x < mapEntries.length; x++) {
                const [k, v] = mapEntries[x]
                const count = counts.get(l) ? counts.get(l) : 0
                if (k >= l && k <= h) counts.set(l, count as number + v)
            }
        }

        numeric_stats = {
            sum: _sum,
            min,
            max,
            median: _median || 0,
            range,
            mean: _mean,
            mode,
            step

        }

    }

    return { 
        count: counts, 
        colors: color, 
        numeric_stats, 
        inputColors: colors, 
        inputFillType: fillType, 
        inputHistogramBins: histogram_bins
    }
} 