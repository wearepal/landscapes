import { createEmpty as createEmptyExtent, extend as extendExtent } from 'ol/extent'
import GeoJSON from 'ol/format/GeoJSON'
import GeometryType from 'ol/geom/GeometryType'
import { createXYZ } from 'ol/tilegrid'
import { BooleanTileGrid } from '../TileGrid'

export async function rasteriseOverlay(overlayId, zoom) {
  const response = await fetch(`/overlays/${overlayId}`)
  if (!response.ok) throw new Error()

  const json = await response.json()
  const features = new GeoJSON({ dataProjection: json.crs?.properties?.name, featureProjection: "EPSG:3857" }).readFeatures(json)

  const extent = features.reduce(
    (extent, feature) => extendExtent(extent, feature.getGeometry().getExtent()),
    createEmptyExtent()
  )

  const tileGrid = createXYZ()
  const outputTileRange = tileGrid.getTileRangeForExtentAndZ(extent, zoom)

  const result = new BooleanTileGrid(
      zoom,
      outputTileRange.minX, outputTileRange.minY,
      outputTileRange.getWidth(), outputTileRange.getHeight()
    )

  features.forEach(feature => {
    const geom = feature.getGeometry()
    if (geom.getType() === GeometryType.POINT) {
      const [, x, y] = tileGrid.getTileCoordForCoordAndZ(geom.getCoordinates(), zoom)
      result.set(x, y, true)
    }
    else {
      const featureTileRange = tileGrid.getTileRangeForExtentAndZ(geom.getExtent(), zoom)
      for (let x = featureTileRange.minX; x <= featureTileRange.maxX; ++x) {
        for (let y = featureTileRange.minY; y <= featureTileRange.maxY; ++y) {
          const point = tileGrid.getTileCoordCenter([zoom, x, y])
          if (geom.containsXY(point[0], point[1])) {
            result.set(x, y, true)
          }
        }
      }
    }
  })
  return result
}
