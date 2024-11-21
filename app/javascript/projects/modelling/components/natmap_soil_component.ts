import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { ProjectProperties } from "."
import { Node, Output, Socket } from "rete"
import { BaseComponent } from "./base_component"
import { SelectControlOptions } from "../controls/select"
import { numericDataSocket } from "../socket_types"
import { retrieveWFSData } from "../model_retrieval"
import { Feature } from "ol"
import { Geometry } from "ol/geom"
import { BooleanTileGrid, NumericTileGrid } from "../tile_grid"
import { createXYZ } from "ol/tilegrid"
import { maskFromExtentAndShape } from "../bounding_box"

interface NatmapSoilOptions extends SelectControlOptions {
    key: string
    socket: Socket
}

const natmap_outputs : NatmapSoilOptions[] = [
    {
        id: 0,
        name: 'MIN_STK_10',
        key: 'MIN_STK_10',
        socket: numericDataSocket
    },
    {
        id: 1,
        name: 'MAX_STK_10',
        key: 'MAX_STK_10',
        socket: numericDataSocket
    },
    {
        id: 2,
        name: 'MIN_STK_15',
        key: 'MIN_STK_15',
        socket: numericDataSocket
    },
    {
        id: 3,
        name: 'MAX_STK_15',
        key: 'MAX_STK_15',
        socket: numericDataSocket
    },
    {
        id: 4,
        name: 'MIN_STK_30',
        key: 'MIN_STK_30',
        socket: numericDataSocket
    },
    {
        id: 5,
        name: 'MAX_STK_30',
        key: 'MAX_STK_30',
        socket: numericDataSocket
    },
    {
        id: 6,
        name: 'AV_STK_30',
        key: 'AV_STK_30',
        socket: numericDataSocket
    },
    {
        id: 7,
        name: 'AV_STK_100',
        key: 'AV_STK_100',
        socket: numericDataSocket
    },
    {
        id: 8,
        name: 'AV_STK_150',
        key: 'AV_STK_150',
        socket: numericDataSocket
    },
    {
        id: 9,
        name: 'AV_OC_30',
        key: 'AV_OC_30',
        socket: numericDataSocket
    },
    {
        id: 10,
        name: 'MIN_OC_30',
        key: 'MIN_OC_30',
        socket: numericDataSocket
    },
    {
        id: 11,
        name: 'MAX_OC_30',
        key: 'MAX_OC_30',
        socket: numericDataSocket
    },
    {
        id: 12,
        name: 'AV_OC_100',
        key: 'AV_OC_100',
        socket: numericDataSocket
    },
    {
        id: 13,
        name: 'MIN_OC_100',
        key: 'MIN_OC_100',
        socket: numericDataSocket
    },
    {
        id: 14,
        name: 'MAX_OC_100',
        key: 'MAX_OC_100',
        socket: numericDataSocket
    },
    {
        id: 15,
        name: 'AV_OC_150',
        key: 'AV_OC_150',
        socket: numericDataSocket
    },
    {
        id: 16,
        name: 'MIN_OC_150',
        key: 'MIN_OC_150',
        socket: numericDataSocket
    },
    {
        id: 17,
        name: 'MAX_OC_150',
        key: 'MAX_OC_150',
        socket: numericDataSocket
    }

]

function applyFeaturesToGrid(features: Feature<Geometry>[], projectProps: ProjectProperties, prop: string, mask: BooleanTileGrid) : NumericTileGrid {

    const tileGrid = createXYZ()
    const outputTileRange = tileGrid.getTileRangeForExtentAndZ(projectProps.extent, projectProps.zoom)
    const grid = new NumericTileGrid(
        projectProps.zoom,
        outputTileRange.minX,
        outputTileRange.minY,
        outputTileRange.getWidth(),
        outputTileRange.getHeight()
    )

    for (let feature of features) {

        const geom = feature.getGeometry()
        if (geom === undefined) { continue }

        const val = feature.get(prop)
        if (val === undefined) { continue }

        const featureTileRange = tileGrid.getTileRangeForExtentAndZ(
            geom.getExtent(),
            projectProps.zoom
        )

        grid.iterateOverTileRange(featureTileRange, (x, y) => {
                const center = tileGrid.getTileCoordCenter([projectProps.zoom, x, y])

                if (geom.intersectsCoordinate(center)) {
                    grid.set(x, y, mask.get(x, y) ? val : NaN)
                }
            }
        )
    }

    return grid
}

export class NatmapSoilComponent extends BaseComponent {
    projectProps: ProjectProperties
    cachedFeatures: Feature<Geometry>[]
    cachedOutputs: Map<string, NumericTileGrid>

    constructor(projectProps: ProjectProperties) {
        super("NATMAP Soil")
        this.category = "Inputs"
        this.projectProps = projectProps
        this.cachedFeatures = []
        this.cachedOutputs = new Map()
    }

    async builder(node: Node) {
        natmap_outputs.forEach(opt => {
            node.addOutput(new Output(opt.key, opt.name, opt.socket))
        })
    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {

        this.cachedFeatures = this.cachedFeatures.length === 0 ? await retrieveWFSData('cranfield_soil:NATMAPcarbon', this.projectProps) : this.cachedFeatures

        const mask = await maskFromExtentAndShape(this.projectProps.extent, this.projectProps.zoom, this.projectProps.maskLayer, this.projectProps.maskCQL, this.projectProps.mask)
        
        natmap_outputs.filter(opt => node.outputs[opt.key].connections.length > 0).forEach(opt => {
            const res = this.cachedOutputs.has(opt.key) ? this.cachedOutputs.get(opt.key) : applyFeaturesToGrid(this.cachedFeatures, this.projectProps, opt.key, mask)
            this.cachedOutputs.set(opt.key, res as NumericTileGrid)
            outputs[opt.key] = res
        })

    }
}