import {
  BooleanTileGrid, NumericTileGrid
} from '../../projects/modelling/tile_grid'
import {
  getExtent,
  intersectExtents,
  mergeExtents,
} from '../TileGrid'

const operations = new Map()
operations.set('Union', { inputType: BooleanTileGrid, outputType: BooleanTileGrid, fn: (...inputs) => inputs.reduce((a, b) => a || b) })
operations.set('Intersection', { inputType: BooleanTileGrid, outputType: BooleanTileGrid, fn: (...inputs) => inputs.reduce((a, b) => a && b) })
operations.set('Set difference', { inputType: BooleanTileGrid, outputType: BooleanTileGrid, fn: (a, b) => (a && !b) })
operations.set('Symmetric difference', { inputType: BooleanTileGrid, outputType: BooleanTileGrid, fn: (...inputs) => inputs.reduce((a, b) => (a || b) && !(a && b)) })
operations.set('Sum', { inputType: NumericTileGrid, outputType: NumericTileGrid, fn: (...inputs) => inputs.reduce((a, b) => a + b) })
operations.set('Merge', { inputType: NumericTileGrid, outputType: NumericTileGrid, fn: (...inputs) => inputs.reduce((a, b) => isNaN(a) && isNaN(b) ? NaN : (isNaN(a) ? b : (isNaN(b) ? a : (a + b))))})
operations.set('Product', { inputType: NumericTileGrid, outputType: NumericTileGrid, fn: (...inputs) => inputs.reduce((a, b) => a * b) })
operations.set('Add', { inputType: NumericTileGrid, outputType: NumericTileGrid, fn: (a, b) => (a + b) })
operations.set('Subtract', { inputType: NumericTileGrid, outputType: NumericTileGrid, fn: (a, b) => (a - b) })
operations.set('Multiply', { inputType: NumericTileGrid, outputType: NumericTileGrid, fn: (a, b) => (a * b) })
operations.set('Divide', { inputType: NumericTileGrid, outputType: NumericTileGrid, fn: (a, b) => (a / b) })
operations.set('Power', { inputType: NumericTileGrid, outputType: NumericTileGrid, fn: (a, b) => Math.pow(a, b) })
operations.set('Less', { inputType: NumericTileGrid, outputType: BooleanTileGrid, fn: (a, b) => (a < b) })
operations.set('Greater', { inputType: NumericTileGrid, outputType: BooleanTileGrid, fn: (a, b) => (a > b) })
operations.set('Min', { inputType: NumericTileGrid, outputType: NumericTileGrid, fn: (a, b) => Math.min(a, b) })
operations.set('Max', { inputType: NumericTileGrid, outputType: NumericTileGrid, fn: (a, b) => Math.max(a, b) })

operations.set('Complement', { inputType: BooleanTileGrid, outputType: BooleanTileGrid, fn: a => (!a) })
operations.set('Negate', { inputType: NumericTileGrid, outputType: NumericTileGrid, fn: a => (-a) })
operations.set('Reciprocal', { inputType: NumericTileGrid, outputType: NumericTileGrid, fn: a => (1 / a) })

export function performOperation(operationName, ...inputs) {
  const operation = operations.get(operationName)

  const zoom = Math.max(...inputs.map(i => i.zoom))
  const combineExtents = (operation.inputType === BooleanTileGrid) ? mergeExtents : intersectExtents
  const [x0, y0, x1, y1] = (inputs.length === 1)
    ? getExtent(inputs[0], zoom)
    : inputs.map(i => getExtent(i, zoom)).reduce((a, b) => combineExtents(a, b))
  const out = new operation.outputType(zoom, x0, y0, x1 - x0, y1 - y0)

  for (let x = out.x; x < out.x + out.width; ++x) {
    for (let y = out.y; y < out.y + out.height; ++y) {
      out.set(x, y, 
        operation.fn(...inputs.map(i => i.get(x, y, zoom)))
      )
    }
  }
  return out
}
