import { Extent } from "ol/extent"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { BaseComponent } from "./base_component"
import { Node, Output, Socket } from "rete"
import { booleanDataSocket } from "../socket_types"
import { createXYZ } from "ol/tilegrid";
import { retrieveModelData } from "../model_retrieval"
import { BooleanTileGrid } from "../tile_grid"
import { TypedArray } from "d3"
import { bboxFromExtent, maskFromExtentAndShape } from "../bounding_box"
import { GeoJSON } from "ol/format"
import { Feature } from "ol"
import { Geometry } from "ol/geom"
import { ProjectProperties } from "."


const FeaturesCache : Feature<Geometry>[] | null = null

interface OutputData {
    name: string
    prettyName: string
    socket: Socket
    layer: string
    fn: (extent: Extent, zoom: number, type: string, layer: string, maskMode: boolean, maskCQL: string, maskLayer: string) => Promise<BooleanTileGrid>
}

const OutputDatas : OutputData[] = [
    { 
        name: "Paths", 
        prettyName: "Paths", 
        socket: booleanDataSocket, 
        layer: "ORVAL:paths_england",
        fn: retrievePathData 
    },
    {
        name: "Path Access",
        prettyName: "Path Access",
        socket: booleanDataSocket,
        layer: "ORVAL:paths_england_accesspts",
        fn: retrievePathData
    },
    {
        name: "Beaches",
        prettyName: "Beaches",
        socket: booleanDataSocket,
        layer: "ORVAL:beaches_england",
        fn: retrievePathData
    },
    {
        name: "Parks - any",
        prettyName: "Parks - any",
        socket: booleanDataSocket,
        layer: "ORVAL:parks_england",
        fn: retrievePathData
    },
    {
        name: "allotment",
        prettyName: "Parks - Allotment",
        socket: booleanDataSocket,
        layer: "ORVAL:parks_england",
        fn: retrieveCatData
    },
    {
        name: "anemity_park",
        prettyName: "Parks - Amenity Park",
        socket: booleanDataSocket,
        layer: "ORVAL:parks_england",
        fn: retrieveCatData
    },
    {
        name: "anemity_woods",
        prettyName: "Parks - Amenity Woods",
        socket: booleanDataSocket,
        layer: "ORVAL:parks_england",
        fn: retrieveCatData
    },
    {
        name: "cemetery",
        prettyName: "Parks - Cemetery",
        socket: booleanDataSocket,
        layer: "ORVAL:parks_england",
        fn: retrieveCatData
    },
    {
        name: "churchyard",
        prettyName: "Parks - Churchyard",
        socket: booleanDataSocket,
        layer: "ORVAL:parks_england",
        fn: retrieveCatData
    },
    {
        name: "club",
        prettyName: "Parks - Club",
        socket: booleanDataSocket,
        layer: "ORVAL:parks_england",
        fn: retrieveCatData
    },
    {
        name: "common",
        prettyName: "Parks - Common",
        socket: booleanDataSocket,
        layer: "ORVAL:parks_england",
        fn: retrieveCatData
    },
    {
        name: "country_park",
        prettyName: "Parks - Country Park",
        socket: booleanDataSocket,
        layer: "ORVAL:parks_england",
        fn: retrieveCatData
    },
    {
        name: "doorstep_green",
        prettyName: "Parks - Doorstep Green",
        socket: booleanDataSocket,
        layer: "ORVAL:parks_england",
        fn: retrieveCatData
    },
    {
        name: "FC_woods",
        prettyName: "Parks - FC Woods",
        socket: booleanDataSocket,
        layer: "ORVAL:parks_england",
        fn: retrieveCatData
    },
    {
        name: "garden",
        prettyName: "Parks - Garden",
        socket: booleanDataSocket,
        layer: "ORVAL:parks_england",
        fn: retrieveCatData
    },
    {
        name: "golf",
        prettyName: "Parks - Golf",
        socket: booleanDataSocket,
        layer: "ORVAL:parks_england",
        fn: retrieveCatData
    },
    {
        name: "grave_yard",
        prettyName: "Parks - Grave Yard",
        socket: booleanDataSocket,
        layer: "ORVAL:parks_england",
        fn: retrieveCatData
    },
    {
        name: "millenium_green",
        prettyName: "Parks - Millenium Green",
        socket: booleanDataSocket,
        layer: "ORVAL:parks_england",
        fn: retrieveCatData
    },
    {
        name: "nature",
        prettyName: "Parks - Nature",
        socket: booleanDataSocket,
        layer: "ORVAL:parks_england",
        fn: retrieveCatData
    },
    {
        name: "park",
        prettyName: "Parks - Park",
        socket: booleanDataSocket,
        layer: "ORVAL:parks_england",
        fn: retrieveCatData
    },
    {
        name: "recreation_ground",
        prettyName: "Parks - Recreation Ground",
        socket: booleanDataSocket,
        layer: "ORVAL:parks_england",
        fn: retrieveCatData
    },
    {
        name: "village_green",
        prettyName: "Parks - Village Green",
        socket: booleanDataSocket,
        layer: "ORVAL:parks_england",
        fn: retrieveCatData
    },
    {
        name: "wood",
        prettyName: "Parks - Wood",
        socket: booleanDataSocket,
        layer: "ORVAL:parks_england",
        fn: retrieveCatData
    }
]

async function retrieveCatData(extent: Extent, zoom: number, type: string, layer: string, maskMode: boolean, maskCQL: string, maskLayer: string) {

    
    const mask = await maskFromExtentAndShape(extent, zoom, maskLayer, maskCQL, maskMode)

    const tileGrid = createXYZ()
    const outputTileRange = tileGrid.getTileRangeForExtentAndZ(extent, zoom)

    let features = FeaturesCache

    if (features === null) {

        const response = await fetch(
            "https://landscapes.wearepal.ai/geoserver/wfs?" +
            new URLSearchParams(
                {
                    outputFormat: 'application/json',
                    request: 'GetFeature',
                    typeName: layer,
                    srsName: 'EPSG:3857',
                    bbox : bboxFromExtent(extent),
                }
            )
        )

        if (!response.ok) throw new Error()

        features = new GeoJSON().readFeatures(await response.json())

    }

    const result = new BooleanTileGrid(
        zoom,
        outputTileRange.minX,
        outputTileRange.minY,
        outputTileRange.getWidth(),
        outputTileRange.getHeight()
    )

    for (let feature of features) {
        const geom = feature.getGeometry()
        if (geom === undefined) { continue }

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
                if (geom.intersectsCoordinate(center) && feature.get("TYPE") === type) {
                    result.set(x, y, mask.get(x, y))
                }
            }
        }

    }

    return result
}

async function retrievePathData(extent: Extent, zoom: number, type: string, layer: string, maskMode: boolean, maskCQL: string, maskLayer: string) {
    const mask = await maskFromExtentAndShape(extent, zoom, maskLayer, maskCQL, maskMode)
    const tileGrid = createXYZ()
    const outputTileRange = tileGrid.getTileRangeForExtentAndZ(extent, zoom)

    const geotiff = await retrieveModelData(extent, layer, outputTileRange)

    const rasters = await geotiff.readRasters({ bbox: extent, width: outputTileRange.getWidth(), height: outputTileRange.getHeight() })
    const image = await geotiff.getImage()

    const result = new BooleanTileGrid(
        zoom,
        outputTileRange.minX,
        outputTileRange.minY,
        outputTileRange.getWidth(),
        outputTileRange.getHeight()
    )

    for (let i = 0; i < (rasters[0] as TypedArray).length; i++) {

        let x = (outputTileRange.minX + i % image.getWidth())
        let y = (outputTileRange.minY + Math.floor(i / image.getWidth()))

        result.set(x, y, mask.get(x,y) === true ? rasters[3][i] : false)

    }

    return result
}

export class ORValComponent extends BaseComponent {
    projectExtent: Extent
    projectZoom: number
    outputCache: Map<string, BooleanTileGrid>
    maskMode: boolean
    maskLayer: string
    maskCQL: string

    constructor(projectProps: ProjectProperties) {
        super("ORVal")
        this.category = "Inputs"
        this.outputCache = new Map()
        this.projectExtent = projectProps.extent
        this.projectZoom = projectProps.zoom
        this.maskMode = projectProps.mask
        this.maskLayer = projectProps.maskLayer
        this.maskCQL = projectProps.maskCQL
    }

    async builder(node: Node) {
        node.meta.toolTip = "Data from ORVal (Outdoor Recreation Valuation Tool)"
        node.meta.toolTipLink = "https://www.leep.exeter.ac.uk/orval/"
        OutputDatas.forEach(outputData => node.addOutput(new Output(outputData.name, outputData.prettyName, outputData.socket)))
    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {

        const editorNode = this.editor?.nodes.find(n => n.id === node.id)
        if (editorNode === undefined) { return }

        const promises = OutputDatas.filter(d => node.outputs[d.name].connections.length > 0)
            .map(d => {
                return this.outputCache.has(d.name) ? this.outputCache.get(d.name) : d.fn(this.projectExtent, this.projectZoom, d.name, d.layer, this.maskMode, this.maskCQL, this.maskLayer)
                    .then(data => {
                        data.name = d.name
                        this.outputCache.set(d.name, data)
                        outputs[d.name] = data
                    })
        })

        await Promise.all(promises)

        editorNode.update()

    }

}