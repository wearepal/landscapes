
//TODO: Make this customisable

const westHorsely = [-49469.089243, 6669018.450996]
const bexhill = [55641.379277, 6570068.329224]

const crawley = [-20839.008676500813, 6640614.986501137]
const seaford = [12889.487811, 6579722.087031]


// Crawley: -20839.008676500813, 6640614.986501137
// Seaford: 12889.487811, 6579722.087031
export const oldExtent = [-20839.008676500813, 6579722.087031, 12889.487811, 6640614.986501137]

//current extent = west horsely to english channel, inline with bexhill 
export const currentExtent = [-49469.089243, 6570068.329224, 55641.379277, 6669018.450996]

export const currentBbox = `${currentExtent.join(",")},EPSG:3857`
export const zoomLevel = 20