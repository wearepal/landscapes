import BaseLayer from "ol/layer/Base"
import TileLayer from "ol/layer/Tile"
import WebGLTileLayer from "ol/layer/WebGLTile"
import DataTileSource from "ol/source/DataTile"
import { ModelOutputCache } from "../map_view"
import { BooleanTileGrid, CategoricalTileGrid, NumericTileGrid } from "../modelling/tile_grid"
import { ModelOutputLayer } from "../state"
import colormap from "colormap"
import distinctColors from "distinct-colors"

class ModelOutputSource extends DataTileSource {
  readonly tileLayer: BooleanTileGrid | NumericTileGrid | CategoricalTileGrid

  constructor(tileLayer: BooleanTileGrid | NumericTileGrid | CategoricalTileGrid) {
    super({
      loader: (z, x, y) => {

        const cat = tileLayer instanceof CategoricalTileGrid
        const [min, max] = (tileLayer instanceof NumericTileGrid || tileLayer instanceof CategoricalTileGrid) ? tileLayer.getMinMax() : [0, 1]

        const image = new Float32Array(256 * 256)
        for (let pixelX = 0; pixelX < 256; ++pixelX) {
          for (let pixelY = 0; pixelY < 256; ++pixelY) {
            const tileX = (x + (pixelX / 256)) * Math.pow(2, tileLayer.zoom - z)
            const tileY = (y + (pixelY / 256)) * Math.pow(2, tileLayer.zoom - z)
            const tile = tileLayer.get(tileX, tileY)
            const val = typeof tile === "number" ? tile : (tile ? 1 : 0)
            if (cat) {
              if (val > max) {
                image[pixelY * 256 + pixelX] = 0
              } else {
                image[pixelY * 256 + pixelX] = val
              }
            } else {
              image[pixelY * 256 + pixelX] = (val - min) / (max - min)
            }
          }
        }
        return image
      },
      maxZoom: tileLayer.zoom,
      bandCount: 1,
      transition: 0,
    })
    this.tileLayer = tileLayer
  }
}
export function getColorStops(name: string, steps: number): any[] {

  const delta = (0 - 1) / (steps - 1)
  const stops: Array<any> = []
  const colors = colormap({ colormap: name, nshades: steps, format: 'rgba' }).reverse()


  for (let i = 0; i < steps; i++) {
    stops.push(1 + i * delta)
    stops.push(colors[i])
  }

  return stops
}

export function getCatColorStops(palette: chroma.Color[] | undefined, n: number): any[] {

  const arr: Array<any> = []

  arr.push('case')

  for (let key = n; key >= 1; key--) {
    arr.push(['>=', ['band', 1], key])

    let rgba = palette ? palette[key - 1].rgba() : [0, 0, 0, 0]    // retreve colour based on key and style option, custom colours? 

    if (false) rgba[3] = 0            // if unchecked set A value to 0

    arr.push(rgba)

  }
  arr.push([0, 0, 0, 0])              // for cat data, 0 == no value,  hence fully opaque

  return arr

}

const styleOutputCache: Map<number, string> = new Map()

export function reifyModelOutputLayer(layer: ModelOutputLayer, existingLayer: BaseLayer | null, modelOutputCache: ModelOutputCache) {
  if (!(layer.nodeId in modelOutputCache)) {
    return new TileLayer()
  }

  const tileLayer = modelOutputCache[layer.nodeId]

  if (tileLayer instanceof CategoricalTileGrid && layer.colors?.length !== tileLayer.getMinMax()[1]) {
    layer.colors = distinctColors({
      count: tileLayer.getMinMax()[1]
    })
  }


  if (existingLayer instanceof WebGLTileLayer) {
    const source = existingLayer.getSource()

    if (source instanceof ModelOutputSource && source.tileLayer === tileLayer && styleOutputCache.get(layer.nodeId) === layer.fill) {
      return existingLayer
    }
  }

  styleOutputCache.set(layer.nodeId, layer.fill)

  let color: any[] = []

  if (tileLayer instanceof CategoricalTileGrid) {

    color = getCatColorStops(layer.colors, tileLayer.getMinMax()[1])

  } else {


    const [min, max] = (tileLayer instanceof NumericTileGrid) ? tileLayer.getMinMax() : [0, 1]
    const v0 = (0 - min) / (max - min)

    color = [
      'case',
      ['==', ['band', 1], v0],
      [0, 0, 0, 0],
      ['interpolate',
        ['linear'],
        ['band', 1],
        ...getColorStops(layer.fill === "heatmap" ? "jet" : (layer.fill === "greyscale" ? "greys" : layer.fill), 100)]
    ]


  }

  return new WebGLTileLayer({
    source: new ModelOutputSource(tileLayer),
    style: {
      color,
    },
  })
}
