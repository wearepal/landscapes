import BaseLayer from "ol/layer/Base"
import TileLayer from "ol/layer/Tile"
import WebGLTileLayer from "ol/layer/WebGLTile"
import DataTileSource from "ol/source/DataTile"
import { DatasetCache, ModelOutputCache } from "../map_view"
import { BooleanTileGrid, CategoricalTileGrid, NumericTileGrid } from "../modelling/tile_grid"
import { DatasetLayer, Layer, ModelOutputLayer } from "../state"
import colormap from "colormap"
import distinctColors from "distinct-colors"

class ModelOutputSource extends DataTileSource {
  readonly tileLayer: BooleanTileGrid | NumericTileGrid | CategoricalTileGrid

  constructor(tileLayer: BooleanTileGrid | NumericTileGrid | CategoricalTileGrid, bounds: [number, number] | null) {
    super({
      loader: (z, x, y) => {


        const cat = tileLayer instanceof CategoricalTileGrid
        let [min, max] = [0, 1]

        if (tileLayer instanceof CategoricalTileGrid) {
          [min, max] = tileLayer.getMinMax()
        } else if (tileLayer instanceof NumericTileGrid) {
          [min, max] = bounds !== null ? bounds : tileLayer.getMinMax()
        }

        const image = new Float32Array(256 * 256)
        for (let pixelX = 0; pixelX < 256; ++pixelX) {
          for (let pixelY = 0; pixelY < 256; ++pixelY) {
            const tileX = (x + (pixelX / 256)) * Math.pow(2, tileLayer.zoom - z)
            const tileY = (y + (pixelY / 256)) * Math.pow(2, tileLayer.zoom - z)
            const tile = tileLayer.get(tileX, tileY)
            let val = typeof tile === "number" ? tile : (tile ? 1 : 0)
            if (cat) {
              if (val > max) {
                image[pixelY * 256 + pixelX] = 0
              } else {
                image[pixelY * 256 + pixelX] = val
              }
            } else {

              if (bounds) {
                if (val > max) val = max
                if (val < min) val = min
              }

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

export function getCatColorStops(palette: [number, number, number, number][] | undefined, n: number): any[] {

  const arr: Array<any> = []

  arr.push('case')

  for (let key = n; key >= 1; key--) {
    arr.push(['>=', ['band', 1], key])

    let rgba = palette ? palette[key - 1] : [0, 0, 0, 0]

    arr.push(rgba)

  }
  arr.push([0, 0, 0, 0])

  return arr

}


const styleOutputCache: Map<number, string> = new Map()
const catOutputCache: Map<number, [number, number, number, number][] | undefined> = new Map()
const boundsCache: Map<number, [boolean, [number, number] | undefined]> = new Map()

export function reifyModelOutputLayer(layer: ModelOutputLayer | DatasetLayer, existingLayer: BaseLayer | null, outputCache: ModelOutputCache | DatasetCache, loadteamDataset: (layer: DatasetLayer) => void) {

  // to avoid conflicts between model output and dataset layers, we use negative ids for model output layers
  const [ModelId, CacheId] = layer.type === "ModelOutputLayer" ? [layer.nodeId, layer.nodeId] : [layer.id, -layer.id]

  if (!(ModelId in outputCache)) {

    // in scenario that layers are saved and loaded, we need to ensure that the layer is loaded
    if (layer.type === "DatasetLayer") {
      loadteamDataset(layer)
    }

    return new TileLayer()
  }

  const tileLayer = outputCache[ModelId]

  if (tileLayer instanceof CategoricalTileGrid) {

    //if first time loading or n of variables has changed, update layer.colors.

    //if custom colors are added, add logic here to ensure these are not deleted

    if (layer.colors?.length !== tileLayer.getMinMax()[1]) {

      const cols = distinctColors({ count: tileLayer.getMinMax()[1] }).map(e => e.rgba())

      if (layer.colors === undefined) layer.colors = []

      for (let x = 0; x < tileLayer.getMinMax()[1]; x++) {
        layer.colors[x] = layer.colors[x] ?? cols[x]
      }

    }

  }

  if (existingLayer instanceof WebGLTileLayer) {
    const source = existingLayer.getSource()

    if (source instanceof ModelOutputSource &&
      source.tileLayer === tileLayer &&
      styleOutputCache.get(CacheId) === layer.fill &&
      catOutputCache.get(CacheId)?.toString() === layer.colors?.toString() &&
      boundsCache.get(CacheId)?.toString() === [layer.overrideBounds, layer.bounds].toString()) {
      return existingLayer
    }
  }

  styleOutputCache.set(CacheId, layer.fill)
  catOutputCache.set(CacheId, layer.colors)
  boundsCache.set(CacheId, [layer.overrideBounds, layer.bounds])

  let color: any[] = []

  if (tileLayer instanceof CategoricalTileGrid) {

    color = getCatColorStops(layer.colors, tileLayer.getMinMax()[1])

  } else {

    const [min, max] = (tileLayer instanceof NumericTileGrid) ? ((layer.overrideBounds && layer.bounds) ? layer.bounds : tileLayer.getMinMax()) : [0, 1]
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
    source: new ModelOutputSource(tileLayer, (layer.overrideBounds && layer.bounds) ? layer.bounds : null),
    style: {
      color,
    },
  })
}
