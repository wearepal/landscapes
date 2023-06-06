


import { fromArrayBuffer } from "geotiff"

export async function retrieveModelData(extent: any, source: string, tileRange: any) {

    const geoserver = "https://landscapes.wearepal.ai/geoserver/wms?"
    const [width, height] = [tileRange.getWidth(), tileRange.getHeight()]
    const bbox = `${extent.join(",")},EPSG:3857`

    const response = await fetch(
        geoserver +
        new URLSearchParams(
            {
                service: 'WMS',
                version: '1.3.0',
                request: 'GetMap',
                layers: source,
                styles: '',
                format: 'image/geotiff',
                transparent: 'true',
                width,
                height,
                crs: 'EPSG:3857',
                bbox
            }
        )
    )

    const arrayBuffer = await response.arrayBuffer()
    const tiff = await fromArrayBuffer(arrayBuffer)


    return tiff

}
