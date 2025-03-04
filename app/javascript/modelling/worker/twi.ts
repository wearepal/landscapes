import { NeighbourGrid, NumericTileGrid } from "../../projects/modelling/tile_grid"

function ZevenbergenThorneSlope(ng: NeighbourGrid) : number {
    return 0
}

function HornSlope(ng: NeighbourGrid): number {
    return 0
}

export function calculateSlope(elevationModel: NumericTileGrid, type: "Horn" | "ZevenbergenThorne") : NumericTileGrid {
    const result = new NumericTileGrid(elevationModel.zoom, elevationModel.x, elevationModel.y, elevationModel.width, elevationModel.height)
 
    result.iterate((x, y, value) => {
        const neighbors = elevationModel.getNeighborCoordinates(x, y)
        switch (type) {
            case "Horn":
                result.set(x, y, HornSlope(neighbors))
                break;
            case "ZevenbergenThorne":
                result.set(x, y, ZevenbergenThorneSlope(neighbors))
                break;
            default:
                break;
        }
    })

    return result
}

export function calculateTWI(elevationModel: NumericTileGrid) : NumericTileGrid {
    const result = new NumericTileGrid(elevationModel.zoom, elevationModel.x, elevationModel.y, elevationModel.width, elevationModel.height)
    
    result.iterate((x, y, value) => {

        const neighbors = elevationModel.getNeighborCoordinates(x, y)

    })

    return result
}