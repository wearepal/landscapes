import { Extent } from "ol/extent"
import { BooleanTileGrid, CategoricalTileGrid, NumericTileGrid } from "../modelling/tile_grid"
import { createXYZ } from "ol/tilegrid"
import { getArea } from "ol/sphere"
import { fromExtent } from "ol/geom/Polygon"
import { getColorStops } from "../reify_layer/model_output"
import { re, sum } from "mathjs"
import { getMedianCellSize } from "../modelling/components/cell_area_component"

type Color = [number, number, number, number]

export interface NumericStats {
    sum: number
    min: number,
    max: number,
    range: number,
    mean: number,
    mode: number,
    step: number,
    median: number,
    stdDevSum: number,
    stdDevMean: number
}

export interface ChartData {
    count: Map<any, number>
    colors: Map<any, Color>
    numeric_stats?: NumericStats | undefined
    full_numeric_stats?: NumericStats | undefined
    inputColors: Color[] | undefined
    inputFillType: string | undefined
    inputHistogramBins: number
    customBounds?: [number, number]
}

export function findColor(value: number, colorArray: any[]): Color {
    var index = Math.floor(value * (colorArray.length / 2))
    index = Math.min(index, colorArray.length / 2 - 1)
    var alpha = colorArray[index * 2]
    return alpha
}

function unitsAdjustmentFactor(unit: string | undefined, grid: NumericTileGrid): number {
    const area = getMedianCellSize(grid).area
    if (unit === "m²") return area / 1
    if (unit === "ha") return area / 10000
    if (unit === "km²") return area / (1000 ** 2) 
    return 1
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
const chartDataCache = new Map<BooleanTileGrid | NumericTileGrid | CategoricalTileGrid, ChartData>()

export function extentToChartDataCached(colors: Color[] | undefined, model: BooleanTileGrid | NumericTileGrid | CategoricalTileGrid, extent: Extent, fillType: string | undefined, histogram_bins: number, customBounds: [number, number]): ChartData {

    // Force recalculation if custom bounds have changed
    if(extent !== currentExtent) {
        // if the extent has changed, clear the cache
        chartDataCache.clear();
        currentExtent = extent;
    }

    if(chartDataCache.has(model)) {
        const chartData = chartDataCache.get(model) as ChartData;

        // Check if custom bounds have changed
        const storedBounds = chartData.customBounds || [NaN, NaN];
        const boundsChanged = JSON.stringify(storedBounds) !== JSON.stringify(customBounds);
        
        if((chartData.inputHistogramBins !== histogram_bins && model instanceof NumericTileGrid) || 
           (model instanceof NumericTileGrid && boundsChanged)) {

            const newChartData = extentToChartData(colors, model, extent, fillType, histogram_bins, customBounds);
            // Store the custom bounds for future comparison
            newChartData.customBounds = customBounds;
            chartDataCache.set(model, newChartData);

            return newChartData;

        }else if(chartData.inputColors !== colors || chartData.inputFillType !== fillType ){

            // if the colors or fill type have changed, update the color map

            const newChartData = modifyChartDataColours(colors, fillType, histogram_bins, chartData, model, customBounds);
            // Store the custom bounds for future comparison
            newChartData.customBounds = customBounds;
            chartDataCache.set(model, newChartData);

            return newChartData;

        }else{
            // Even if nothing changes, update stored bounds
            if (model instanceof NumericTileGrid) {
                chartData.customBounds = customBounds;
            }
            return chartData;
        }
    }else{
        const chartData = extentToChartData(colors, model, extent, fillType, histogram_bins, customBounds);
        // Store the custom bounds for future comparison
        chartData.customBounds = customBounds;
        chartDataCache.set(model, chartData);
        return chartData;
    }
}

function modifyChartDataColours(colors: Color[] | undefined, fillType: string | undefined, histogram_bins: number, chartData: ChartData, model: BooleanTileGrid | NumericTileGrid | CategoricalTileGrid, customBounds: [number, number]): ChartData {


    if(fillType !== chartData.inputFillType && model instanceof NumericTileGrid && fillType){
    
        const newColorMap = new Map<any, Color>()
        const fillMap = getColorStops((fillType == "greyscale" ? "greys" : (fillType === "heatmap" ? "jet" : fillType)), 40).reverse()
        const hasCustomBounds = !isNaN(customBounds[0]) && !isNaN(customBounds[1]) && customBounds[0] < customBounds[1]
        const [ds_min, ds_max] = hasCustomBounds ? customBounds : [model.getStats().min, model.getStats().max]
    
        chartData.count.forEach((value, key) => {
            let val = key + (chartData.numeric_stats?.step! / 2)
            val = (val - ds_min) / (ds_max - ds_min)
            newColorMap.set(key, findColor(val, fillMap))
        })
    
        // Create a new chartData object instead of modifying the existing one
        return {
            ...chartData,
            colors: newColorMap,
            inputFillType: fillType
        };
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

        // Create a new chartData object instead of modifying the existing one
        return {
            ...chartData,
            colors: newColorMap,
            inputColors: colors
        };
    }

    return chartData

}

export function extentToChartData(colors: Color[] | undefined, model: BooleanTileGrid | NumericTileGrid | CategoricalTileGrid, extent: Extent, fillType: string | undefined, histogram_bins: number, customBounds: [number, number]): ChartData {

    const tileGrid = createXYZ()
    const outputTileRange = tileGrid.getTileRangeForExtentAndZ(extent, model.zoom)

    let stdDevSum = 0
    let stdDevMean = 0
    let n = 0

    let counts = new Map<any, number>()
    let color = new Map<any, [number, number, number, number]>()
    let numeric_stats: NumericStats | undefined
    let full_numeric_stats: NumericStats | undefined
    const cellSize = getMedianCellSize(model).area
    const af = model instanceof NumericTileGrid ? unitsAdjustmentFactor(model.properties.area, model) : 1
    
    for (let x = outputTileRange.minX; x <= outputTileRange.maxX; x++) {
        for (let y = outputTileRange.minY; y <= outputTileRange.maxY; y++) {

            if (model instanceof CategoricalTileGrid) {


                const value = model.labels.get(model.get(x, y)) ? model.labels.get(model.get(x, y)) : "No Data"
                const count = counts.get(value) || 0
                counts.set(value, count + (cellSize / (1000 ** 2)))


                if (colors) {
                    const col_value = colors[model.get(x, y) - 1]
                    color.set(value, col_value ? col_value : [100, 100, 100, 1])
                }

            } else {

                const value = model.get(x, y)

                if (model instanceof NumericTileGrid && typeof value === "number" && isFinite(value)) {
                    stdDevSum += (value * af) ** 2
                    n++
                }

                const count = counts.get(value) || 0

                counts.set(value, count + (model instanceof BooleanTileGrid ? (cellSize / (1000 ** 2)) : 1))

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
            full_numeric_stats: undefined,
            inputColors: colors, 
            inputFillType: fillType, 
            inputHistogramBins: histogram_bins
        }

        mapEntries = mapEntries.sort((a, b) => a[0] - b[0])

        const bins = histogram_bins
        
        // Calculate statistics for the full dataset before applying custom bounds
        const calculatedMin = mapEntries[0][0]
        const calculatedMax = mapEntries[mapEntries.length - 1][0]
        const calculatedRange = calculatedMax - calculatedMin
        const calculatedStep = calculatedRange / bins
        
        let fullDataSum = sum(mapEntries.map((x) => x[1] * x[0]))
        const fullDataEntries = mapEntries.reduce((acc, cur) => acc + cur[1], 0)
        
        const fullDataMean = fullDataSum / fullDataEntries
        const fullDataMedian = medianFromMap(mapEntries, fullDataEntries)
        
        const fullDataMode = mapEntries.reduce((max, current) => {
            return current[1] > max[1] ? current : max
        }, mapEntries[0])[0]
        
        // Adjust sum based on area for full dataset
        const adjustedFullDataSum = fullDataSum * unitsAdjustmentFactor(model.properties.area, model)
        
        // Store full dataset statistics
        full_numeric_stats = {
            sum: adjustedFullDataSum,
            min: calculatedMin,
            max: calculatedMax,
            median: fullDataMedian || 0,
            range: calculatedRange,
            mean: fullDataMean,
            mode: fullDataMode,
            step: calculatedStep,
            stdDevSum: Math.sqrt(stdDevSum),
            stdDevMean: n > 0 ? Math.sqrt(stdDevSum) / Math.sqrt(n) : 0
        }

        // Check for valid custom bounds
        const hasCustomBounds = !isNaN(customBounds[0]) && !isNaN(customBounds[1]) && customBounds[0] < customBounds[1]
        
        // Use custom bounds if provided, otherwise use calculated values
        const min = hasCustomBounds ? customBounds[0] : calculatedMin
        const max = hasCustomBounds ? customBounds[1] : calculatedMax
        
        // Filter data to only include values within the custom bounds if they are provided
        let filteredMapEntries = mapEntries;
        if (hasCustomBounds) {
            filteredMapEntries = mapEntries.filter(([key, _]) => key >= min && key <= max)
            
            // Return empty data if all values were filtered out
            if(filteredMapEntries.length === 0) return {
                count: new Map(), 
                colors: new Map(), 
                numeric_stats: undefined,
                full_numeric_stats: full_numeric_stats,
                inputColors: colors, 
                inputFillType: fillType, 
                inputHistogramBins: histogram_bins
            }
        }
        
        const range = max - min
        const step = range / bins

        let _sum = sum(filteredMapEntries.map((x) => x[1] * x[0]))
        const total_entries = filteredMapEntries.reduce((acc, cur) => acc + cur[1], 0)

        const _mean = _sum / total_entries
        const _median = medianFromMap(filteredMapEntries, total_entries)

        const mode = filteredMapEntries.reduce((max, current) => {
            return current[1] > max[1] ? current : max
        }, filteredMapEntries[0])[0]

        // adjust the sum based on the area
        _sum = _sum * unitsAdjustmentFactor(model.properties.area, model)

        counts = new Map()
        const fillMap = fillType ? getColorStops((fillType == "greyscale" ? "greys" : (fillType === "heatmap" ? "jet" : fillType)), 40).reverse() : undefined
        const [ds_min, ds_max] = hasCustomBounds ? [min, max] : [model.getStats().min, model.getStats().max]

        for (let i = 0; i < bins; i++) {

            const [l, h] = [min + (i * step), min + (i + 1) * step]
            counts.set(l, 0)

            if (fillMap) {
                let val = l + (step / 2)
                val = (val - ds_min) / (ds_max - ds_min)
                color.set(l, findColor(val, fillMap))
            }

            for (let x = 0; x < filteredMapEntries.length; x++) {
                const [k, v] = filteredMapEntries[x]
                const count = counts.get(l) ? counts.get(l) : 0
                if (k >= l && k <= h) counts.set(l, count as number + v)
            }
        }

        counts.forEach((value, key) => {
            counts.set(key, ((value as number) * cellSize) / (1000 ** 2)) // convert from n cells to km²
        })

        numeric_stats = {
            sum: _sum,
            min,
            max,
            median: _median || 0,
            range,
            mean: _mean,
            mode,
            step,
            stdDevSum: Math.sqrt(stdDevSum),
            stdDevMean: Math.sqrt(stdDevSum) / Math.sqrt(n)
        }
    }

    // Prepare the return value with proper conditional logic
    const returnValue: ChartData = {
        count: counts, 
        colors: color, 
        numeric_stats, 
        inputColors: colors, 
        inputFillType: fillType, 
        inputHistogramBins: histogram_bins
    };

    // Only add full_numeric_stats if we're dealing with a NumericTileGrid
    if (model instanceof NumericTileGrid && full_numeric_stats) {
        returnValue.full_numeric_stats = full_numeric_stats;
    }

    return returnValue;
} 