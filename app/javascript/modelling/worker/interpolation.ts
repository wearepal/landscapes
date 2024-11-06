import { getMedianCellSize } from "../../projects/modelling/components/cell_area_component"
import { BooleanTileGrid, NumericTileGrid } from "../../projects/modelling/tile_grid"
import { kdTree } from 'kd-tree-javascript'

export type InterpolationType = "NearestNeighbour" | "Bilinear"


export function interpolateGrid(input : NumericTileGrid, mask : BooleanTileGrid, type: InterpolationType, maxDist: number) : NumericTileGrid {

    const result = new NumericTileGrid(input.zoom, input.x, input.y, input.width, input.height)

    const points: {x: number, y: number, val: number}[] = []

    input.iterate((x, y) => {
        const val = input.get(x, y)
        if(isNaN(val)) return
        points.push({x, y, val: input.get(x, y)})
    })

    if (points.length === 0) return result

    const tree = new kdTree(
        points,
        (a, b) => Math.sqrt(
          Math.pow(a.x - b.x, 2) +
          Math.pow(a.y - b.y, 2)
        ),
        ['x', 'y', 'val']
    )

    const tileSize = getMedianCellSize(input).length

    result.iterate((x, y) => {
        switch (type) {
            case "NearestNeighbour":        
                const nearest = tree.nearest({x, y}, 1)[0]
                const dist = nearest[1] * tileSize
                if (maxDist === 0 || dist <  maxDist) result.set(x, y, nearest[0].val)
                break
            case "Bilinear":
                // WIP
                break
            default:
                break
        }
    })
    
    
    return result
}