import { Extent } from "ol/extent";
import { BooleanTileGrid, CategoricalTileGrid, NumericTileGrid } from "../modelling/tile_grid";
import { createXYZ } from "ol/tilegrid";
import { getArea } from "ol/sphere";
import { Layer } from "../state";
import { fromExtent } from "ol/geom/Polygon";


export interface ChartData {
    count: Map<any, number>
    colors?: Map<any, [number, number, number, number]>
}


export function extentToChartData(colors: [number, number, number, number][] | undefined, model: BooleanTileGrid | NumericTileGrid | CategoricalTileGrid, extent: Extent): ChartData {

    const tileGrid = createXYZ()
    const outputTileRange = tileGrid.getTileRangeForExtentAndZ(extent, 20)

    const counts = new Map<any, number>()
    const color = new Map<any, [number, number, number, number]>()

    for (let x = outputTileRange.minX; x <= outputTileRange.maxX; x++) {
        for (let y = outputTileRange.minY; y <= outputTileRange.maxY; y++) {

            if (model instanceof CategoricalTileGrid) {

                const area = getArea(fromExtent(tileGrid.getTileCoordExtent([20, x, y])))

                const value = model.labels.get(model.get(x, y)) ? model.labels.get(model.get(x, y)) : "No Data"
                const count = counts.get(value) || 0
                counts.set(value, count + area)

                if (colors) {
                    const col_value = colors[model.get(x, y) - 1]
                    color.set(value, col_value ? col_value : [100, 100, 100, 1])
                }

            } else {
                const value = model.get(x, y)
                const count = counts.get(value) || 0
                counts.set(value, count + 1)
            }
        }
    }

    return { count: counts, colors: color }
} 