
//TODO: Make this customisable

import { Extent, getArea } from "ol/extent"

const westHorsely = [-49469.089243, 6669018.450996]
const bexhill = [55641.379277, 6570068.329224]

const crawley = [-20839.008676500813, 6640614.986501137]
const seaford = [12889.487811, 6579722.087031]


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
export function zoomFromExtent(extent: Extent): number {
    const area = getArea(extent) / 100

    if(area < 5000000) return 23
    if(area < 10000000) return 22
    if(area < 100000000) return 21
    if(area < 100000000000) return 20
    
    return 18
}

// Required format for some requests
export function bboxFromExtent(extent: Extent): string {
    return `${extent.join(",")},EPSG:3857`
}