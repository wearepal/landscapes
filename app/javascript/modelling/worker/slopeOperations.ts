import { NeighbourGrid, NumericTileGrid } from "../../projects/modelling/tile_grid"
import { getMedianCellSize } from "../../projects/modelling/components/cell_area_component"

function ZevenbergenThorneSlope(ng: NeighbourGrid, cellSize: number, radians: boolean = false) : number {
    // Calculate partial derivatives
    // dz/dx using east and west neighbors
    const dzdx = (ng.Z6.value - ng.Z4.value) / (2 * cellSize);
    
    // dz/dy using north and south neighbors
    const dzdy = (ng.Z2.value - ng.Z8.value) / (2 * cellSize);

    // Calculate slope in radians
    const slope = Math.atan(Math.sqrt(dzdx * dzdx + dzdy * dzdy));

    // Return slope in degrees
    return radians ? slope : slope * (180 / Math.PI);
}

function HornSlope(ng: NeighbourGrid, cellSize: number, radians: boolean = false): number {

    // Calculate partial derivatives using Horn's method
    // dz/dx using weighted average of three east-west pairs
    const dzdx = ((ng.Z3.value + 2*ng.Z6.value + ng.Z9.value) - (ng.Z1.value + 2*ng.Z4.value + ng.Z7.value)) / (8 * cellSize);
    
    // dz/dy using weighted average of three north-south pairs
    const dzdy = ((ng.Z1.value + 2*ng.Z2.value + ng.Z3.value) - (ng.Z7.value + 2*ng.Z8.value + ng.Z9.value)) / (8 * cellSize);

    // Calculate slope in radians
    const slope = Math.atan(Math.sqrt(dzdx * dzdx + dzdy * dzdy));

    // Return slope in degrees if radians = false
    return radians ? slope : slope * (180 / Math.PI);
}

export function calculateSlope(elevationModel: NumericTileGrid, type: "Horn" | "ZevenbergenThorne", scale: number, rad: boolean = false) : NumericTileGrid {
    const result = new NumericTileGrid(elevationModel.zoom, elevationModel.x, elevationModel.y, elevationModel.width, elevationModel.height)
 
    const singleCellSize = getMedianCellSize(elevationModel).length
    const cellSize = singleCellSize * Math.ceil(scale / singleCellSize) 
    const n_cells = Math.ceil(scale / singleCellSize)

    result.iterate((x, y, value) => {
        const neighbors = elevationModel.getNeighborCoordinates(x, y, n_cells)
        switch (type) {
            case "Horn":
                result.set(x, y, HornSlope(neighbors, cellSize, rad))
                break;
            case "ZevenbergenThorne":
                result.set(x, y, ZevenbergenThorneSlope(neighbors, cellSize, rad))
                break;
            default:
                break;
        }
    })

    return result
}

export function calculateContour()
{
    
    return 0
}

export function calculateSlopeDirection()
{
    return 0
}

export function calculateTWI(elevationModel: NumericTileGrid, type: "Horn" | "ZevenbergenThorne", scale: number ) : NumericTileGrid {
    const result = new NumericTileGrid(elevationModel.zoom, elevationModel.x, elevationModel.y, elevationModel.width, elevationModel.height)
    const singleCellSize = getMedianCellSize(elevationModel).length
    const cellSize = singleCellSize * Math.ceil(scale / singleCellSize) 
    const n_cells = Math.ceil(scale / singleCellSize)

    result.iterate((x, y, value) => {
        const neighbors = elevationModel.getNeighborCoordinates(x, y, n_cells)
        
        // TODO
        const a = 0
        const b = type === "Horn" ? HornSlope(neighbors, cellSize, true) : ZevenbergenThorneSlope(neighbors, cellSize, true)
        
        // TODO: Calc a
        const res = Math.log(a / (Math.tan(b)))

        result.set(x, y, res)
    })

    return result
}