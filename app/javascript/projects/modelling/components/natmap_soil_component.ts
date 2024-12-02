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
    unit: string
    min: number
    max: number
}

export const natmap_outputs : NatmapSoilOptions[] = [
    {
        id: 0,
        name: 'Min Carbon stock 0-10cm (kg/m²)',
        key: 'MIN_STK_10',
        socket: numericDataSocket,
        unit: 'kg/m^2',
        min: 0,
        max: 82.32000000000
    },
    {
        id: 1,
        name: 'Max Carbon stock 0-10cm (kg/m²)',
        key: 'MAX_STK_10',
        socket: numericDataSocket,
        unit: 'kg/m^2',
        min: 0,
        max: 95.13000000000
    },
    {
        id: 2,
        name: 'Min Carbon stock 0-15cm (kg/m²)',
        key: 'MIN_STK_15',
        socket: numericDataSocket,
        unit: 'kg/m^2',
        min: 0,
        max: 59.64000000000
    },
    {
        id: 3,
        name: 'Max Carbon stock 0-15cm (kg/m²)',
        key: 'MAX_STK_15',
        socket: numericDataSocket,
        unit: 'kg/m^2',
        min: 0,
        max: 59.64000000000
    },
    {
        id: 4,
        name: 'Min Carbon stock 0-30cm (kg/m²)',
        key: 'MIN_STK_30',
        socket: numericDataSocket,
        unit: 'kg/m^2',
        min: 0,
        max: 35.45000000000
    },
    {
        id: 5,
        name: 'Max Carbon stock 0-30cm (kg/m²)',
        key: 'MAX_STK_30',
        socket: numericDataSocket,
        unit: 'kg/m^2',
        min: 0,
        max: 63.23000000000
    },
    {
        id: 6,
        name: 'Average Carbon stock 0-30cm (kg/m²)',
        key: 'AV_STK_30',
        socket: numericDataSocket,
        unit: 'kg/m^2',
        min: 0,
        max: 51.07000000000
    },
    {
        id: 7,
        name: 'Average Carbon stock 30-100cm (kg/m²)',
        key: 'AV_STK_100',
        socket: numericDataSocket,
        unit: 'kg/m^2',
        min: 0,
        max: 86.19000000000
    },
    {
        id: 8,
        name: 'Average Carbon stock 100-150cm (kg/m²)',
        key: 'AV_STK_150',
        socket: numericDataSocket,
        unit: 'kg/m^2',
        min: 0,
        max: 59.64000000000
    },
    {
        id: 9,
        name: 'Average Organic Carbon 0-30cm (%)',
        key: 'AV_OC_30',
        socket: numericDataSocket,
        unit: '%',
        min: 0,
        max: 100
    },
    {
        id: 10,
        name: 'Min Organic Carbon 0-30cm (%)',
        key: 'MIN_OC_30',
        socket: numericDataSocket,
        unit: '%',
        min: 0,
        max: 100
    },
    {
        id: 11,
        name: 'Max Organic Carbon 0-30cm (%)',
        key: 'MAX_OC_30',
        socket: numericDataSocket,
        unit: '%',
        min: 0,
        max: 100
    },
    {
        id: 12,
        name: 'Average Organic Carbon 30-100cm (%)',
        key: 'AV_OC_100',
        socket: numericDataSocket,
        unit: '%',
        min: 0,
        max: 100
    },
    {
        id: 13,
        name: 'Min Organic Carbon 30-100cm (%)',
        key: 'MIN_OC_100',
        socket: numericDataSocket,
        unit: '%',
        min: 0,
        max: 100
    },
    {
        id: 14,
        name: 'Max Organic Carbon 30-100cm (%)',
        key: 'MAX_OC_100',
        socket: numericDataSocket,
        unit: '%',
        min: 0,
        max: 100
    },
    {
        id: 15,
        name: 'Average Organic Carbon 100-150cm (%)',
        key: 'AV_OC_150',
        socket: numericDataSocket,
        unit: '%',
        min: 0,
        max: 100
    },
    {
        id: 16,
        name: 'Min Organic Carbon 100-150cm (%)',
        key: 'MIN_OC_150',
        socket: numericDataSocket,
        unit: '%',
        min: 0,
        max: 100
    },
    {
        id: 17,
        name: 'Max Organic Carbon 100-150cm (%)',
        key: 'MAX_OC_150',
        socket: numericDataSocket,
        unit: '%',
        min: 0,
        max: 100
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