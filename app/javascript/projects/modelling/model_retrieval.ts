

import * as GeoTIFF from 'geotiff/dist-browser/geotiff'
import { Extent } from 'ol/extent'
import { bboxFromExtent } from './bounding_box'

export async function retrieveModelData(extent: Extent, source: string, tileRange: any, style?: string) {

    // Uses WMS server: Returns data between 0 and 255

    const geoserver = "https://landscapes.wearepal.ai/geoserver/"
    const [width, height] = [tileRange.getWidth(), tileRange.getHeight()]
    const bbox = bboxFromExtent(extent)

    const response = await fetch(
        geoserver + "wms?" +
        new URLSearchParams(
            {
                service: 'WMS',
                version: '1.3.0',
                request: 'GetMap',
                layers: source,
                styles: style || '',
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

export async function retrieveModelDataWCS(extent: Extent, source: string, tileRange: any) {

    // Uses WCS server: Returns raw data

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
                BBOX: extent.toString()
            }
        )
    )

    const arrayBuffer = await response.arrayBuffer()
    const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer)

    return tiff
}