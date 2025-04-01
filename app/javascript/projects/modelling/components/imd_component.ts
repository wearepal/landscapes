import { Extent } from "ol/extent"
import { BaseComponent } from "./base_component"
import { Node, Output, Socket } from "rete"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { numericDataSocket } from "../socket_types"
import { bboxFromExtent, maskFromExtentAndShape } from "../bounding_box"
import { GeoJSON } from "ol/format";
import { Feature } from "ol"
import { Geometry } from "ol/geom"
import { NumericTileGrid } from "../tile_grid"
import { createXYZ } from "ol/tilegrid"
import { ProjectProperties } from "."

interface OutputFormat {
    name: string
    typeName: string
    socket: Socket
    unit: string
}

const outputFormats: OutputFormat[] = [
    {
        name: "IMD Rank",
        typeName: "IMD_Rank",
        socket: numericDataSocket,
        unit: ''
    },
    {
        name: "IMD Decile",
        typeName: "IMD_Decile",
        socket: numericDataSocket,
        unit: ''
    },
    {
        name: "Income Rank",
        typeName: "IncRank",
        socket: numericDataSocket,
        unit: ''
    },
    {
        name: "Income Decile",
        typeName: "IncDec",
        socket: numericDataSocket,
        unit: ''
    },
    {
        name: "Income Score",
        typeName: "IncScore",
        socket: numericDataSocket,
        unit: ''
    },
    {
        name: "Employment Rank",
        typeName: "EmpRank",
        socket: numericDataSocket,
        unit: ''
    },
    {
        name: "Employment Decile",
        typeName: "EmpDec",
        socket: numericDataSocket,
        unit: ''
    },
    {
        name: "Employment Score",
        typeName: "EmpScore",
        socket: numericDataSocket,
        unit: ''
    },
    {
        name: "Education, Skills and Training Rank",
        typeName: "EduRank",
        socket: numericDataSocket,
        unit: ''
    },
    {
        name: "Education, Skills and Training Decile",
        typeName: "EduDec",
        socket: numericDataSocket,
        unit: ''
    },
    {
        name: "Education, Skills and Training Score",
        typeName: "EduScore",
        socket: numericDataSocket,
        unit: ''
    },
    {
        name: "Heath Deprevation and Disability Rank",
        typeName: "HDDRank",
        socket: numericDataSocket,
        unit: ''
    },
    {
        name: "Heath Deprevation and Disability Decile",
        typeName: "HDDDec",
        socket: numericDataSocket,
        unit: ''
    },
    {
        name: "Heath Deprevation and Disability Score",
        typeName: "HDDScore",
        socket: numericDataSocket,
        unit: ''
    },
    {
        name: "Crime Rank",
        typeName: "CriRank",
        socket: numericDataSocket,
        unit: ''
    },
    {
        name: "Crime Decile",
        typeName: "CriDec",
        socket: numericDataSocket,
        unit: ''
    },
    {
        name: "Crime Score",
        typeName: "CriScore",
        socket: numericDataSocket,
        unit: ''
    },
    {
        name: "Barriers to Housing and Services Rank",
        typeName: "BHSRank",
        socket: numericDataSocket,
        unit: ''
    },
    {
        name: "Barriers to Housing and Services Decile",
        typeName: "BHSDec",
        socket: numericDataSocket,
        unit: ''
    },
    {
        name: "Barriers to Housing and Services Score",
        typeName: "BHSScore",
        socket: numericDataSocket,
        unit: ''
    },
    {
        name: "Living Environment Rank",
        typeName: "EnvRank",
        socket: numericDataSocket,
        unit: ''
    },
    {
        name: "Living Environment Decile",
        typeName: "EnvDec",
        socket: numericDataSocket,
        unit: ''
    },
    {
        name: "Living Environment Score",
        typeName: "EnvScore",
        socket: numericDataSocket,
        unit: ''
    },
    {
        name: "Population (Total)",
        typeName: "TotPop",
        socket: numericDataSocket,
        unit: ''
    },
    {
        name: "Population (16-59)",
        typeName: "Pop16_59",
        socket: numericDataSocket,
        unit: ''
    },
    {
        name: "Population (60+)",
        typeName: "Pop60+",
        socket: numericDataSocket,
        unit: ''
    },
    {
        name: "Population (Working)",
        typeName: "WorkPop",
        socket: numericDataSocket,
        unit: ''
    }
]

async function fetchIMDData(projectExtent: Extent) : Promise<Feature<Geometry>[]> {

    const response = await fetch(
        "https://landscapes.wearepal.ai/geoserver/wfs?" +
        new URLSearchParams(
          {
            outputFormat: 'application/json',
            request: 'GetFeature',
            typeName: 'shapefiles:IMD_2019',
            srsName: 'EPSG:3857',
            bbox : bboxFromExtent(projectExtent),
          }
        )
    )

    if (!response.ok) throw new Error()
    const features = new GeoJSON().readFeatures(await response.json())
    return features

}

async function buildIMDTileGrid(label: string, projectExtent: Extent, zoom: number, maskMode: boolean, maskLayer: string, maskCQL: string, cache: Map<string, NumericTileGrid>) : Promise<NumericTileGrid> {

    if (cache.has(label)){
        return cache.get(label)!
    }

    const tileGrid = createXYZ()
    const outputTileRange = tileGrid.getTileRangeForExtentAndZ(projectExtent, zoom)

    const mask = await maskFromExtentAndShape(projectExtent, zoom, maskLayer, maskCQL, maskMode)
  
    const features = await fetchIMDData(projectExtent)

    const result = new NumericTileGrid(
        zoom,
        outputTileRange.minX,
        outputTileRange.minY,
        outputTileRange.getWidth(),
        outputTileRange.getHeight()
    )

    for (let feature of features) {
        const geom = feature.getGeometry()
        if (geom === undefined) { continue }

        const category = feature.get(label)

        const featureTileRange = tileGrid.getTileRangeForExtentAndZ(
            geom.getExtent(),
            zoom
            )
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
                const center = tileGrid.getTileCoordCenter([zoom, x, y])
                if (geom.intersectsCoordinate(center)) {
                    result.set(x, y, mask.get(x, y) ? category as number : NaN)
                }
            }
            }
    }

    cache.set(label, result)

    return result
}

export class IMDComponent extends BaseComponent {
    projectExtent: Extent
    projectZoom: number
    maskMode: boolean
    maskLayer: string
    maskCQL: string
    cachedData: Feature<Geometry>[]
    cachedGrids: Map<string, NumericTileGrid>

    constructor(projectProps : ProjectProperties) {
        super("Indices of Multiple Deprivation")
        this.category = "Inputs"
        this.projectExtent = projectProps.extent
        this.projectZoom = projectProps.zoom
        this.maskMode = projectProps.mask
        this.maskLayer = projectProps.maskLayer
        this.maskCQL = projectProps.maskCQL
        this.cachedGrids = new Map()
    }

    async builder(node: Node) {
        node.meta.toolTip = "Indices of Multiple Deprivation 2019 data for England. Decilces are most deprived (1) to least deprived (10)"
        node.meta.toolTipLink = "https://data.cdrc.ac.uk/dataset/index-multiple-deprivation-imd"
        for (const format of outputFormats) {
            const output = new Output(format.typeName, format.name, format.socket)
            node.addOutput(output)
        }
    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
        
        if (this.cachedData === undefined){
            this.cachedData = await fetchIMDData(this.projectExtent)
        }

        const p = outputFormats.filter(
            f => node.outputs[f.typeName].connections.length > 0
        ).map(async i => 
            {
                const grid = await buildIMDTileGrid(i.typeName, this.projectExtent, this.projectZoom, this.maskMode, this.maskLayer, this.maskCQL, this.cachedGrids)
                grid.name = i.typeName
                outputs[i.typeName] = grid
            }
        )
        await Promise.all(p)
    }

}