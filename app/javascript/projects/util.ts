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
