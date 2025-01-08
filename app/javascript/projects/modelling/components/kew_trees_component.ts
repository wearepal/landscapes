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
    fn: (broad_crowns: any, conif_crowns: any, projectProps: ProjectProperties, mask: BooleanTileGrid) => any
}

const kewTreeOptions : KewTreeOption[] = [
    {
        id: 0,
        name: 'Deciduous',
        socket: booleanDataSocket,
        fn: (broad_crowns, conif_crowns, projectProps, mask) => applyBooleanData(broad_crowns, conif_crowns, projectProps, "Deciduous", mask)
    },
    {
        id: 1,
        name: 'Coniferous',
        socket: booleanDataSocket,
        fn: (broad_crowns, conif_crowns, projectProps, mask) => applyBooleanData(broad_crowns, conif_crowns, projectProps, "Coniferous", mask)
    },
    {
        id: 2,
        name: 'Jucker AGB - distributed',
        socket: numericDataSocket,
        fn: (broad_crowns, conif_crowns, projectProps, mask) => applyNumericData(broad_crowns, conif_crowns, projectProps, "jckr_gb", mask, true)
    },
    {
        id: 3,
        name: 'Wakehurst AGB - distributed',
        socket: numericDataSocket,
        fn: (broad_crowns, conif_crowns, projectProps, mask) => applyNumericData(broad_crowns, conif_crowns, projectProps, "wake_gb", mask, true)
    },
    {
        id: 4,
        name: 'Jucker AGB',
        socket: numericDataSocket,
        fn: (broad_crowns, conif_crowns, projectProps, mask) => applyNumericData(broad_crowns, conif_crowns, projectProps, "jckr_gb", mask, false)
    },
    {
        id: 5,
        name: 'Wakehurst AGB',
        socket: numericDataSocket,
        fn: (broad_crowns, conif_crowns, projectProps, mask) => applyNumericData(broad_crowns, conif_crowns, projectProps, "jckr_gb", mask, false)
    },
    {
        id: 6,
        name: "Canopy Diameter",
        socket: numericDataSocket,
        fn: (broad_crowns, conif_crowns, projectProps, mask) => applyNumericData(broad_crowns, conif_crowns, projectProps, "canpy_d", mask, false)
    },
    {
        id: 7,
        name: "Height",
        socket: numericDataSocket,
        fn: (broad_crowns, conif_crowns, projectProps, mask) => applyNumericData(broad_crowns, conif_crowns, projectProps, "height", mask, false)
    },
    {
        id: 8,
        name: "p25",
        socket: numericDataSocket,
        fn: (broad_crowns, conif_crowns, projectProps, mask) => applyNumericData(broad_crowns, conif_crowns, projectProps, "p25", mask, false)
    },
    {
        id: 9,
        name: "p25 - distributed",
        socket: numericDataSocket,
        fn: (broad_crowns, conif_crowns, projectProps, mask) => applyNumericData(broad_crowns, conif_crowns, projectProps, "p25", mask, true)
    },
    {
        id: 10,
        name: "p75",
        socket: numericDataSocket,
        fn: (broad_crowns, conif_crowns, projectProps, mask) => applyNumericData(broad_crowns, conif_crowns, projectProps, "p75", mask, false)
    },
    {
        id: 11,
        name: "p75 - distributed",
        socket: numericDataSocket,
        fn: (broad_crowns, conif_crowns, projectProps, mask) => applyNumericData(broad_crowns, conif_crowns, projectProps, "p75", mask, true)
    },

    
]

async function getCrownData(projectProps: ProjectProperties) {

    const Deciduous = await retrieveWFSData("kew:bl_crown", projectProps)
    const Coniferous = await retrieveWFSData("kew:conifer_crown", projectProps)


    return [Deciduous, Coniferous]
}

function applyBooleanData(broad_crowns: any, conif_crowns: any, projectProps: ProjectProperties, type: "Deciduous" | "Coniferous", mask: BooleanTileGrid) {

    const crowns = type === "Deciduous" ? broad_crowns : conif_crowns

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
            grid.set(x, y, grid.get(x, y) || (geom.intersectsCoordinate(tileGrid.getTileCoordCenter([projectProps.zoom, x, y])) && mask.get(x, y)))
        })

    })

    grid.name = type

    return grid
}

function applyNumericData(broad_crowns: any, conif_crowns: any, projectProps: ProjectProperties, type: "jckr_gb" | "wake_gb" | "height" | "canpy_d" | "p25" | "p75", mask: BooleanTileGrid, distribute: boolean) {

    const crowns = [...broad_crowns, ...conif_crowns]

    const tileGrid = createXYZ()
    const outputTileRange = tileGrid.getTileRangeForExtentAndZ(projectProps.extent, projectProps.zoom)
    const grid = new NumericTileGrid(projectProps.zoom, outputTileRange.minX, outputTileRange.minY, outputTileRange.getWidth(), outputTileRange.getHeight())

    crowns.forEach((feature) => {

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
                if(geom.intersectsCoordinate(tileGrid.getTileCoordCenter([projectProps.zoom, x, y])) && mask.get(x, y)) n++
            })
            // distribute value over tiles
            val = n > 0 ? value / n : NaN
        }else{
            val = value
        }

        grid.iterateOverTileRange(featureTileRange, (x, y) => {
            if (geom.intersectsCoordinate(tileGrid.getTileCoordCenter([projectProps.zoom, x, y])) && mask.get(x, y)){

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
        if (this.broadCrowns === undefined || this.conifCrowns === undefined) {
            [this.broadCrowns, this.conifCrowns] = await getCrownData(this.projectProps)
        }


        const tileGrid = createXYZ()
        const outputTileRange = tileGrid.getTileRangeForExtentAndZ(this.projectProps.extent, this.projectProps.zoom)
        const mask = await maskFromExtentAndShape(this.projectProps.extent, this.projectProps.zoom, this.projectProps.maskLayer, this.projectProps.maskCQL, this.projectProps.mask)

        kewTreeOptions.filter(opt => node.outputs[opt.name].connections.length > 0).forEach(option => {
            outputs[option.name] = option.fn(this.broadCrowns, this.conifCrowns, this.projectProps, mask)
        })

    }


}