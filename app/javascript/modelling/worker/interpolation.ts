import { getMedianCellSize } from "../../projects/modelling/components/cell_area_component"
import { BooleanTileGrid, NumericTileGrid } from "../../projects/modelling/tile_grid"
import { kdTree } from 'kd-tree-javascript'

export type InterpolationType = "NearestNeighbour" | "Bilinear" | "InverseDistanceWeighting" | "RadialBasisFunction"


export function interpolateGrid(input : NumericTileGrid, mask : BooleanTileGrid, type: InterpolationType, maxDist: number, p: number, k: number) : NumericTileGrid {

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

    const tile_length = getMedianCellSize(input).length

    result.iterate((x, y, val) => {
        if(!mask.get(x, y) || input.get(x, y)) return
        switch (type) {
            case "NearestNeighbour":        
                const [n, d] = tree.nearest({x, y}, 1)[0]
                const dist = d * tile_length
                if (maxDist === 0 || dist <  maxDist) result.set(x, y, n.val)
                break
            case "InverseDistanceWeighting":
                const neighbors = tree.nearest({x, y}, k === 0 ? points.length : k)

                let numerator = 0
                let denominator = 0
    
                neighbors.forEach(([neighbor, distance]) => {
                    const adjustedDistance = distance * tile_length;
                    if (adjustedDistance === 0) {
                        // If distance is zero, return the neighbor's value directly
                        result.set(x, y, neighbor.val);
                        return;
                    }else if (maxDist !== 0 && adjustedDistance > maxDist) {
                        return;
                    }

                    const weight = 1 / Math.pow(adjustedDistance, p);
                    numerator += weight * neighbor.val;
                    denominator += weight;
                });

                if (denominator !== 0) {
                    const interpolatedValue = numerator / denominator;
                    result.set(x, y, interpolatedValue);
                }
                break
            default:
                break
        }
    })
    
    
    return result
}