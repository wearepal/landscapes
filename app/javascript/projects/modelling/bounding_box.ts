
//TODO: Make this customisable

import { Extent, getArea } from "ol/extent"
import { createXYZ } from "ol/tilegrid"
import * as proj4 from "proj4"
import { BooleanTileGrid, TileGridJSON, fromJSON } from "./tile_grid"
import { GeoJSON } from "ol/format"
import { Tile } from "ol"

const westHorsely = [-49469.089243, 6669018.450996]
const bexhill = [55641.379277, 6570068.329224]

const crawley = [-20839.008676500813, 6640614.986501137]
const seaford = [12889.487811, 6579722.087031]

export const EPSG4326 = 'EPSG:4326'
export const EPSG3857 = 'EPSG:3857'

// Crawley: -20839.008676500813, 6640614.986501137
// Seaford: 12889.487811, 6579722.087031

// original extent = GREATER WAKEHURST
export const oldExtent = [-20839.008676500813, 6579722.087031, 12889.487811, 6640614.986501137]

// default extent = west horsely to english channel, inline with bexhill - CENTRAL SUSSEX
export const currentExtent = [-49469.089243, 6570068.329224, 55641.379277, 6669018.450996]

//legacy static bbox
export const currentBbox = `${currentExtent.join(",")},EPSG:3857`

//legacy static zoom level
export const zoomLevel = 20

// WIP: Sets global zoom level from extent, requires tweaking and tests
export function zoomFromExtent(extent: Extent, maxtiles: number): number {
    const tileGrid = createXYZ()
    const zoomLevels = Array.from({ length: 30 }, (_, index) => index + 1).reverse()
    
    for (const zoom of zoomLevels){
        const tiles = tileGrid.getTileRangeForExtentAndZ(extent, zoom)
        const tileCount = tiles.getWidth() * tiles.getHeight()
        if(tileCount <= maxtiles){
            return zoom
        }
    }

    return 0

}

export function WKTfromExtent(extent: Extent): string {
    
    const transform = (proj4 as any).default(EPSG3857, EPSG4326)
    
    const extent4326 = [
        transform.forward([extent[0], extent[1]])[0],
        transform.forward([extent[0], extent[1]])[1],
        transform.forward([extent[2], extent[3]])[0],
        transform.forward([extent[2], extent[3]])[1],
    ]

    return `POLYGON((
        ${extent4326[0]} ${extent4326[1]},
        ${extent4326[0]} ${extent4326[3]},
        ${extent4326[2]} ${extent4326[3]},
        ${extent4326[2]} ${extent4326[1]},
        ${extent4326[0]} ${extent4326[1]}
    ))`
}

// Required format for some requests
export function bboxFromExtent(extent: Extent): string {
    return `${extent.join(",")},EPSG:3857`
}

const maskMap = new Map<string, BooleanTileGrid>()

export async function maskFromExtentAndShape(extent: Extent, zoom: number, shapeLayer: string, shapeId: string, maskMode: boolean = false): Promise<BooleanTileGrid> {
    const id = `${shapeLayer}${shapeId}`
    if(maskMap.has(id)) return maskMap.get(id) as BooleanTileGrid
    else{
        const cachedMask = await loadMask(id)
        if(cachedMask !== null) {
            maskMap.set(id, cachedMask)
            return cachedMask
        }else{

            const tileGrid = createXYZ()
            const outputTileRange = tileGrid.getTileRangeForExtentAndZ(extent, zoom)

            let mask = new BooleanTileGrid(
                zoom,
                outputTileRange.minX,
                outputTileRange.minY,
                outputTileRange.getWidth(),
                outputTileRange.getHeight(),
                !maskMode
            )

            if(!maskMode) return mask
            else{
                const response = await fetch(
                    "https://landscapes.wearepal.ai/geoserver/wfs?" +
                    new URLSearchParams(
                        {
                            outputFormat: 'application/json',
                            request: 'GetFeature',
                            typeName: shapeLayer,
                            srsName: 'EPSG:3857',
                            CQL_FILTER: shapeId
                        }
                    )
                )
                
                const features = new GeoJSON().readFeatures(await response.json())

                const len = mask.width * mask.height
                const seg = Math.ceil(len / 20)


                for (let feature of features) {
                    const geom = feature.getGeometry()
                    if (geom === undefined) { continue }
            
                    const featureTileRange = tileGrid.getTileRangeForExtentAndZ(
                        geom.getExtent(),
                        zoom
                    )

                    let i = 0
                    
                    for (
                    let x = Math.max(featureTileRange.minX, outputTileRange.minX);
                    x <= Math.min(featureTileRange.maxX, outputTileRange.maxX);
                    ++x
                    ) {
                    for (
                        let y = Math.max(featureTileRange.minY, outputTileRange.minY);
                        y <= Math.min(featureTileRange.maxY, outputTileRange.maxY);
                        ++y
                    ) {

                        // TODO: Add progress bar
                        if (i % seg === 0) {
                            console.log(Math.floor((i / len) * 100) + "%")
                        }

                        const center = tileGrid.getTileCoordCenter([zoom, x, y])
                        if (geom.intersectsCoordinate(center)) {
                            mask.set(x, y, true)
                        }

                        i++
                    }
                    }
                }

                maskMap.set(id, mask)
                saveMask(mask, id)

                return mask
            }
        }


    }
}

function saveMask(mask: BooleanTileGrid, id: string){
    id = id.replace(/'/g, "_")
    const json = mask.toJSON()
    const formData = new FormData()
    const blob = new Blob([JSON.stringify(json)], { type: "application/json" })
    formData.append('file', blob, 'mask.json')
    formData.append('name', id)
    const request = new XMLHttpRequest()
    request.open('POST', `/masks`)
    request.setRequestHeader('X-CSRF-Token', (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement).content)
    request.send(formData)
}

function loadMask(id: string): Promise<BooleanTileGrid | null> {
    id = id.replace(/'/g, "_")
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest()
        request.open('GET', `/masks?name=${id}`)
        
        const csrfTokenElement = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement
        if (csrfTokenElement) {
            request.setRequestHeader('X-CSRF-Token', csrfTokenElement.content)
        }

        request.onreadystatechange = () => {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    try {
                        const response = JSON.parse(request.responseText)
                        resolve(fromJSON(response as TileGridJSON) as BooleanTileGrid)
                    } catch (error) {
                        reject(error)
                    }
                } else {
                    resolve(null)
                }
            }
        };

        request.send()
    });
}
