import { registerSerializer } from 'threads'

function validateZoom(zoom) {
  if (!(
    Number.isInteger(zoom) && zoom >= 0
  )) {
    throw new TypeError("zoom must be an integer >= 0")
  }
}

function validateAxisExtent(zoom, start, length) {
  if (!(
    Number.isInteger(start) && start >= 0 && start < Math.pow(2, zoom) &&
    Number.isInteger(length) && length > 0 && length <= (Math.pow(2, zoom) - start)
  )) {
    throw new TypeError("extent out of range")
  }
}

function toIndex(grid, x, y) {
  if (
    x >= grid.x && x < grid.x + grid.width &&
    y >= grid.y && y < grid.y + grid.height
  ) {
    return (x - grid.x) * grid.height + (y - grid.y)
  }
  else {
    return undefined
  }
}

class TileGrid {
  protected zoom: number;
  data: any;
  x: number;
  y: number;
  width: number;
  height: number;
  constructor(zoom, x, y, width, height) {
    validateZoom(zoom)
    validateAxisExtent(zoom, x, width)
    validateAxisExtent(zoom, y, height)

    Object.assign(this, { zoom, x, y, width, height })
  }

  get(x, y, zoom) {
    if (zoom < this.zoom) {
      throw new TypeError("invalid zoom level")
    }
    const scale = Math.pow(2, zoom - this.zoom)
    const index = toIndex(this, Math.floor(x / scale), Math.floor(y / scale))
    return (typeof index === 'undefined') ? undefined : this.data[index]
  }

  set(x, y, value) {
    const index = toIndex(this, x, y)
    if (typeof index === 'undefined') {
      throw new TypeError('coordinate out of range')
    }
    this.data[index] = value
  }
}

export class BooleanTileGrid extends TileGrid {
  constructor(zoom, x, y, width, height) {
    super(zoom, x, y, width, height)
    this.data = new Uint8Array(width * height)
  }

  get(x, y, zoom = this.zoom) {
    return (super.get(x, y, zoom) === 1)
  }

  set(x, y, value) {
    if (value !== true && value !== false) {
      throw new TypeError("invalid value")
    }
    super.set(x, y, value ? 1 : 0)
  }
}

export class NumericTileGrid extends TileGrid {
  constructor(zoom, x, y, width, height, initialValue = 0) {
    super(zoom, x, y, width, height)
    this.data = new Float32Array(width * height).fill(initialValue)
  }
  
  get(x, y, zoom = this.zoom) {
    const value = super.get(x, y, zoom)
    return typeof value === 'undefined' ? 0 : value
  }

  set(x, y, value) {
    if (typeof value !== 'number') {
      throw new TypeError("invalid value")
    }
    super.set(x, y, value)
  }
}

export class LabelledTileGrid extends TileGrid {
  labelSchema: any;
  constructor(zoom, x, y, width, height, labelSchema) {
    super(zoom, x, y, width, height)
    this.labelSchema = labelSchema
    this.data = new Uint8Array(width * height).fill(255)
  }

  get(x, y, zoom = this.zoom) {
    const value = super.get(x, y, zoom)
    return value
  }

  set(x, y, value) {
    if (typeof value !== 'number') {
      // TODO: make sure it's an int and make sure it's in the schema
      throw new TypeError("invalid value")
    }
    super.set(x, y, value)
  }
}

registerSerializer({
  deserialize(message, defaultHandler) {
    // @ts-ignore
    if (message && message.__type === "$$BooleanTileGrid") {
      // @ts-ignore
      const { zoom, x, y, width, height, data } = message
      const result = new BooleanTileGrid(zoom, x, y, width, height)
      result.data = data
      return result
    }
    else { // @ts-ignore
      if (message && message.__type === "$$NumericTileGrid") {
            // @ts-ignore
            const { zoom, x, y, width, height, data } = message
            const result = new NumericTileGrid(zoom, x, y, width, height)
            result.data = data
            return result
          }
          else {
            return defaultHandler(message)
          }
    }
  },
  serialize(thing, defaultHandler) {
    if (thing instanceof BooleanTileGrid) {
      return {
        ...thing,
        __type: "$$BooleanTileGrid",
      }
    }
    else if (thing instanceof NumericTileGrid) {
      return {
        ...thing,
        __type: "$$NumericTileGrid",
      }
    }
    else {
      return defaultHandler(thing)
    }
  }
})

export function getExtent(grid, zoom) {
  const scale = Math.pow(2, zoom - grid.zoom)
  return [
    grid.x * scale,
    grid.y * scale,
    (grid.x + grid.width) * scale,
    (grid.y + grid.height) * scale,
  ]
}

export function mergeExtents(a, b) {
  return [
    Math.min(a[0], b[0]),
    Math.min(a[1], b[1]),
    Math.max(a[2], b[2]),
    Math.max(a[3], b[3]),
  ]
}

export function intersectExtents(a, b) {
  return [
    Math.max(a[0], b[0]),
    Math.max(a[1], b[1]),
    Math.min(a[2], b[2]),
    Math.min(a[3], b[3]),
  ]
}
