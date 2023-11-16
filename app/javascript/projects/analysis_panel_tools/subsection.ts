import { Extent } from "ol/extent";
import { BooleanTileGrid, CategoricalTileGrid, NumericTileGrid } from "../modelling/tile_grid";
import { createXYZ } from "ol/tilegrid";
import { getArea } from "ol/sphere";
import { fromExtent } from "ol/geom/Polygon";
import { getColorStops } from "../reify_layer/model_output";


type Color = [number, number, number, number]


// TODO: add median 
export interface NumericStats {
    min: number,
    max: number,
    range: number,
    mean: number,
    mode: number,
    step: number
}

export interface ChartData {
    count: Map<any, number>
    colors?: Map<any, Color>
    numeric_stats?: NumericStats | undefined
}

export function extentToChartData(colors: Color[] | undefined, model: BooleanTileGrid | NumericTileGrid | CategoricalTileGrid, extent: Extent, fillType: string | undefined): ChartData {

    const tileGrid = createXYZ()
    const outputTileRange = tileGrid.getTileRangeForExtentAndZ(extent, model.zoom)

    let counts = new Map<any, number>()
    let color = new Map<any, [number, number, number, number]>()
    let numeric_stats: NumericStats | undefined

    for (let x = outputTileRange.minX; x <= outputTileRange.maxX; x++) {
        for (let y = outputTileRange.minY; y <= outputTileRange.maxY; y++) {

            if (model instanceof CategoricalTileGrid) {

                const area = getArea(fromExtent(tileGrid.getTileCoordExtent([20, x, y]))) / 1000000

                const value = model.labels.get(model.get(x, y)) ? model.labels.get(model.get(x, y)) : "No Data"
                const count = counts.get(value) || 0
                counts.set(value, count + area)

                if (colors) {
                    const col_value = colors[model.get(x, y) - 1]
                    color.set(value, col_value ? col_value : [100, 100, 100, 1])
                }

            } else {

                const area = model instanceof NumericTileGrid ? 1 : getArea(fromExtent(tileGrid.getTileCoordExtent([20, x, y]))) / 1000000
                const value = model.get(x, y)


                const count = counts.get(value) || 0

                counts.set(value, count + area)
            }
        }
    }

    if (!(model instanceof CategoricalTileGrid)) {
        if (model instanceof BooleanTileGrid) {
            if (fillType) {
                const fillMap = getColorStops((fillType == "greyscale" ? "greys" : (fillType === "heatmap" ? "jet" : fillType)), 20)

                color.set(false, fillMap[fillMap.length - 1])
                color.set(true, fillMap[1])
            } else {
                color.set(true, [0, 0, 0, 1])
                color.set(false, [255, 255, 255, 1])
            }
        } else {

            let mapEntries: [number, number][] = Array.from(counts.entries())
            mapEntries = mapEntries.sort((a, b) => a[0] - b[0])

            const bins = 10
            const min = mapEntries[0][0]
            const max = mapEntries[mapEntries.length - 1][0]
            const range = max - min
            const step = range / bins
            counts = new Map()
            const fillMap = fillType ? getColorStops((fillType == "greyscale" ? "greys" : (fillType === "heatmap" ? "jet" : fillType)), bins * 2).reverse() : undefined

            for (let i = 0; i < bins; i++) {

                const [l, h] = [min + (i * step), min + (i + 1) * step]
                counts.set(l, 0)

                //TODO make this match map heatmap
                if (fillMap) color.set(l, fillMap[i * 2])

                for (let x = 0; x < mapEntries.length; x++) {
                    const [k, v] = mapEntries[x]
                    const count = counts.get(l) ? counts.get(l) : 0
                    if (k >= l && k <= h) counts.set(l, count as number + v)
                }
            }

            numeric_stats = {
                min,
                max,
                range,
                mean: min + (range / 2),
                mode: mapEntries.reduce((max, current) => {
                    return current[1] > max[1] ? current : max
                }, mapEntries[0])[0],
                step

            }



        }
    }

    return { count: counts, colors: color, numeric_stats }
} 