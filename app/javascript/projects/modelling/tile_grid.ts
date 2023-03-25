import { Extent } from "ol/extent"
import { registerSerializer } from "threads"

function validateZoom(zoom: number) {
  if (!(
    Number.isInteger(zoom) && zoom >= 0
  )) {
    throw new TypeError("zoom must be an integer >= 0")
  }
}

function validateAxisExtent(zoom: number, start: number, length: number) {
  if (!(
    Number.isInteger(start) && start >= 0 && start < Math.pow(2, zoom) &&
    Number.isInteger(length) && length > 0 && length <= (Math.pow(2, zoom) - start)
  )) {
    throw new TypeError("extent out of range")
  }
}

function toIndex(grid: TileGrid, x: number, y: number) {
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

abstract class TileGrid {
  readonly zoom: number
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
  
  constructor(zoom: number, x: number, y: number, width: number, height: number) {
    validateZoom(zoom)
    validateAxisExtent(zoom, x, width)
    validateAxisExtent(zoom, y, height)

    this.zoom = zoom
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }
}

export class BooleanTileGrid extends TileGrid {
  private data: Uint8Array
  
  constructor(zoom: number, x: number, y: number, width: number, height: number, initialValue: boolean | Uint8Array = false) {
    super(zoom, x, y, width, height)
    if (initialValue instanceof Uint8Array) {
      this.data = initialValue
    }
    else {
      this.data = new Uint8Array(width * height).fill(initialValue ? 1 : 0)
    }
  }

  get(x: number, y: number, zoom = this.zoom): boolean {
    if (zoom < this.zoom) {
      throw new TypeError("invalid zoom level")
    }
    const scale = Math.pow(2, zoom - this.zoom)
    const index = toIndex(this, Math.floor(x / scale), Math.floor(y / scale))
    return (typeof index === 'undefined') ? false : this.data[index] === 1
  }

  set(x: number, y: number, value: boolean) {
    const index = toIndex(this, x, y)
    if (typeof index === 'undefined') {
      throw new TypeError('coordinate out of range')
    }
    this.data[index] = value ? 1 : 0
  }
}

export class NumericTileGrid extends TileGrid {
  private data: Float32Array
  private minMax: [number, number] | null

  constructor(zoom: number, x: number, y: number, width: number, height: number, initialValue: number | Float32Array = 0) {
    super(zoom, x, y, width, height)
    if (initialValue instanceof Float32Array) {
      this.data = initialValue
    }
    else {
      this.data = new Float32Array(width * height).fill(initialValue)
    }
    this.minMax = null
  }
  
  get(x: number, y: number, zoom = this.zoom): number {
    if (zoom < this.zoom) {
      throw new TypeError("invalid zoom level")
    }
    const scale = Math.pow(2, zoom - this.zoom)
    const index = toIndex(this, Math.floor(x / scale), Math.floor(y / scale))
    return (typeof index === 'undefined') ? 0 : this.data[index]
  }

  set(x: number, y: number, value: number) {
    const index = toIndex(this, x, y)
    if (typeof index === 'undefined') {
      throw new TypeError('coordinate out of range')
    }
    this.data[index] = value
    this.minMax = null
  }

  getMinMax() {
    if (this.minMax == null) {
      var min = Infinity, max = -Infinity
      this.data.forEach(val => {
        if (isFinite(val)) {
          min = Math.min(val, min)
          max = Math.max(val, max)
        }
      })
      this.minMax = [min, max]
    }
    return this.minMax
  }
}

registerSerializer({
  deserialize(message: any, defaultHandler) {
    if (message && message.__type === "$$BooleanTileGrid") {
      const { zoom, x, y, width, height, data } = message
      const result = new BooleanTileGrid(zoom, x, y, width, height, data)
      return result
    }
    else if (message && message.__type === "$$NumericTileGrid") {
      const { zoom, x, y, width, height, data } = message
      const result = new NumericTileGrid(zoom, x, y, width, height, data)
      return result
    }
    else {
      return defaultHandler(message)
    }
  },
  serialize(thing, defaultHandler): any {
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

// TODO: this doesn't actually return an OpenLayers extent(?)
export function getExtent(grid: TileGrid, zoom: number) {
  const scale = Math.pow(2, zoom - grid.zoom)
  return [
    grid.x * scale,
    grid.y * scale,
    (grid.x + grid.width) * scale,
    (grid.y + grid.height) * scale,
  ]
}
