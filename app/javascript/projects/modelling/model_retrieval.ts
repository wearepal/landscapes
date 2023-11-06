

import * as GeoTIFF from 'geotiff/dist-browser/geotiff'

export async function retrieveModelData(extent: any, source: string, tileRange: any) {

    const geoserver = "https://landscapes.wearepal.ai/geoserver/"
    const [width, height] = [tileRange.getWidth(), tileRange.getHeight()]
    const bbox = `${extent.join(",")},EPSG:3857`

    const response = await fetch(
        geoserver + "wms?" +
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
    const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer)


    return tiff

}

export async function retrieveModelDataWCS(extent: any, source: string, tileRange: any) {

    const geoserver = "https://landscapes.wearepal.ai/geoserver/"
    const [width, height] = [tileRange.getWidth(), tileRange.getHeight()]
    const bbox = `${extent.join(",")},EPSG:3857`

    const response = await fetch(
        geoserver + "wcs?" +
        new URLSearchParams(
            {
                service: "WCS",
                version: "1.1.1",
                request: "GetCoverage",
                identifier: source,
                format: "image/geotiff",
                transparent: "true",
                WIDTH: width,
                HEIGHT: height,
                crs: "EPSG:3857",
                BoundingBox: bbox
            }
        )
    )

    const arrayBuffer = await response.arrayBuffer()
    const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer)


    return tiff

}
