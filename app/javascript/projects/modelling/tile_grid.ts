import { mean, mode } from "mathjs"
import { Extent } from "ol/extent"
import { createXYZ } from "ol/tilegrid"
import { registerSerializer } from "threads"
import { getMedianCellSize } from "./components/cell_area_component"
import { TileRange } from "ol"

export const units = ["NA", "g", "kg", "t", "%", "pH"]
export const areas = ["CELL", "ha", "m²", "km²"]

export interface TileGridProps {
    unit: string | undefined
    area: string | undefined
}

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

export function toIndex(grid: TileGrid, x: number, y: number) {
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

export interface tileGridStats {
  min: number
  max: number
  type: "BooleanTileGrid" | "NumericTileGrid" | "CategoricalTileGrid" | undefined
  labels?: Array<any>
  zoom: number
  area: number
  length: number
  props?: TileGridProps
}

export interface TileGridJSON {
  type: "BooleanTileGrid" | "NumericTileGrid" | "CategoricalTileGrid"
  zoom: number
  x: number
  y: number
  width: number
  height: number
  data: Uint8Array | Float32Array
  labels?: object
}

export function fromJSON(json: TileGridJSON): NumericTileGrid | BooleanTileGrid | CategoricalTileGrid | null {
  const type = json.type;
  const arraydata = Object.values(json.data);

  switch (type) {
    case "BooleanTileGrid":
      return new BooleanTileGrid(json.zoom, json.x, json.y, json.width, json.height, Uint8Array.from(arraydata, value => value))
    case "NumericTileGrid":
      // NaN are stored as null in JSON, return these back to NaN
      return new NumericTileGrid(json.zoom, json.x, json.y, json.width, json.height, Float32Array.from(arraydata.map(e => e === null ? NaN : e), value => value))
    case "CategoricalTileGrid":
      const labels = json.labels || {}
      const map = new Map<number, string>()

      for (const [key, value] of Object.entries(labels)) {
        map.set(parseInt(key), value)
      }
      return new CategoricalTileGrid(json.zoom, json.x, json.y, json.width, json.height, Uint8Array.from(arraydata, value => value), map)
    default:
      throw new Error("Invalid tile grid JSON");
  }
}


abstract class TileGrid {
  readonly zoom: number
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number

  abstract toJSON(): TileGridJSON

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
  name: string | undefined

  constructor(zoom: number, x: number, y: number, width: number, height: number, initialValue: boolean | Uint8Array = false) {
    super(zoom, x, y, width, height)
    if (initialValue instanceof Uint8Array) {
      this.data = initialValue
    }
    else {
      this.data = new Uint8Array(width * height).fill(initialValue ? 1 : 0)
    }
  }

  iterate(callback: (x: number, y: number, value: boolean) => void) {
    const { x, y, width, height } = this
    for (let i = x; i < x + width; i++) {
      for (let j = y; j < y + height; j++) {
        callback(i, j, this.get(i, j))
      }
    }
  }

  get(x: number, y: number, zoom = this.zoom): boolean {
    if (zoom < this.zoom) {
      const x1 = x * Math.pow(2, this.zoom - zoom)
      const y1 = y * Math.pow(2, this.zoom - zoom)
      const x2 = x1 + Math.pow(2, this.zoom - zoom)
      const y2 = y1 + Math.pow(2, this.zoom - zoom)

      for (let x = x1; x < x2; x++) {
        for (let y = y1; y < y2; y++) {
          const index = toIndex(this, Math.floor(x), Math.floor(y))
          if(typeof index === 'undefined') return false
          if (this.data[index] === 1) {
            return true;
          }
        }
      }
      return false;
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

  rescale(zoom: number, extent: Extent): BooleanTileGrid {
    const tileGrid = createXYZ()
    const outputTileRange = tileGrid.getTileRangeForExtentAndZ(extent, zoom)
    const rescaledGrid = new BooleanTileGrid(
      zoom,
      outputTileRange.minX,
      outputTileRange.minY,
      outputTileRange.getWidth(),
      outputTileRange.getHeight()
    )
    rescaledGrid.name = this.name
    for (let i = rescaledGrid.x; i < rescaledGrid.x + rescaledGrid.width; i++) {
      for (let j = rescaledGrid.y; j < rescaledGrid.y + rescaledGrid.height; j++) {

        const x1 = i * Math.pow(2, this.zoom - zoom);
        const y1 = j * Math.pow(2, this.zoom - zoom);
        const x2 = x1 + Math.pow(2, this.zoom - zoom);
        const y2 = y1 + Math.pow(2, this.zoom - zoom);

        let anyTrue = false;

        // Iterate through the corresponding cells in the old grid
        for (let x = x1; x < x2; x++) {
          for (let y = y1; y < y2; y++) {
            if (this.get(x, y, this.zoom)) {
              anyTrue = true;
              break;
            }
          }
          if (anyTrue) {
            break;
          }
        }

        // Set the value in the new grid based on whether any cell in the old grid is true
        rescaledGrid.set(i, j, anyTrue);

      }
    }

    return rescaledGrid
  }

  getStats(): tileGridStats {
    const {area, length} = getMedianCellSize(this)
    return {
      min: 0,
      max: 1,
      type: "BooleanTileGrid",
      zoom: this.zoom,
      area,
      length
    }
  }

  toJSON(): TileGridJSON {
    return {
      type: 'BooleanTileGrid',
      zoom: this.zoom,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      data: this.data
    }
  }
}

export class NumericTileGrid extends TileGrid {
  private data: Float32Array
  name: string | undefined
  private minMax: [number, number] | null
  properties: TileGridProps

  constructor(zoom: number, x: number, y: number, width: number, height: number, initialValue: number | Float32Array = NaN) {
    super(zoom, x, y, width, height)
    this.properties = {
      unit: undefined,
      area: undefined
    }

    if (initialValue instanceof Float32Array) {
      this.data = initialValue
    }
    else {
      this.data = new Float32Array(width * height).fill(initialValue)
    }
    this.minMax = null
  }

  getData(): Float32Array {
    return this.data
  }

  clone(): NumericTileGrid {
    return new NumericTileGrid(this.zoom, this.x, this.y, this.width, this.height, this.data)
  }

  iterate(callback: (x: number, y: number, value: number) => void) {

    const { x, y, width, height } = this
    for (let i = x; i < x + width; i++) {
      for (let j = y; j < y + height; j++) {
        callback(i, j, this.get(i, j))
      }
    }
    
  }

  iterateOverTileRange(range: TileRange, callback: (x: number, y: number, value: number) => void) {

    const { x, y, width, height } = this
    const minX = Math.max(x, range.minX)
    const maxX = Math.min(x + width, range.maxX)
    const minY = Math.max(y, range.minY)
    const maxY = Math.min(y + height, range.maxY)

    for (let i = minX; i < maxX; i++) {
      for (let j = minY; j < maxY; j++) {
        callback(i, j, this.get(i, j))
      }
    }

  }

  get(x: number, y: number, zoom = this.zoom): number {
    if (zoom < this.zoom) {
      const x1 = x * Math.pow(2, this.zoom - zoom)
      const y1 = y * Math.pow(2, this.zoom - zoom)
      const x2 = x1 + Math.pow(2, this.zoom - zoom)
      const y2 = y1 + Math.pow(2, this.zoom - zoom)

      let nums: number[] = []

      for (let x = x1; x < x2; x++) {
        for (let y = y1; y < y2; y++) {
          const index = toIndex(this, Math.floor(x), Math.floor(y))
          if(typeof index === 'undefined') return NaN
          nums.push(this.data[index])
        }
      }
      return nums.length > 0 ? mean(...nums) : NaN
    }
    const scale = Math.pow(2, zoom - this.zoom)
    const index = toIndex(this, Math.floor(x / scale), Math.floor(y / scale))
    return (typeof index === 'undefined') ? NaN : this.data[index]
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
  getStats(): tileGridStats {

    const [min, max] = this.getMinMax()
    const {area, length} = getMedianCellSize(this)

    return {
      min: min,
      max: max,
      type: "NumericTileGrid",
      zoom: this.zoom,
      area,
      length,
      props: this.properties
    }
  }

  getTotal(): number {
    return this.data.reduce((a, b) => (isNaN(a) ? 0 : a) + (isNaN(b) ? 0 : b), 0)
  }

  toJSON(): TileGridJSON {
    return {
      type: 'NumericTileGrid',
      zoom: this.zoom,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      data: this.data
    }
  }
}

export class CategoricalTileGrid extends TileGrid {
  private data: Uint8Array
  private minMax: [number, number] | null
  labels: Map<number, string>

  constructor(zoom: number, x: number, y: number, width: number, height: number, initialValue?: Uint8Array, labels?: Map<number, string>) {
    super(zoom, x, y, width, height)
    this.data = initialValue ? initialValue : new Uint8Array(width * height).fill(255)
    if (labels) this.setLabels(labels)
  }

  iterate(callback: (x: number, y: number, value: number) => void) {
    const { x, y, width, height } = this
    for (let i = x; i < x + width; i++) {
      for (let j = y; j < y + height; j++) {
        callback(i, j, this.get(i, j))
      }
    }
  }

  get(x: number, y: number, zoom = this.zoom): number {
    if (zoom < this.zoom) {
      const x1 = x * Math.pow(2, this.zoom - zoom)
      const y1 = y * Math.pow(2, this.zoom - zoom)
      const x2 = x1 + Math.pow(2, this.zoom - zoom)
      const y2 = y1 + Math.pow(2, this.zoom - zoom)

      let nums: number[] = []

      for (let x = x1; x < x2; x++) {
        for (let y = y1; y < y2; y++) {
          const index = toIndex(this, Math.floor(x), Math.floor(y))
          if(typeof index === 'undefined') return 255
          nums.push(this.data[index])
        }
      }

      if(nums.length == 0) return 255
      else{
        let r = mode(...nums)
        if (r instanceof Array) return r[0]
        else return r
      }
    }


    const scale = Math.pow(2, zoom - this.zoom)
    const index = toIndex(this, Math.floor(x / scale), Math.floor(y / scale))
    return (typeof index === 'undefined') ? 255 : this.data[index]
  }

  set(x: number, y: number, value: number) {
    const index = toIndex(this, x, y)
    if (typeof index === 'undefined') {
      throw new TypeError('coordinate out of range')
    }
    this.data[index] = value
  }

  setLabels(labels: Map<number, string>) {
    this.labels = labels

    this.minMax = [0, this.labels.size]
  }

  getBoolFromLabel(label: string): BooleanTileGrid {

    const boolGrid = new BooleanTileGrid(this.zoom, this.x, this.y, this.width, this.height)

    const key = Array.from(this.labels).find(([key, value]) => value === label)?.[0]

    this.iterate((x, y, value) => {
      if (value === key) {
        boolGrid.set(x, y, true)
      }
    })

    return boolGrid

  }

  getMinMax() {
    if (this.minMax == null) {
      //no labels given.
      this.minMax = [0, 0]
    }
    return this.minMax
  }

  applyCategoryFromBooleanGrid(boolGrid: BooleanTileGrid, key: number) {
    const { x, y, width, height, zoom } = this

    for (let i = x; i < x + width; i++) {
      for (let j = y; j < y + height; j++) {

        if (boolGrid.get(i, j, zoom) && this.get(i, j) === 255) {
          this.set(i, j, key)
        }
      }
    }
  }

  getAsLabel(x: number, y: number, zoom = this.zoom): string | undefined {
    return this.labels.size > 0 ? undefined : this.labels.get(this.get(x, y, zoom = this.zoom))
  }

  getStats(): tileGridStats {

    const [min, max] = this.getMinMax()
    const {area, length} = getMedianCellSize(this)

    return {
      min,
      max,
      type: "CategoricalTileGrid",
      labels: Array.from(this.labels, ([name, value]) => ({ name, value })),//this.labels
      zoom: this.zoom,
      area,
      length
    }
  }

  toJSON(): TileGridJSON {
    return {
      type: 'CategoricalTileGrid',
      zoom: this.zoom,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      data: this.data,
      labels: Object.fromEntries(this.labels)
    }
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
