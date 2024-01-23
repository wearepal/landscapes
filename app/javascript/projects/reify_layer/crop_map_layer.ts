import BaseLayer from "ol/layer/Base";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import { CropMapLayer } from "../state";
import { memoize } from "lodash";


const getTileLayer = memoize((year: number) => {
    return new TileWMS({
        url: `https://environment.data.gov.uk/spatialdata/crop-map-of-england-${year}/wms`,
        params: { "TILED": true, "LAYERS": year != 2021 ? `Crop_Map_Of_England_${year}` : `Crop_Map_of_England_2021_East_Sussex,Crop_Map_of_England_2021_West_Sussex` },
        serverType: "mapserver",
    })
})

export function reifyCropMapLayer(layer: CropMapLayer, existingLayer: BaseLayer | null) {

    const source = getTileLayer(layer.year)

    if (existingLayer instanceof TileLayer && existingLayer.getSource() === source) {
        return existingLayer
    }

    return new TileLayer({ source, minZoom: 14 })
}
