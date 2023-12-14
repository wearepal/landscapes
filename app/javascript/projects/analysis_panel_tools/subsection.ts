import { Extent } from "ol/extent"
import { BooleanTileGrid, CategoricalTileGrid, NumericTileGrid } from "../modelling/tile_grid"
import { createXYZ } from "ol/tilegrid"
import { getArea } from "ol/sphere"
import { fromExtent } from "ol/geom/Polygon"
import { getColorStops } from "../reify_layer/model_output"
import { sum } from "mathjs"

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
    colors?: Map<any, Color>
    numeric_stats?: NumericStats | undefined
}

function findColor(value: number, colorArray: any[]): Color {
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

export function extentToChartData(colors: Color[] | undefined, model: BooleanTileGrid | NumericTileGrid | CategoricalTileGrid, extent: Extent, fillType: string | undefined, histogram_bins: number): ChartData {

    const tileGrid = createXYZ()
    const outputTileRange = tileGrid.getTileRangeForExtentAndZ(extent, model.zoom)

    let counts = new Map<any, number>()
    let color = new Map<any, [number, number, number, number]>()
    let numeric_stats: NumericStats | undefined

    for (let x = outputTileRange.minX; x <= outputTileRange.maxX; x++) {
        for (let y = outputTileRange.minY; y <= outputTileRange.maxY; y++) {

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

        if(mapEntries.length === 0) return {count: new Map(), colors: new Map(), numeric_stats: undefined}

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

    return { count: counts, colors: color, numeric_stats }
} 