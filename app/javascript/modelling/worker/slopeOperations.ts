import { NeighbourGrid, NumericTileGrid } from "../../projects/modelling/tile_grid"
import { getMedianCellSize } from "../../projects/modelling/components/cell_area_component"

interface ZevenbergenThorneDerivatives {
    dzdx: number;
    dzdy: number;
}

interface HornDerivatives {
    dzdx: number;
    dzdy: number;
}

function calculateZevenbergenThorneDerivatives(ng: NeighbourGrid, cellSize: number): ZevenbergenThorneDerivatives {
    // Calculate partial derivatives
    // dz/dx using east and west neighbors
    const dzdx = (ng.Z6.value - ng.Z4.value) / (2 * cellSize);
    
    // dz/dy using north and south neighbors
    const dzdy = (ng.Z2.value - ng.Z8.value) / (2 * cellSize);

    return { dzdx, dzdy };
}

function ZevenbergenThorneSlope(ng: NeighbourGrid, cellSize: number, radians: boolean = false) : number {

    const { dzdx, dzdy } = calculateZevenbergenThorneDerivatives(ng, cellSize);

    // Calculate slope in radians
    const slope = Math.atan(Math.sqrt(dzdx * dzdx + dzdy * dzdy));

    // Return slope in degrees
    return radians ? slope : slope * (180 / Math.PI);
}

function ZevenbergenThorneAspect(ng: NeighbourGrid, cellSize: number) : number {

    const { dzdx, dzdy } = calculateZevenbergenThorneDerivatives(ng, cellSize);

    // Calculate aspect in radians
    let aspect = Math.atan2(dzdx, dzdy);

    // Convert to degrees and adjust to get 0-360° with 0° at north
    aspect = aspect * (180 / Math.PI);
    
    // Adjust to get 0° at North, increasing clockwise
    aspect = 90 - aspect;
    if (aspect < 0) {
        aspect += 360;
    }

    return aspect;
}

function calculateHornDerivatives(ng: NeighbourGrid, cellSize: number): HornDerivatives {
    // Calculate partial derivatives using Horn's method
    // dz/dx using weighted average of three east-west pairs
    const dzdx = ((ng.Z3.value + 2*ng.Z6.value + ng.Z9.value) - 
                  (ng.Z1.value + 2*ng.Z4.value + ng.Z7.value)) / (8 * cellSize);
    
    // dz/dy using weighted average of three north-south pairs
    const dzdy = ((ng.Z1.value + 2*ng.Z2.value + ng.Z3.value) - 
                  (ng.Z7.value + 2*ng.Z8.value + ng.Z9.value)) / (8 * cellSize);

    return { dzdx, dzdy };
}

function HornAspect(ng: NeighbourGrid, cellSize: number) : number {

    const { dzdx, dzdy } = calculateHornDerivatives(ng, cellSize);
    // Calculate aspect in radians
    let aspect = Math.atan2(dzdx, dzdy);

    // Convert to degrees and adjust to get 0-360° with 0° at north
    aspect = aspect * (180 / Math.PI);
    
    // Adjust to get 0° at North, increasing clockwise
    aspect = 90 - aspect;
    if (aspect < 0) {
        aspect += 360;
    }

    return aspect;
}

function HornSlope(ng: NeighbourGrid, cellSize: number, radians: boolean = false): number {
    const { dzdx, dzdy } = calculateHornDerivatives(ng, cellSize);

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

export function calculateContour(elevationModel: NumericTileGrid, type: "Horn" | "ZevenbergenThorne", scale: number, contourInterval: number = 10) : NumericTileGrid {
    const result = new NumericTileGrid(elevationModel.zoom, elevationModel.x, elevationModel.y, elevationModel.width, elevationModel.height);
    const singleCellSize = getMedianCellSize(elevationModel).length;
    const cellSize = singleCellSize * Math.ceil(scale / singleCellSize);
    const n_cells = Math.ceil(scale / singleCellSize);

    // Get the min and max elevation values to determine contour range
    let minElevation = Infinity;
    let maxElevation = -Infinity;
    elevationModel.iterate((x, y, value) => {
        if (value < minElevation) minElevation = value;
        if (value > maxElevation) maxElevation = value;
    });

    // Calculate contour lines
    result.iterate((x, y, value) => {
        const neighbors = elevationModel.getNeighborCoordinates(x, y, n_cells);
        const currentElevation = elevationModel.get(x, y);
        
        // Calculate slope and aspect
        const slope = type === "Horn" ? 
            HornSlope(neighbors, cellSize, true) : 
            ZevenbergenThorneSlope(neighbors, cellSize, true);
        
        const aspect = type === "Horn" ? 
            HornAspect(neighbors, cellSize) : 
            ZevenbergenThorneAspect(neighbors, cellSize);

        // Check if this cell is near a contour line
        let isContour = false;
        for (let contourElevation = minElevation; contourElevation <= maxElevation; contourElevation += contourInterval) {
            // Check if we're crossing a contour line
            const nextElevation = contourElevation + contourInterval;
            if (currentElevation >= contourElevation && currentElevation < nextElevation) {
                // Calculate the perpendicular direction to the contour
                const contourAngle = aspect + 90; // Contour lines are perpendicular to aspect
                const contourRadians = contourAngle * (Math.PI / 180);
                
                // Check if we're close enough to the contour line
                const distanceToContour = Math.abs(currentElevation - contourElevation);
                const slopeRadians = slope;
                
                // If we're within one cell's worth of the contour line
                if (distanceToContour < (cellSize * Math.tan(slopeRadians))) {
                    isContour = true;
                    break;
                }
            }
        }

        // Set the result: 1 for contour lines, 0 for non-contour areas
        result.set(x, y, isContour ? 1 : 0);
    });

    return result;
}

export function calculateAspect(elevationModel: NumericTileGrid, type: "Horn" | "ZevenbergenThorne", scale: number) : NumericTileGrid
{
    const result = new NumericTileGrid(elevationModel.zoom, elevationModel.x, elevationModel.y, elevationModel.width, elevationModel.height)
 
    const singleCellSize = getMedianCellSize(elevationModel).length
    const cellSize = singleCellSize * Math.ceil(scale / singleCellSize) 
    const n_cells = Math.ceil(scale / singleCellSize)

    result.iterate((x, y, val) => {
        const neighbors = elevationModel.getNeighborCoordinates(x, y, n_cells)
        switch (type) {
            case "Horn":
                result.set(x, y, HornAspect(neighbors, cellSize))
                break;
            case "ZevenbergenThorne":
                result.set(x, y, ZevenbergenThorneAspect(neighbors, cellSize))
                break;
            default:
                break;
        }

    })

    return result
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

export function calculateContourLength(contourGrid: NumericTileGrid): number {
    const width = contourGrid.width;
    const height = contourGrid.height;
    const singleCellSize = getMedianCellSize(contourGrid).length;
    
    // Total contour length
    let totalLength = 0;
    
    // Track visited cells to avoid double counting
    const visited = new Set<string>();
    
    // Function to create a unique key for each cell
    const cellKey = (x: number, y: number) => `${x},${y}`;
    
    // Length between orthogonal neighbors (horizontal/vertical)
    const orthogonalLength = singleCellSize;
    
    // Length between diagonal neighbors (using Pythagorean theorem)
    const diagonalLength = singleCellSize * Math.sqrt(2);
    
    // Define a function to trace a contour segment from a starting point
    const traceContour = (startX: number, startY: number) => {
        // Stack for depth-first traversal
        const stack: [number, number][] = [[startX, startY]];
        let segmentLength = 0;
        
        while (stack.length > 0) {
            const [x, y] = stack.pop()!;
            const key = cellKey(x, y);
            
            // Skip if already visited
            if (visited.has(key)) continue;
            
            // Mark as visited
            visited.add(key);
            
            // Check all 8 neighbors
            const neighbors: [number, number, number][] = []; // x, y, length
            
            // Orthogonal neighbors
            if (x > 0 && contourGrid.get(x - 1, y) === 1) neighbors.push([x - 1, y, orthogonalLength]);
            if (x < width - 1 && contourGrid.get(x + 1, y) === 1) neighbors.push([x + 1, y, orthogonalLength]);
            if (y > 0 && contourGrid.get(x, y - 1) === 1) neighbors.push([x, y - 1, orthogonalLength]);
            if (y < height - 1 && contourGrid.get(x, y + 1) === 1) neighbors.push([x, y + 1, orthogonalLength]);
            
            // Diagonal neighbors
            if (x > 0 && y > 0 && contourGrid.get(x - 1, y - 1) === 1) 
                neighbors.push([x - 1, y - 1, diagonalLength]);
            if (x < width - 1 && y > 0 && contourGrid.get(x + 1, y - 1) === 1) 
                neighbors.push([x + 1, y - 1, diagonalLength]);
            if (x > 0 && y < height - 1 && contourGrid.get(x - 1, y + 1) === 1) 
                neighbors.push([x - 1, y + 1, diagonalLength]);
            if (x < width - 1 && y < height - 1 && contourGrid.get(x + 1, y + 1) === 1) 
                neighbors.push([x + 1, y + 1, diagonalLength]);
            
            // Add the minimum connection length for each cell
            // (When cells form a line, we count half the distance from each cell)
            if (neighbors.length > 0) {
                const minLength = Math.min(...neighbors.map(n => n[2])) / 2;
                segmentLength += minLength;
                
                // Add unvisited neighbors to stack
                for (const [nx, ny] of neighbors) {
                    const nKey = cellKey(nx, ny);
                    if (!visited.has(nKey)) {
                        stack.push([nx, ny]);
                    }
                }
            }
        }
        
        return segmentLength;
    };
    
    // Find all contour cells and trace each segment
    contourGrid.iterate((x, y, value) => {
        if (value === 1 && !visited.has(cellKey(x, y))) {
            const segmentLength = traceContour(x, y);
            totalLength += segmentLength;
        }
    });
    
    return totalLength;
}

// Helper function to get contour statistics from an elevation model
export function getContourStatistics(
    elevationModel: NumericTileGrid, 
    type: "Horn" | "ZevenbergenThorne",
    scale: number,
    contourInterval: number = 10
): { totalLength: number, contourDensity: number } {
    // Generate contour grid
    const contourGrid = calculateContour(elevationModel, type, scale, contourInterval);
    
    // Calculate total contour length
    const totalLength = calculateContourLength(contourGrid);
    
    // Calculate area
    const area = contourGrid.width * contourGrid.height * Math.pow(getMedianCellSize(contourGrid).length, 2);
    
    // Calculate contour density (length per unit area)
    const contourDensity = totalLength / area;
    
    return { totalLength, contourDensity };
}

export function calculateContourLengthPerCell(contourGrid: NumericTileGrid): NumericTileGrid {
    // Create result grid with same dimensions as input
    const result = new NumericTileGrid(
        contourGrid.zoom, 
        contourGrid.x, 
        contourGrid.y, 
        contourGrid.width, 
        contourGrid.height
    );
    
    const width = contourGrid.width;
    const height = contourGrid.height;
    const singleCellSize = getMedianCellSize(contourGrid).length;
    
    // Track visited cells to avoid double counting
    const visited = new Set<string>();
    
    // Function to create a unique key for each cell
    const cellKey = (x: number, y: number) => `${x},${y}`;
    
    // Length between orthogonal neighbors (horizontal/vertical)
    const orthogonalLength = singleCellSize;
    
    // Length between diagonal neighbors (using Pythagorean theorem)
    const diagonalLength = singleCellSize * Math.sqrt(2);
    
    // Define a function to trace a contour segment and assign length to each cell
    const traceContour = (startX: number, startY: number) => {
        // Stack for depth-first traversal
        const stack: [number, number][] = [[startX, startY]];
        const cellLengths = new Map<string, number>();
        
        while (stack.length > 0) {
            const [x, y] = stack.pop()!;
            const key = cellKey(x, y);
            
            // Skip if already visited
            if (visited.has(key)) continue;
            
            // Mark as visited
            visited.add(key);
            
            // Check all 8 neighbors
            const neighbors: [number, number, number][] = []; // x, y, length
            
            // Orthogonal neighbors
            if (x > 0 && contourGrid.get(x - 1, y) === 1) neighbors.push([x - 1, y, orthogonalLength]);
            if (x < width - 1 && contourGrid.get(x + 1, y) === 1) neighbors.push([x + 1, y, orthogonalLength]);
            if (y > 0 && contourGrid.get(x, y - 1) === 1) neighbors.push([x, y - 1, orthogonalLength]);
            if (y < height - 1 && contourGrid.get(x, y + 1) === 1) neighbors.push([x, y + 1, orthogonalLength]);
            
            // Diagonal neighbors
            if (x > 0 && y > 0 && contourGrid.get(x - 1, y - 1) === 1) 
                neighbors.push([x - 1, y - 1, diagonalLength]);
            if (x < width - 1 && y > 0 && contourGrid.get(x + 1, y - 1) === 1) 
                neighbors.push([x + 1, y - 1, diagonalLength]);
            if (x > 0 && y < height - 1 && contourGrid.get(x - 1, y + 1) === 1) 
                neighbors.push([x - 1, y + 1, diagonalLength]);
            if (x < width - 1 && y < height - 1 && contourGrid.get(x + 1, y + 1) === 1) 
                neighbors.push([x + 1, y + 1, diagonalLength]);
            
            // Calculate and assign length for this cell
            if (neighbors.length > 0) {
                // Calculate average length contribution for this cell
                // When a cell has multiple neighbors, we use the average 
                // because the contour likely passes through in multiple directions
                const lengthSum = neighbors.reduce((sum, n) => sum + n[2], 0);
                const avgLength = lengthSum / (2 * neighbors.length);
                
                // Store the length for this cell
                cellLengths.set(key, avgLength);
                
                // Add unvisited neighbors to stack
                for (const [nx, ny] of neighbors) {
                    const nKey = cellKey(nx, ny);
                    if (!visited.has(nKey)) {
                        stack.push([nx, ny]);
                    }
                }
            } else {
                // Isolated contour point
                cellLengths.set(key, singleCellSize / 2);
            }
        }
        
        // Assign calculated lengths to result grid
        Array.from(cellLengths.entries()).forEach(([key, length]) => {
            const [x, y] = key.split(',').map(Number);
            result.set(x, y, length);
        });
    };
    
    // Initialize result grid with zeros
    result.iterate((x, y) => {
        result.set(x, y, 0);
    });
    
    // Trace all contour segments and assign length values
    contourGrid.iterate((x, y, value) => {
        if (value === 1 && !visited.has(cellKey(x, y))) {
            traceContour(x, y);
        }
    });
    
    return result;
}

// Calculate contour length statistics for a given elevation model
export function getContourLengthStatistics(
    elevationModel: NumericTileGrid, 
    type: "Horn" | "ZevenbergenThorne",
    scale: number,
    contourInterval: number = 10
): { 
    totalLength: number, 
    contourDensity: number,
    contourLengthPerCell: NumericTileGrid 
} {
    // Generate contour grid
    const contourGrid = calculateContour(elevationModel, type, scale, contourInterval);
    
    // Calculate contour length per cell
    const contourLengthPerCell = calculateContourLengthPerCell(contourGrid);
    
    // Calculate total contour length
    let totalLength = 0;
    contourLengthPerCell.iterate((x, y, value) => {
        totalLength += value;
    });
    
    // Calculate area
    const area = contourGrid.width * contourGrid.height * Math.pow(getMedianCellSize(contourGrid).length, 2);
    
    // Calculate contour density (length per unit area)
    const contourDensity = totalLength / area;
    
    return { totalLength, contourDensity, contourLengthPerCell };
}

// Calculate flow direction using D8 algorithm
export function calculateD8FlowDirection(elevationModel: NumericTileGrid, scale: number = 10): NumericTileGrid {
    
    const result = new NumericTileGrid(elevationModel.zoom, elevationModel.x, elevationModel.y, elevationModel.width, elevationModel.height);
    const singleCellSize = getMedianCellSize(elevationModel).length;
    const cellSize = singleCellSize * Math.ceil(scale / singleCellSize);
    const n_cells = Math.ceil(scale / singleCellSize);
    
    
    // Define D8 direction values mapped to NeighbourGrid keys
    const D8_DIRECTIONS: Record<keyof NeighbourGrid, number> = {
        Z1: 128, // NW
        Z2: 1,   // N
        Z3: 2,   // NE
        Z4: 64,  // W
        Z5: 0,   // Center (ignored)
        Z6: 4,   // E
        Z7: 32,  // SW
        Z8: 16,  // S
        Z9: 8    // SE
    };

    result.iterate((x, y) => {

        const neighbours: NeighbourGrid = elevationModel.getNeighborCoordinates(x, y, n_cells);
        const currentElevation = neighbours.Z5.value; // Center cell elevation

        let maxSlope = 0;
        let bestDirection = 0;

        for (const key in neighbours) {
            if (key === "Z5") continue; 

            const neighbor = neighbours[key as keyof NeighbourGrid];
            const neighborElevation = neighbor.value;

            const isDiagonal = ["Z1", "Z3", "Z7", "Z9"].includes(key);
            const distance = isDiagonal ? Math.SQRT2 * cellSize : cellSize; // √2 for diagonals

            const slope = (currentElevation - neighborElevation) / distance;

            if (slope > maxSlope) {
                maxSlope = slope;
                bestDirection = D8_DIRECTIONS[key as keyof NeighbourGrid];
            }
        }

        result.set(x, y, bestDirection);
    });

    return result;
}

// Calculate flow accumulation using D8 algorithm
export function calculateD8FlowAccumulation(flowDirectionGrid: NumericTileGrid): NumericTileGrid {
    const width = flowDirectionGrid.width;
    const height = flowDirectionGrid.height;
    
    const result = new NumericTileGrid(
        flowDirectionGrid.zoom, 
        flowDirectionGrid.x, 
        flowDirectionGrid.y, 
        width,
        height
    );
    
    // Initialize all cells with 1 (each cell contributes itself)
    result.iterate((x, y) => {
        result.set(x, y, 1);
    });
    
    // Maps flow direction values to dx, dy offsets
    const directionMap: Record<number, [number, number]> = {
        1: [0, -1],   // North
        2: [1, -1],   // Northeast
        4: [1, 0],    // East
        8: [1, 1],    // Southeast
        16: [0, 1],   // South
        32: [-1, 1],  // Southwest
        64: [-1, 0],  // West
        128: [-1, -1] // Northwest
    };
    
    // We need to process cells in topological order (upstream to downstream)
    // 1. Create a dependency count for each cell (number of cells flowing into it)
    const dependencyCount = new Array(width * height).fill(0);
    const cellIndex = (x: number, y: number) => y * width + x;
    
    // 2. Build a mapping of which cells flow to which cells
    const flowsToMap: Record<number, number[]> = {};
    
    // Initialize flowsToMap
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            flowsToMap[cellIndex(x, y)] = [];
        }
    }
    
    // Count dependencies and build the flow map
    flowDirectionGrid.iterate((x, y, flowDirection) => {
        if (flowDirection === 0) return; // Skip cells with no flow direction
        
        const [dx, dy] = directionMap[flowDirection] || [0, 0];
        const nx = x + dx;
        const ny = y + dy;
        
        // Check if downstream cell is within bounds
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            // Increment dependency count for downstream cell
            dependencyCount[cellIndex(nx, ny)]++;
            
            // Add this cell to the list of cells that flow to downstream cell
            flowsToMap[cellIndex(nx, ny)].push(cellIndex(x, y));
        }
    });
    
    // 3. Process cells with no dependencies first (cells that no other cells flow into)
    const queue: number[] = [];
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = cellIndex(x, y);
            if (dependencyCount[idx] === 0) {
                queue.push(idx);
            }
        }
    }
    
    // 4. Process cells in queue
    while (queue.length > 0) {
        const idx = queue.shift()!;
        const x = idx % width;
        const y = Math.floor(idx / width);
        
        // Get the flow direction for this cell
        const flowDirection = flowDirectionGrid.get(x, y);
        if (flowDirection === 0) continue; // Skip cells with no flow
        
        // Find the downstream cell coordinates
        const [dx, dy] = directionMap[flowDirection] || [0, 0];
        const nx = x + dx;
        const ny = y + dy;
        
        // Check if downstream cell is within bounds
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            // Add this cell's accumulation to the downstream cell
            const downstreamIdx = cellIndex(nx, ny);
            const currentAccumulation = result.get(x, y);
            const downstreamAccumulation = result.get(nx, ny);
            result.set(nx, ny, downstreamAccumulation + currentAccumulation);
            
            // Decrement dependency count for downstream cell
            dependencyCount[downstreamIdx]--;
            
            // If downstream cell has no more dependencies, add it to queue
            if (dependencyCount[downstreamIdx] === 0) {
                queue.push(downstreamIdx);
            }
        }
    }
    
    return result;
}

// Combined function to directly calculate flow accumulation from elevation
export function calculateFlowAccumulation(elevationModel: NumericTileGrid): NumericTileGrid {
    // First calculate flow direction
    const flowDirectionGrid = calculateD8FlowDirection(elevationModel);
    
    // Then calculate flow accumulation
    return calculateD8FlowAccumulation(flowDirectionGrid);
}