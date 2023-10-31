import BaseLayer from "ol/layer/Base";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import { CropMapLayer } from "../state";


export function reifyCropMapLayer(layer: CropMapLayer, existingLayer: BaseLayer | null) {

    const source = new TileWMS({
        url: `https://environment.data.gov.uk/spatialdata/crop-map-of-england-${layer.year}/wms`,
        params: { "TILED": true, "LAYERS": `Crop_Map_Of_England_${layer.year}` },
        serverType: "mapserver",
    })

    if (existingLayer instanceof TileLayer && existingLayer.getSource() === source) {
        return existingLayer
    }

    return new TileLayer({ source, minZoom: 14 })
}
