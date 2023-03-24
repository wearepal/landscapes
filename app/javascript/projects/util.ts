import { Extent } from "ol/extent"
import { Layer } from "./state"

export function createIconElement(iconName: string) {
  const result = document.createElement("i")
  result.classList.add("fas", `fa-${iconName}`)
  return result
}

export function iconForLayerType(type: Layer['type']) {
  switch (type) {
    case "OsmLayer":
    case "MapTileLayer":
      return "fa-image"
    case "OverlayLayer":
      return "fa-draw-polygon"
    default:
      return "fa-layer-group"
  }
}

export function mergeExtents(a: Extent, b: Extent): Extent {
  return [
    Math.min(a[0], b[0]),
    Math.min(a[1], b[1]),
    Math.max(a[2], b[2]),
    Math.max(a[3], b[3]),
  ]
}

export function intersectExtents(a: Extent, b: Extent): Extent {
  return [
    Math.max(a[0], b[0]),
    Math.max(a[1], b[1]),
    Math.min(a[2], b[2]),
    Math.min(a[3], b[3]),
  ]
}
