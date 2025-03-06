import { BaseComponent } from "./base_component"
import { Node, Output, Socket } from "rete"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { ProjectProperties } from "."
import { booleanDataSocket, numericDataSocket } from "../socket_types"
import { retrieveWFSData } from "../model_retrieval"
import { createXYZ } from "ol/tilegrid"
import { maskFromExtentAndShape } from "../bounding_box"
import { BooleanTileGrid, NumericTileGrid } from "../tile_grid"

interface KewTreeOption {
    id: number
    name: string
    socket: Socket
    fn: (broad_crowns: any, conif_crowns: any, QSM: any, projectProps: ProjectProperties, mask: BooleanTileGrid) => any
}

const kewTreeOptions : KewTreeOption[] = [
    {
        id: 0,
        name: 'Deciduous',
        socket: booleanDataSocket,
        fn: (broad_crowns, conif_crowns, QSM, projectProps, mask) => applyBooleanData(broad_crowns, conif_crowns, QSM, projectProps, "Deciduous", mask)
    },
    {
        id: 1,
        name: 'Coniferous',
        socket: booleanDataSocket,
        fn: (broad_crowns, conif_crowns, QSM, projectProps, mask) => applyBooleanData(broad_crowns, conif_crowns, QSM, projectProps, "Coniferous", mask)
    },
    {
        id: 2,
        name: 'Jucker AGB - distributed',
        socket: numericDataSocket,
        fn: (broad_crowns, conif_crowns, QSM, projectProps, mask) => applyNumericData(broad_crowns, conif_crowns, QSM, projectProps, "jckr_gb", mask, true)
    },
    {
        id: 3,
        name: 'Wakehurst AGB - distributed',
        socket: numericDataSocket,
        fn: (broad_crowns, conif_crowns, QSM, projectProps, mask) => applyNumericData(broad_crowns, conif_crowns, QSM, projectProps, "wake_gb", mask, true)
    },
    {
        id: 15, 
        name: 'Wakehurst AGB - distributed (filtered: Deciduous)',
        socket: numericDataSocket,
        fn: (broad_crowns, conif_crowns, QSM, projectProps, mask) => applyNumericData(broad_crowns, conif_crowns, QSM, projectProps, "wake_gb-d", mask, true)
    },
    {
        id: 16, 
        name: 'Wakehurst AGB - distributed (filtered: Coniferous)',
        socket: numericDataSocket,
        fn: (broad_crowns, conif_crowns, QSM, projectProps, mask) => applyNumericData(broad_crowns, conif_crowns, QSM, projectProps, "wake_gb-c", mask, true)
    },
    {
        id: 4,
        name: 'Jucker AGB',
        socket: numericDataSocket,
        fn: (broad_crowns, conif_crowns, QSM, projectProps, mask) => applyNumericData(broad_crowns, conif_crowns, QSM, projectProps, "jckr_gb", mask, false)
    },
    {
        id: 5,
        name: 'Wakehurst AGB',
        socket: numericDataSocket,
        fn: (broad_crowns, conif_crowns, QSM, projectProps, mask) => applyNumericData(broad_crowns, conif_crowns, QSM, projectProps, "jckr_gb", mask, false)
    },
    {
        id: 6,
        name: "Canopy Diameter",
        socket: numericDataSocket,
        fn: (broad_crowns, conif_crowns, QSM, projectProps, mask) => applyNumericData(broad_crowns, conif_crowns, QSM, projectProps, "canpy_d", mask, false)
    },
    {
        id: 7,
        name: "Height",
        socket: numericDataSocket,
        fn: (broad_crowns, conif_crowns, QSM, projectProps, mask) => applyNumericData(broad_crowns, conif_crowns, QSM, projectProps, "height", mask, false)
    },
    {
        id: 17,
        name: "Height (filtered: Deciduous)",
        socket: numericDataSocket,
        fn: (broad_crowns, conif_crowns, QSM, projectProps, mask) => applyNumericData(broad_crowns, conif_crowns, QSM, projectProps, "height_d", mask, false)  
    },
    {
        id: 18,
        name: "Height (filtered: Coniferous)",
        socket: numericDataSocket,
        fn: (broad_crowns, conif_crowns, QSM, projectProps, mask) => applyNumericData(broad_crowns, conif_crowns, QSM, projectProps, "height_c", mask, false)  
    },
    {
        id: 8,
        name: "p25",
        socket: numericDataSocket,
        fn: (broad_crowns, conif_crowns, QSM, projectProps, mask) => applyNumericData(broad_crowns, conif_crowns, QSM, projectProps, "p25", mask, false)
    },
    {
        id: 9,
        name: "p25 - distributed",
        socket: numericDataSocket,
        fn: (broad_crowns, conif_crowns, QSM, projectProps, mask) => applyNumericData(broad_crowns, conif_crowns, QSM, projectProps, "p25", mask, true)
    },
    {
        id: 10,
        name: "p75",
        socket: numericDataSocket,
        fn: (broad_crowns, conif_crowns, QSM, projectProps, mask) => applyNumericData(broad_crowns, conif_crowns, QSM, projectProps, "p75", mask, false)
    },
    {
        id: 11,
        name: "p75 - distributed",
        socket: numericDataSocket,
        fn: (broad_crowns, conif_crowns, QSM, projectProps, mask) => applyNumericData(broad_crowns, conif_crowns, QSM, projectProps, "p75", mask, true)
    },
    {
        id: 12,
        name: "QSM",
        socket: booleanDataSocket,
        fn: (broad_crowns, conif_crowns, QSM, projectProps, mask) => applyBooleanData(broad_crowns, conif_crowns, QSM, projectProps, "QSM", mask)
    },
    {
        id: 13,
        name: "QSM - AGB_qsm - distributed",
        socket: numericDataSocket,
        fn: (broad_crowns, conif_crowns, QSM, projectProps, mask) => applyNumericData(broad_crowns, conif_crowns, QSM, projectProps, "agb_qsm", mask, true)
    },
    {
        id: 14,
        name: "QSM - AGB_qsm - distributed (exclude = false)",
        socket: numericDataSocket,
        fn: (broad_crowns, conif_crowns, QSM, projectProps, mask) => applyNumericData(broad_crowns, conif_crowns, QSM, projectProps, "agb_qsm", mask, true, true)
    }

    
]

async function getCrownData(projectProps: ProjectProperties) {

    const Deciduous = await retrieveWFSData("kew:bl_crown", projectProps)
    const Coniferous = await retrieveWFSData("kew:conifer_crown", projectProps)
    const QSM = await retrieveWFSData("kew:QSM_canopy1", projectProps)


    return [Deciduous, Coniferous, QSM]
}

function applyBooleanData(broad_crowns: any, conif_crowns: any, QSM: any, projectProps: ProjectProperties, type: "Deciduous" | "Coniferous" | "QSM", mask: BooleanTileGrid) {


    let crowns 
    let subMask: undefined | BooleanTileGrid = undefined

    switch (type) {
        case "Deciduous":
            crowns = broad_crowns
            break
        case "Coniferous":
            crowns = conif_crowns
            break
        case "QSM":
            crowns = QSM
            subMask = applyBooleanData(broad_crowns, conif_crowns, QSM, projectProps, "Deciduous", mask)
            subMask.merge(applyBooleanData(broad_crowns, conif_crowns, QSM, projectProps, "Coniferous", mask))
            break

    }
    //const crowns = type === "Deciduous" ? broad_crowns : conif_crowns

    const tileGrid = createXYZ()
    const outputTileRange = tileGrid.getTileRangeForExtentAndZ(projectProps.extent, projectProps.zoom)
    const grid = new BooleanTileGrid(projectProps.zoom, outputTileRange.minX, outputTileRange.minY, outputTileRange.getWidth(), outputTileRange.getHeight())

    crowns.forEach((feature) => {

        const geom = feature.getGeometry()

        const featureTileRange = tileGrid.getTileRangeForExtentAndZ(
            geom.getExtent(),
            projectProps.zoom
        )

        grid.iterateOverTileRange(featureTileRange, (x, y) => {
            grid.set(x, y, grid.get(x, y) || (geom.intersectsCoordinate(tileGrid.getTileCoordCenter([projectProps.zoom, x, y])) && mask.get(x, y) && (subMask === undefined || subMask.get(x, y))))
        })

    })

    grid.name = type

    return grid
}

function applyNumericData(broad_crowns: any, conif_crowns: any, QSM: any, projectProps: ProjectProperties, type: "jckr_gb" | "wake_gb" | "height" | "canpy_d" | "p25" | "p75" | "agb_qsm" | "wake_gb-d" | "wake_gb-c" | "height_d" | "height_c", mask: BooleanTileGrid, distribute: boolean, excl: boolean = false) {

    let crowns: any = undefined
    switch (type) {
        case "agb_qsm":
            crowns = QSM
            break;
        case "wake_gb-d":
            crowns = broad_crowns
            type = "wake_gb"
            break;
        case "wake_gb-c":
            crowns = conif_crowns
            type = "wake_gb"
            break;
        case "height_c":
            crowns = conif_crowns
            type = "height"
            break;
        case "height_d":
            crowns = broad_crowns
            type = "height"
            break;
        default:
            crowns = [...broad_crowns, ...conif_crowns]
            break;
    }

    let subMask: undefined | BooleanTileGrid = undefined
    
    if(type === "agb_qsm"){
        subMask = applyBooleanData(broad_crowns, conif_crowns, QSM, projectProps, "QSM", mask)
    }

    const tileGrid = createXYZ()
    const outputTileRange = tileGrid.getTileRangeForExtentAndZ(projectProps.extent, projectProps.zoom)
    const grid = new NumericTileGrid(projectProps.zoom, outputTileRange.minX, outputTileRange.minY, outputTileRange.getWidth(), outputTileRange.getHeight())

    crowns.forEach((feature) => {

        if (excl && type === "agb_qsm" && feature.get("exclude") == true) return

        const geom = feature.getGeometry()
        const value = feature.get(type)

        const featureTileRange = tileGrid.getTileRangeForExtentAndZ(
            geom.getExtent(),
            projectProps.zoom
        )

        let val = NaN

        if (distribute){
            let n = 0
            // count number of tiles intersected
            grid.iterateOverTileRange(featureTileRange, (x, y) => {                
                if(((projectProps.zoom < 22) || geom.intersectsCoordinate(tileGrid.getTileCoordCenter([projectProps.zoom, x, y]))) && mask.get(x, y) && (subMask === undefined || subMask.get(x, y))) n++
            })
            // distribute value over tiles
            val = n > 0 ? value / n : NaN
        }else{
            val = value
        }

        grid.iterateOverTileRange(featureTileRange, (x, y) => {
            if (((projectProps.zoom < 22) || geom.intersectsCoordinate(tileGrid.getTileCoordCenter([projectProps.zoom, x, y]))) && mask.get(x, y) && (subMask === undefined || subMask.get(x, y))){

                const v = grid.get(x, y)
                grid.set(x, y, v ? v + val : val)

            }
        })

    })

    return grid
}

export class KewTreesComponent extends BaseComponent {
    projectProps: ProjectProperties
    broadCrowns: any
    conifCrowns: any
    QSM: any

    constructor(projectProps : ProjectProperties) {
        super("Wakehurst Trees")
        this.category = "Kew"
        this.projectProps = projectProps
    }

    async builder(node: Node) {
        kewTreeOptions.forEach(opt => {
            node.addOutput(new Output(opt.name, opt.name, opt.socket))
        })
    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
        if (this.broadCrowns === undefined || this.conifCrowns === undefined || this.QSM === undefined) {
            [this.broadCrowns, this.conifCrowns, this.QSM] = await getCrownData(this.projectProps)
        }


        const tileGrid = createXYZ()
        const outputTileRange = tileGrid.getTileRangeForExtentAndZ(this.projectProps.extent, this.projectProps.zoom)
        const mask = await maskFromExtentAndShape(this.projectProps.extent, this.projectProps.zoom, this.projectProps.maskLayer, this.projectProps.maskCQL, this.projectProps.mask)

        kewTreeOptions.filter(opt => node.outputs[opt.name].connections.length > 0).forEach(option => {
            outputs[option.name] = option.fn(this.broadCrowns, this.conifCrowns, this.QSM, this.projectProps, mask)
        })

    }


}