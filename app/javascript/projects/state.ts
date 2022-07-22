interface BaseLayer {
  name: string
  visible: boolean
  opacity: number
}

export interface OsmLayer extends BaseLayer {
  type: "OsmLayer"
}

export interface MapTileLayer extends BaseLayer {
  type: "MapTileLayer"
  id: number
}

export interface OverlayLayer extends BaseLayer {
  type: "OverlayLayer"
  id: number
  strokeWidth: number
  fillOpacity: number
}

export type Layer = OsmLayer | MapTileLayer | OverlayLayer

export interface Project {
  name: string
  layers: Record<number, Layer>
  allLayers: number[]
  selectedLayer?: number
}
