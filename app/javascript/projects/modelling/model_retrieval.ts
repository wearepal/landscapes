

import * as GeoTIFF from 'geotiff/dist-browser/geotiff'

export async function retrieveModelData(extent: any, source: string, tileRange: any) {

    // Uses WMS server: Unsuitable for certain raster data

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

    // WIP: Uses WCS server

    const geoserver = "https://landscapes.wearepal.ai/geoserver/"
    const [width, height] = [tileRange.getWidth(), tileRange.getHeight()]

    const response = await fetch(
        geoserver + "wcs?" +
        new URLSearchParams(
            {
                service: 'WCS',
                version: '1.0.0',
                request: 'GetCoverage',
                COVERAGE: source,
                FORMAT: 'image/geotiff',
                WIDTH: width,
                HEIGHT: height,
                CRS: 'EPSG:3857',
                RESPONSE_CRS: 'EPSG:3857',
                BBOX: extent
            }
        )
    )

    const arrayBuffer = await response.arrayBuffer()
    const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer)

    return tiff
}