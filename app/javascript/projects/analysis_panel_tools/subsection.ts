import { Extent } from "ol/extent";
import { BooleanTileGrid, CategoricalTileGrid, NumericTileGrid } from "../modelling/tile_grid";
import { createXYZ } from "ol/tilegrid";
import { getArea } from "ol/sphere";
import { fromExtent } from "ol/geom/Polygon";
import { getColorStops } from "../reify_layer/model_output";


type Color = [number, number, number, number]

export interface ChartData {
    count: Map<any, number>
    colors?: Map<any, Color>
}


export function extentToChartData(colors: Color[] | undefined, model: BooleanTileGrid | NumericTileGrid | CategoricalTileGrid, extent: Extent, fillType: string | undefined): ChartData {

    const tileGrid = createXYZ()
    const outputTileRange = tileGrid.getTileRangeForExtentAndZ(extent, 20)

    const counts = new Map<any, number>()
    const color = new Map<any, [number, number, number, number]>()

    for (let x = outputTileRange.minX; x <= outputTileRange.maxX; x++) {
        for (let y = outputTileRange.minY; y <= outputTileRange.maxY; y++) {

            if (model instanceof CategoricalTileGrid) {

                const area = getArea(fromExtent(tileGrid.getTileCoordExtent([20, x, y]))) / 1000

                const value = model.labels.get(model.get(x, y)) ? model.labels.get(model.get(x, y)) : "No Data"
                const count = counts.get(value) || 0
                counts.set(value, count + area)

                if (colors) {
                    const col_value = colors[model.get(x, y) - 1]
                    color.set(value, col_value ? col_value : [100, 100, 100, 1])
                }

            } else {

                const area = getArea(fromExtent(tileGrid.getTileCoordExtent([20, x, y]))) / 1000
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

            //TODO NumericTileGrid colors

        }
    }

    return { count: counts, colors: color }
} 