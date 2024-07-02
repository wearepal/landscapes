import { Socket } from "rete"
import { SelectControlOptions } from "./controls/select"
import { categoricalDataSocket, numericDataSocket, booleanDataSocket } from "./socket_types"


interface SoilGridOptions {
    SCOId : number
    name : string
    map: string
    coverageId: string
    outputSocket: Socket
}

// Soil types from the World Reference Base for Soil Resources, used for labelling cat data
export const ERBSoilTypes = [
    "Acrisols",
    "Albeluvisols",
    "Alisols",
    "Andosols",
    "Arenosols",
    "Calcisols",
    "Cambisols",
    "Chernozems",
    "Cryosols",
    "Durisols",
    "Ferralsols",
    "Fluvisols",
    "Gleysols",
    "Gypsisols",
    "Histosols",
    "Kastanozems",
    "Leptosols",
    "Lixisols",
    "Luvisols",
    "Nitisols",
    "Phaeozems",
    "Planosols",
    "Plinthosols",
    "Podzols",
    "Regosols",
    "Solonchaks",
    "Solonetz",
    "Stagnosols",
    "Umbrisols",
    "Vertisols"
]

// Categories for SoilGrids
export const SoilGrids : SelectControlOptions[] = [
    { id: 0, name: 'WRB (most probable)'},
    { id: 1, name: 'WRB (probability)' },
    { id: 2, name: 'Soil Organic Carbon Stock'},
    { id: 3, name: 'Soil Organic Carbon Density'},
    { id: 4, name: 'Soil Organic Carbon Content'},
    { id: 5, name: 'Bulk Density'},
    { id: 6, name: 'Cation Exchange Capacity at ph 7'},
    { id: 7, name: 'Coarse fragments volumetric'},
    { id: 8, name: 'Clay content'},
    { id: 9, name: 'Nitrogen'},
    { id: 10, name: 'Soil pH in H2O'},
    { id: 11, name: 'Sand content'},
    { id: 12, name: 'Silt content'},
    { id: 13, name: 'Water Layer wv1500'},
    { id: 14, name: 'Water Layer wv0033'},
    { id: 15, name: 'Water Layer wv0010'},
]

// Filters for SoilGrids
export const SoilGridOptions : SoilGridOptions[] = [
    {
        SCOId: 0,
        name: 'All',
        map: 'wrb',
        coverageId: 'MostProbable',
        outputSocket: categoricalDataSocket
    },
    {
        SCOId: 2,
        name: 'Mean (<30cm)',
        map: 'ocs',
        coverageId: 'ocs_0-30cm_mean',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 2,
        name: 'Q0.05 (<30cm)',
        map: 'ocs',
        coverageId: 'ocs_0-30cm_Q0.05',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 2,
        name: 'Q0.5 (<30cm)',
        map: 'ocs',
        coverageId: 'ocs_0-30cm_Q0.5',
        outputSocket: numericDataSocket
    
    },
    {
        SCOId: 2,
        name: 'Q0.95 (<30cm)',
        map: 'ocs',
        coverageId: 'ocs_0-30cm_Q0.95',
        outputSocket: numericDataSocket
    
    },
    {
        SCOId: 2,
        name: 'Uncertainty (<30cm)',
        map: 'ocs',
        coverageId: 'ocs_0-30cm_uncertainty',
        outputSocket: numericDataSocket
    }

]

const ranges = [0, 5, 15, 30, 60, 100, 200]
const maps = ['ocd', 'soc', 'bdod', 'cec', 'cfvo', 'clay', 'nitrogen', 'phh2o', 'sand', 'silt', 'wv1500', 'wv0033', 'wv0010']

for(let i = 0; i < ranges.length - 1; i++) {
    const range = `${ranges[i]}-${ranges[i+1]}cm`
    maps.forEach((map, x) => {
        SoilGridOptions.push({
            SCOId: 3+x,
            name: `Mean (${i === 0 ? '<5cm' : range})`,
            map,
            coverageId: `${map}_${range}_mean`,
            outputSocket: numericDataSocket
        })
        SoilGridOptions.push({
            SCOId: 3+x,
            name: `Q0.05 (${i === 0 ? '<5cm' : range})`,
            map,
            coverageId: `${map}_${range}_Q0.05`,
            outputSocket: numericDataSocket
        })
        SoilGridOptions.push({
            SCOId: 3+x,
            name: `Q0.5 (${i === 0 ? '<5cm' : range})`,
            map,
            coverageId: `${map}_${range}_Q0.5`,
            outputSocket: numericDataSocket
        })
        SoilGridOptions.push({
            SCOId: 3+x,
            name: `Q0.95 (${i === 0 ? '<5cm' : range})`,
            map,
            coverageId: `${map}_${range}_Q0.95`,
            outputSocket: numericDataSocket
        })
        SoilGridOptions.push({
            SCOId: 3+x,
            name: `Uncertainty (${i === 0 ? '<5cm' : range})`,
            map,
            coverageId: `${map}_${range}_uncertainty`,
            outputSocket: numericDataSocket
        })
    })
}

// Adding entry for each WRB classifcation
ERBSoilTypes.forEach((soilType, index) => {
    SoilGridOptions.push({
        SCOId: 0,
        name: soilType,
        map: 'wrb',
        coverageId: 'MostProbable',
        outputSocket: booleanDataSocket
    })
    SoilGridOptions.push({
        SCOId: 1,
        name: soilType,
        map: 'wrb',
        coverageId: soilType,
        outputSocket: numericDataSocket
    
    })
})