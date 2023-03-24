import { Extent } from "ol/extent"

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
  zoom: number
  x: number
  y: number
  width: number
  height: number
  
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
  data: Uint8Array
  
  constructor(zoom: number, x: number, y: number, width: number, height: number) {
    super(zoom, x, y, width, height)
    this.data = new Uint8Array(width * height)
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
  data: Float32Array

  constructor(zoom: number, x: number, y: number, width: number, height: number, initialValue = 0) {
    super(zoom, x, y, width, height)
    this.data = new Float32Array(width * height).fill(initialValue)
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
  }
}

export function getExtent(grid: TileGrid, zoom: number): Extent {
  const scale = Math.pow(2, zoom - grid.zoom)
  return [
    grid.x * scale,
    grid.y * scale,
    (grid.x + grid.width) * scale,
    (grid.y + grid.height) * scale,
  ]
}
