import * as GeoTIFF from 'geotiff/dist-browser/geotiff'
import { Extent } from 'ol/extent'
import { bboxFromExtent } from './bounding_box'
import { ProjectProperties } from './components'
import { GeoJSON } from "ol/format"
import { Geometry } from 'ol/geom'
import { Feature } from 'ol'
import { simplify } from 'topojson-simplify'
import { presimplify } from 'topojson-simplify'
import { topology } from 'topojson-server'
import { feature } from 'topojson-client'
import { Topology, Objects } from 'topojson-specification'

async function simplifyFeatures(features: GeoJSON.FeatureCollection) {
    const topo = topology({ layer: features }) as Topology<Objects<{}>>;
    const presimp = presimplify(topo);
    const simp = simplify(presimp, 0.00001);
    return simp;
}  

export async function retrieveWFSData(source: string, projectProps: ProjectProperties) : Promise<Feature<Geometry>[]> {
    
    const response = await fetch(
        "https://landscapes.wearepal.ai/geoserver/wfs?" +
        new URLSearchParams(
          {
            outputFormat: 'application/json',
            request: 'GetFeature',
            typeName: source,
            srsName: 'EPSG:3857',
            bbox : bboxFromExtent(projectProps.extent),
          }
        )
    )

    const features = new GeoJSON().readFeatures(await response.json())
    
    // Convert OpenLayers features to GeoJSON format
    const geoJsonFormat = new GeoJSON();
    const geoJsonObject = JSON.parse(geoJsonFormat.writeFeatures(features));
    
    const simp = await simplifyFeatures(geoJsonObject)
    
    // Convert TopoJSON back to GeoJSON
    const geoJson = feature(simp, simp.objects.layer);
    const simplifiedFeatures = new GeoJSON().readFeatures(geoJson)

    return simplifiedFeatures
}

// Returns a GeoTIFF object from a WMS server. Useful for some categorical/boolean data but may be susceptible to data loss. Fatest option usually
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

// Returns a GeoTIFF object from a WCS server. Useful for continuous data but may be slower.
export async function retrieveModelDataWCS(extent: Extent, source: string, tileRange: any, externalLink?: string) {

    // Uses WCS server: Returns raw data

    const geoserver = externalLink ?? "https://landscapes.wearepal.ai/geoserver/"
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

// For interaction with ISRIC SoilGrids API
export async function retrieveISRICData(extent: Extent, coverageId: string, map: string, tileRange: any) {

    const server = `https://maps.isric.org/mapserv?map=/map/${map}.map&`
    const [width, height] = [tileRange.getWidth(), tileRange.getHeight()]
    const response = await fetch(
        server + new URLSearchParams(
            {
                service: 'WCS',
                version: '1.0.0',
                request: 'GetCoverage',
                COVERAGE: coverageId,
                FORMAT: 'GEOTIFF_INT16',
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