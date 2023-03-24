import { TileRange } from "ol"
import { Extent, getIntersection } from "ol/extent"
import { Size } from "ol/size"
import ImageCanvasSource from "ol/source/ImageCanvas"
import { createXYZ } from "ol/tilegrid"
import { BooleanTileGrid, NumericTileGrid } from "./modelling/tile_grid"

const xyz = createXYZ()

export class ModelOutputSource extends ImageCanvasSource {
  tileGrid: BooleanTileGrid | NumericTileGrid

  constructor(tileGrid: BooleanTileGrid | NumericTileGrid) {
    super({
      canvasFunction: (extent, resolution, pixelRatio, size, projection) => {
        return this.drawCanvas(extent, pixelRatio, size)
      }
    })
    this.tileGrid = tileGrid
  }

  drawCanvas(extent: Extent, pixelRatio: number, size: Size): HTMLCanvasElement {
    const canvas = document.createElement("canvas")
    canvas.width = size[0]
    canvas.height = size[1]

    const ctx = canvas.getContext("2d")
    if (ctx == null) { return canvas }

    const zoom = this.tileGrid.zoom
    const x0 = this.tileGrid.x
    const x1 = x0 + this.tileGrid.width
    const y0 = this.tileGrid.y
    const y1 = y0 + this.tileGrid.height

    xyz.forEachTileCoord(
      extent,
      zoom,
      (coord) => {
        const x = coord[1]
        const y = coord[2]
        if (x >= x0 && x < x1 && y >= y0 && y < y1) {
          //const label = this.labels[(x - x0) * (y1 - y0) + (y - y0)]
          
          const tileExtent = xyz.getTileCoordExtent([zoom, x, y])

          const tileX0 = (tileExtent[0] - extent[0]) / (extent[2] - extent[0]) * size[0]
          const tileX1 = (tileExtent[2] - extent[0]) / (extent[2] - extent[0]) * size[0]

          const tileY0 = (tileExtent[3] - extent[1]) / (extent[3] - extent[1]) * size[1]
          const tileY1 = (tileExtent[1] - extent[1]) / (extent[3] - extent[1]) * size[1]


          ctx.fillStyle = this.tileGrid.get(x, y) ? "#FFFFFF" : "#000000"
          ctx.fillRect(tileX0, size[1] - tileY1, tileX1 - tileX0, tileY1 - tileY0)
        }
      }
    )

    return canvas
  }
}