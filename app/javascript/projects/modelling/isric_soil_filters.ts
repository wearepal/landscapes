import { Socket } from "rete"
import { SelectControlOptions } from "./controls/select"
import { categoricalDataSocket, numericDataSocket, booleanDataSocket } from "./socket_types"

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

interface SoilGridOptions {
    SCOId : number
    name : string
    map: string
    coverageId: string
    outputSocket: Socket
}

export const SoilGrids : SelectControlOptions[] = [
    { id: 0, name: 'WRB (most probable)'},
    { id: 1, name: 'WRB (probability)' },
    { id: 2, name: 'Soil Organic Carbon Stock'},
    { id: 3, name: 'Soil Organic Carbon Density'},
    { id: 4, name: 'Soil Organic Carbon Content'},
]

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
    },
    {
        SCOId: 3,
        name: 'Mean (<5cm)',
        map: 'ocd',
        coverageId: 'ocd_0-5cm_mean',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 3,
        name: 'Q0.05 (<5cm)',
        map: 'ocd',
        coverageId: 'ocd_0-5cm_Q0.05',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 3,
        name: 'Q0.5 (<5cm)',
        map: 'ocd',
        coverageId: 'ocd_0-5cm_Q0.5',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 3,
        name: 'Q0.95 (<5cm)',
        map: 'ocd',
        coverageId: 'ocd_0-5cm_Q0.95',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 3,
        name: 'Uncertainty (<5cm)',
        map: 'ocd',
        coverageId: 'ocd_0-5cm_uncertainty',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 3,
        name: 'Mean (5-15cm)',
        map: 'ocd',
        coverageId: 'ocd_5-15cm_mean',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 3,
        name: 'Q0.05 (5-15cm)',
        map: 'ocd',
        coverageId: 'ocd_5-15cm_Q0.05',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 3,
        name: 'Q0.5 (5-15cm)',
        map: 'ocd',
        coverageId: 'ocd_5-15cm_Q0.5',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 3,
        name: 'Q0.95 (5-15cm)',
        map: 'ocd',
        coverageId: 'ocd_5-15cm_Q0.95',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 3,
        name: 'Uncertainty (5-15cm)',
        map: 'ocd',
        coverageId: 'ocd_5-15cm_uncertainty',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 3,
        name: 'Mean (15-30cm)',
        map: 'ocd',
        coverageId: 'ocd_15-30cm_mean',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 3,
        name: 'Q0.05 (15-30cm)',
        map: 'ocd',
        coverageId: 'ocd_15-30cm_Q0.05',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 3,
        name: 'Q0.5 (15-30cm)',
        map: 'ocd',
        coverageId: 'ocd_15-30cm_Q0.5',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 3,
        name: 'Q0.95 (15-30cm)',
        map: 'ocd',
        coverageId: 'ocd_15-30cm_Q0.95',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 3,
        name: 'Uncertainty (15-30cm)',
        map: 'ocd',
        coverageId: 'ocd_15-30cm_uncertainty',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 3,
        name: 'Mean (30-60cm)',
        map: 'ocd',
        coverageId: 'ocd_30-60cm_mean',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 3,
        name: 'Q0.05 (30-60cm)',
        map: 'ocd',
        coverageId: 'ocd_30-60cm_Q0.05',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 3,
        name: 'Q0.5 (30-60cm)',
        map: 'ocd',
        coverageId: 'ocd_30-60cm_Q0.5',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 3,
        name: 'Q0.95 (30-60cm)',
        map: 'ocd',
        coverageId: 'ocd_30-60cm_Q0.95',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 3,
        name: 'Uncertainty (30-60cm)',
        map: 'ocd',
        coverageId: 'ocd_30-60cm_uncertainty',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 3,
        name: 'Mean (60-100cm)',
        map: 'ocd',
        coverageId: 'ocd_60-100cm_mean',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 3,
        name: 'Q0.05 (60-100cm)',
        map: 'ocd',
        coverageId: 'ocd_60-100cm_Q0.05',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 3,
        name: 'Q0.5 (60-100cm)',
        map: 'ocd',
        coverageId: 'ocd_60-100cm_Q0.5',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 3,
        name: 'Q0.95 (60-100cm)',
        map: 'ocd',
        coverageId: 'ocd_60-100cm_Q0.95',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 3,
        name: 'Uncertainty (60-100cm)',
        map: 'ocd',
        coverageId: 'ocd_60-100cm_uncertainty',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 3,
        name: 'Mean (100-200cm)',
        map: 'ocd',
        coverageId: 'ocd_100-200cm_mean',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 3,
        name: 'Q0.05 (100-200cm)',
        map: 'ocd',
        coverageId: 'ocd_100-200cm_Q0.05',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 3,
        name: 'Q0.5 (100-200cm)',
        map: 'ocd',
        coverageId: 'ocd_100-200cm_Q0.5',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 3,
        name: 'Q0.95 (100-200cm)',
        map: 'ocd',
        coverageId: 'ocd_100-200cm_Q0.95',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 3,
        name: 'Uncertainty (100-200cm)',
        map: 'ocd',
        coverageId: 'ocd_100-200cm_uncertainty',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 4,
        name: 'Mean (<5cm)',
        map: 'soc',
        coverageId: 'soc_0-5cm_mean',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 4,
        name: 'Q0.05 (<5cm)',
        map: 'soc',
        coverageId: 'soc_0-5cm_Q0.05',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 4,
        name: 'Q0.5 (<5cm)',
        map: 'soc',
        coverageId: 'soc_0-5cm_Q0.5',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 4,
        name: 'Q0.95 (<5cm)',
        map: 'soc',
        coverageId: 'soc_0-5cm_Q0.95',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 4,
        name: 'Uncertainty (<5cm)',
        map: 'soc',
        coverageId: 'soc_0-5cm_uncertainty',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 4,
        name: 'Mean (5-15cm)',
        map: 'soc',
        coverageId: 'soc_5-15cm_mean',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 4,
        name: 'Q0.05 (5-15cm)',
        map: 'soc',
        coverageId: 'soc_5-15cm_Q0.05',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 4,
        name: 'Q0.5 (5-15cm)',
        map: 'soc',
        coverageId: 'soc_5-15cm_Q0.5',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 4,
        name: 'Q0.95 (5-15cm)',
        map: 'soc',
        coverageId: 'soc_5-15cm_Q0.95',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 4,
        name: 'Uncertainty (5-15cm)',
        map: 'soc',
        coverageId: 'soc_5-15cm_uncertainty',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 4,
        name: 'Mean (15-30cm)',
        map: 'soc',
        coverageId: 'soc_15-30cm_mean',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 4,
        name: 'Q0.05 (15-30cm)',
        map: 'soc',
        coverageId: 'soc_15-30cm_Q0.05',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 4,
        name: 'Q0.5 (15-30cm)',
        map: 'soc',
        coverageId: 'soc_15-30cm_Q0.5',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 4,
        name: 'Q0.95 (15-30cm)',
        map: 'soc',
        coverageId: 'soc_15-30cm_Q0.95',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 4,
        name: 'Uncertainty (15-30cm)',
        map: 'soc',
        coverageId: 'soc_15-30cm_uncertainty',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 4,
        name: 'Mean (30-60cm)',
        map: 'soc',
        coverageId: 'soc_30-60cm_mean',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 4,
        name: 'Q0.05 (30-60cm)',
        map: 'soc',
        coverageId: 'soc_30-60cm_Q0.05',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 4,
        name: 'Q0.5 (30-60cm)',
        map: 'soc',
        coverageId: 'soc_30-60cm_Q0.5',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 4,
        name: 'Q0.95 (30-60cm)',
        map: 'soc',
        coverageId: 'soc_30-60cm_Q0.95',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 4,
        name: 'Uncertainty (30-60cm)',
        map: 'soc',
        coverageId: 'soc_30-60cm_uncertainty',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 4,
        name: 'Mean (60-100cm)',
        map: 'soc',
        coverageId: 'soc_60-100cm_mean',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 4,
        name: 'Q0.05 (60-100cm)',
        map: 'soc',
        coverageId: 'soc_60-100cm_Q0.05',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 4,
        name: 'Q0.5 (60-100cm)',
        map: 'soc',
        coverageId: 'soc_60-100cm_Q0.5',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 4,
        name: 'Q0.95 (60-100cm)',
        map: 'soc',
        coverageId: 'soc_60-100cm_Q0.95',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 4,
        name: 'Uncertainty (60-100cm)',
        map: 'soc',
        coverageId: 'soc_60-100cm_uncertainty',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 4,
        name: 'Mean (100-200cm)',
        map: 'soc',
        coverageId: 'soc_100-200cm_mean',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 4,
        name: 'Q0.05 (100-200cm)',
        map: 'soc',
        coverageId: 'soc_100-200cm_Q0.05',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 4,
        name: 'Q0.5 (100-200cm)',
        map: 'soc',
        coverageId: 'soc_100-200cm_Q0.5',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 4,
        name: 'Q0.95 (100-200cm)',
        map: 'soc',
        coverageId: 'soc_100-200cm_Q0.95',
        outputSocket: numericDataSocket
    },
    {
        SCOId: 4,
        name: 'Uncertainty (100-200cm)',
        map: 'soc',
        coverageId: 'soc_100-200cm_uncertainty',
        outputSocket: numericDataSocket
    }
]

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