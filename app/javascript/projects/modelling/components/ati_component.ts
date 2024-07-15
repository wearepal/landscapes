import { createXYZ } from "ol/tilegrid"
import { Node, Output, Socket } from "rete"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { booleanDataSocket, categoricalDataSocket } from "../socket_types"
import { BooleanTileGrid, CategoricalTileGrid } from "../tile_grid"
import { BaseComponent } from "./base_component"
import { Extent } from "ol/extent"
import { bboxFromExtent, maskFromExtentAndShape } from "../bounding_box"
import { GeoJSON } from "ol/format";
import { find } from "lodash"
import { ProjectProperties } from "."

interface TreeType {
    id : number
    value : string
    socket : Socket
}

const trees: TreeType[] = [
    { 
        id: 1,
        value: "Ancient tree",
        socket: booleanDataSocket
    },
    { 
        id: 2,
        value: "Lost Ancient tree",
        socket: booleanDataSocket
    },
    {
        id: 3,
        value: "Veteran tree",
        socket: booleanDataSocket
    },
    {
        id: 4,
        value: "Lost Veteran tree",
        socket: booleanDataSocket
    },
    {
        id: 5,
        value: "Notable tree",
        socket: booleanDataSocket
    },
    {
        id: 6,
        value: "Lost Notable tree",
        socket: booleanDataSocket
    },
    {
        id: 0,
        value: "All",
        socket: categoricalDataSocket
    }
]


async function renderCategoricalData(extent: Extent, zoom: number, maskLayer: string, maskCQL: string, maskMode: boolean) : Promise<CategoricalTileGrid>{

    const tileGrid = createXYZ()
    const outputTileRange = tileGrid.getTileRangeForExtentAndZ(extent, zoom)

    const response = await fetch(
        "https://landscapes.wearepal.ai/geoserver/wfs?" +
        new URLSearchParams(
            {
                outputFormat: 'application/json',
                request: 'GetFeature',
                typeName: 'nateng:ATIData_Public',
                srsName: 'EPSG:3857',
                bbox : bboxFromExtent(extent),
            }
        )
    )
    
    const mask = await maskFromExtentAndShape(extent, zoom, maskLayer, maskCQL, maskMode)

    if (!response.ok) throw new Error()

    const features = new GeoJSON().readFeatures(await response.json())

    const result = new CategoricalTileGrid(
        zoom,
        outputTileRange.minX,
        outputTileRange.minY,
        outputTileRange.getWidth(),
        outputTileRange.getHeight()
    )


    const treeCrown = 2.5

    for (const feature of features) {
        
        const geom = feature.getGeometry()
        if (geom === undefined) { continue }

        const val = feature.get("VeteranSta")
        if (val === undefined) { continue }

        const key = find(trees, hab => hab.value === val)
        if (key?.id === undefined) { continue }

        const expandedExtent = [geom.getExtent()[0] - treeCrown, geom.getExtent()[1] - treeCrown, geom.getExtent()[2] + treeCrown, geom.getExtent()[3] + treeCrown]

        const featureTileRange = tileGrid.getTileRangeForExtentAndZ(
            expandedExtent,
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
                result.set(x, y, mask.get(x, y) ? key?.id ?? 255 : 255)
            }
        }

    }

    const labels = new Map()
    trees.forEach(type => {
        if(type.id === 0) return
        labels.set(type.id, type.value)
    })
    result.setLabels(labels)

    return result

}

export class ATIComponent extends BaseComponent {
    categoricalData: CategoricalTileGrid | null
    outputCache: Map<number, BooleanTileGrid>
    projectExtent: Extent
    projectZoom: number
    zoom: number
    maskMode: boolean
    maskLayer: string
    maskCQL: string

    constructor(projectProps: ProjectProperties) {
        super("Ancient Tree Inventory")
        this.category = "Inputs"
        this.categoricalData = null
        this.outputCache = new Map()
        this.projectExtent = projectProps.extent
        this.projectZoom = projectProps.zoom
        this.maskMode = projectProps.mask
        this.maskLayer = projectProps.maskLayer
        this.maskCQL = projectProps.maskCQL
    }

    
    async builder(node: Node) {
        node.meta.toolTip = "ATI (Ancient Tree Inventory) data."
        node.meta.toolTipLink = "https://ati.woodlandtrust.org.uk/"

        trees.forEach(type => {
            node.addOutput(new Output(
                type.id.toString(), 
                type.value, 
                type.socket
            ))
        })

    }

    
    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
        
        if (this.categoricalData === null) {
            this.categoricalData = await renderCategoricalData(this.projectExtent, this.projectZoom, this.maskLayer, this.maskCQL, this.maskMode)
        }
        const categoricalData = this.categoricalData!
    
        trees.filter(
            type => node.outputs[type.id].connections.length > 0
        ).forEach(type => {
            if (type.id == 0) {
                outputs[type.id] = this.categoricalData
            } else {
                if (this.outputCache.has(type.id)) {
                    outputs[type.id] = this.outputCache.get(type.id)
                }
                else {
                    const out = outputs[type.id] = new BooleanTileGrid(categoricalData.zoom, categoricalData.x, categoricalData.y, categoricalData.width, categoricalData.height)
                    out.name = type.value
        
                    categoricalData.iterate((x, y, value) => out.set(x, y, value === type.id))
        
                    this.outputCache.set(type.id, out)
                }
            }
        })
    }
}