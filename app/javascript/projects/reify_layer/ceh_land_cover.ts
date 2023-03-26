import BaseLayer from "ol/layer/Base";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";

const source = new TileWMS({
  url: "https://catalogue.ceh.ac.uk/maps/2ad19a50-b940-469e-a40d-17818b77020c",
  params: {"TILED": true, "LAYERS": "LC.10m.GB"},
  serverType: "geoserver",
})

export function reifyCehLandCoverLayer(existingLayer: BaseLayer | null) {
  if (existingLayer instanceof TileLayer && existingLayer.getSource() === source) {
    return existingLayer
  }

  return new TileLayer({ source })
}
