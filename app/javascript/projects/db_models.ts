export interface MapTileLayer {
  id: number
  name: string
  southWestExtent: number[]
  northEastExtent: number[]
  minZoom: number
  maxZoom: number
}

export interface DBModels {
  mapTileLayers: MapTileLayer[]
}
