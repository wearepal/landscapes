import { Socket } from "rete"
import { booleanDataSocket } from "./socket_types"

// future work: we might source designations externally, add external source data here and update DesignationComponent.ts & reify_layer/shapefile.ts accordingly

export interface Designation {
    id: number
    value: string
    socket: Socket
    name: string
    identifier: string
    fill: [number, number, number, number]
    stroke: [number, number, number, number]
    attribution?: string
}

// Designations available from both the Model and Map view, add new designations here to make them available in both views

export const designations : Designation[] = [
    {  
        id: 1,
        value: "AONB",
        socket: booleanDataSocket,
        name: "Areas of Outstanding Natural Beauty (AONB)",
        identifier: "shapefiles:AONB_UK",
        fill: [0, 155, 0, 1],
        stroke: [0, 0, 0, 1]
    },
    {
        id: 2,
        value: "SSSI",
        socket: booleanDataSocket,
        name: "Sites of Special Scientific Interest (SSSI)",
        identifier: "shapefiles:SSSI_UK",
        fill: [255, 0, 0, 1],
        stroke: [0, 0, 0, 1]
    },
    {
        id: 3,
        value: "NNR",
        socket: booleanDataSocket,
        name: "National Nature Reserves",
        identifier: "shapefiles:NNR_UK",
        fill: [42, 161, 79, 1],
        stroke: [0, 0, 0, 1]
    },
    {
        id: 4,
        value: "LNR",
        socket: booleanDataSocket,
        name: "Local Nature Reserves",
        identifier: "shapefiles:LNR_ENG",
        fill: [27, 174, 196, 1],
        stroke: [0, 0, 0, 1]
    },
    {
        id: 5,
        value: "NP",
        socket: booleanDataSocket,
        name: "National Parks",
        identifier: "shapefiles:NP_ENG",
        fill: [255, 255, 0, 1],
        stroke: [0, 0, 0, 1]
    },
    {
        id: 6,
        value: "SAC",
        socket: booleanDataSocket,
        name: "Special Areas of Conservation (SAC)",
        identifier: "shapefiles:SAC_ENG",
        fill: [198, 3, 252, 1],
        stroke: [0, 0, 0, 1]
    },
    {
        id: 7,
        value: "SPA",
        socket: booleanDataSocket,
        name: "Ramsar Sites",
        identifier: "shapefiles:ramsar_eng",
        fill: [0, 60, 110, 1],
        stroke: [0, 0, 0, 1]
    },
    {
        id: 8,
        value: "AW",
        socket: booleanDataSocket,
        name: "Ancient Woodland",
        identifier: "shapefiles:aw_eng",
        fill: [252, 186, 3, 1],
        stroke: [0, 0, 0, 1],
        attribution: '&copy; <a href="https://naturalengland-defra.opendata.arcgis.com/datasets/Defra::ancient-woodland-england/about">Natural England</a>'
    }
]