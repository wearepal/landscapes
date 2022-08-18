export interface MapTileLayer {
  id: number
  name: string
  southWestExtent: number[]
  northEastExtent: number[]
  minZoom: number
  maxZoom: number
}

export interface Overlay {
  id: number
  name: string
  colour: string
}

export interface DBModels {
  mapTileLayers: MapTileLayer[]
  overlays: Overlay[]
}
