import { Input, Node, Output } from "rete"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { booleanDataSocket, categoricalDataSocket, dataSocket, numericDataSocket, propertySocket } from "../socket_types"
import { BooleanTileGrid, CategoricalTileGrid, NumericTileGrid, TileGridJSON, TileGridProps } from "../tile_grid"
import { BaseComponent } from "./base_component"
import { ProjectProperties } from "./index"
import { createXYZ } from "ol/tilegrid"
import { maskFromExtentAndShape } from "../bounding_box"
import { retrieveModelData, retrieveWFSData } from "../model_retrieval"
import { Feature } from "ol"
import { Geometry } from "ol/geom"
import { TypedArray } from "d3"

export interface VectorLayerData {
    name: string
    source: string[]
    key: string
    value?: string[]
    output: 'BooleanTileGrid' | 'CategoricalTileGrid' | 'NumericTileGrid'
    properties?: TileGridProps
    distributed: boolean
    wms: boolean
    wmsTriggerZoom?: number
}

const featuresCache: Map<string, Feature<Geometry>[]> = new Map()

async function buildVectorTileGridFromWMS(layer: VectorLayerData, projectProps: ProjectProperties) : Promise<BooleanTileGrid | CategoricalTileGrid | NumericTileGrid> {

    const [projectExtent, zoom, maskMode, maskLayer, maskCQL] = [projectProps.extent, projectProps.zoom, projectProps.mask, projectProps.maskLayer, projectProps.maskCQL]
   
    const mask = await maskFromExtentAndShape(projectExtent, zoom, maskLayer, maskCQL, maskMode)

    const tileGrid = createXYZ()
    const outputTileRange = tileGrid.getTileRangeForExtentAndZ(projectExtent, zoom)

    const cacheKey = layer.source.join(',')
    const geotiff = await retrieveModelData(projectExtent, cacheKey, outputTileRange)

    const rasters = await geotiff.readRasters({ bbox: projectExtent, width: outputTileRange.getWidth(), height: outputTileRange.getHeight() })
    const image = await geotiff.getImage()

    const result = new BooleanTileGrid(
        zoom,
        outputTileRange.minX,
        outputTileRange.minY,
        outputTileRange.getWidth(),
        outputTileRange.getHeight()
    )

    for (let i = 0; i < (rasters[3] as TypedArray).length; i++) {

        let x = (outputTileRange.minX + i % image.getWidth())
        let y = (outputTileRange.minY + Math.floor(i / image.getWidth()))

        result.set(x, y, rasters[3][i] === 0 ? false : (mask.get(x, y) === true ? true : false))
    
    }

    return result
    
}

async function buildVectorTileGrid(layer: VectorLayerData, projectProps: ProjectProperties) : Promise<BooleanTileGrid | CategoricalTileGrid | NumericTileGrid> {

    // TODO: Add support for multiple sources
    const cacheKey = layer.source.join(',')
    const features = featuresCache.get(cacheKey) ?? await retrieveWFSData(cacheKey, projectProps)

    featuresCache.set(cacheKey, features)
    const tileGrid = createXYZ()

    const [projectExtent, zoom, maskMode, maskLayer, maskCQL] = [projectProps.extent, projectProps.zoom, projectProps.mask, projectProps.maskLayer, projectProps.maskCQL]
    const outputTileRange = tileGrid.getTileRangeForExtentAndZ(projectExtent, zoom)
    const mask = await maskFromExtentAndShape(projectExtent, zoom, maskLayer, maskCQL, maskMode)

    let result: BooleanTileGrid | CategoricalTileGrid | NumericTileGrid

    switch(layer.output) {
        case 'BooleanTileGrid':
            result = new BooleanTileGrid(zoom, outputTileRange.minX, outputTileRange.minY, outputTileRange.getWidth(), outputTileRange.getHeight())
            break
        case 'CategoricalTileGrid':
            result = new CategoricalTileGrid(zoom, outputTileRange.minX, outputTileRange.minY, outputTileRange.getWidth(), outputTileRange.getHeight())
            result.setLabels(new Map(layer.value?.map((v, i) => [i+1, v])))
            break
        case 'NumericTileGrid':
            result = new NumericTileGrid(zoom, outputTileRange.minX, outputTileRange.minY, outputTileRange.getWidth(), outputTileRange.getHeight())
            if(layer.properties) {
                result.properties = layer.properties
            }
            break
    }

    for (const feature of features) {
        const geom = feature.getGeometry()
        if (geom === undefined) { continue }

        const featureTileRange = tileGrid.getTileRangeForExtentAndZ(
            geom.getExtent(),
            zoom
        )

        result.iterateOverTileRange(
            featureTileRange,
            (x, y, value) => {
                const intersects = geom.intersectsCoordinate(tileGrid.getTileCoordCenter([zoom, x, y])) && mask.get(x, y)
                if(intersects) {
                    let value
                    switch(layer.output) {
                        case 'BooleanTileGrid':
                            value = feature.get(layer.key) as string
                            let v = layer.value ? layer.value.includes(value) : true;
                            (result as BooleanTileGrid).set(x, y, v)
                            break
                        case 'CategoricalTileGrid':
                            value = feature.get(layer.key) as string
                            let index = layer.value ? layer.value.indexOf(value)+1 : 0;
                            (result as CategoricalTileGrid).set(x, y, index)
                            break
                        case 'NumericTileGrid':
                            value = feature.get(layer.key) as string
                            (result as NumericTileGrid).set(x, y, parseFloat(value))
                            break
                    }
                }
            }
        )

        result.name = layer.name
        
    }

    return result
}

export class VectorComponent extends BaseComponent {
    layers: VectorLayerData[]
    projectProps: ProjectProperties
    tileGridsCache: Map<number, BooleanTileGrid | CategoricalTileGrid | NumericTileGrid>

    constructor(name: string, layers: VectorLayerData[], projectProps: ProjectProperties) {
        super(name)
        this.category = "Inputs"
        this.layers = layers
        this.projectProps = projectProps
        this.tileGridsCache = new Map()
    }

    async builder(node: Node) {
        this.layers.forEach((layer, i) => {
            const socket = layer.output === 'NumericTileGrid' ? numericDataSocket : (layer.output === 'BooleanTileGrid' ? booleanDataSocket : categoricalDataSocket)
            node.addOutput(new Output(i.toString(), layer.name, socket))
        })
    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {

        const editorNode = this.editor?.nodes.find(n => n.id === node.id)
        if (editorNode === undefined) { return }

        const p = this.layers.map(async (layer, i) => {
            if(node.outputs[i.toString()].connections.length > 0) {
                const tileGrid = this.tileGridsCache.get(i) ?? (layer.wms && this.projectProps.zoom <= (layer.wmsTriggerZoom ?? 0) ? await buildVectorTileGridFromWMS(layer, this.projectProps) : await buildVectorTileGrid(layer, this.projectProps))
                this.tileGridsCache.set(i, tileGrid)
                outputs[i.toString()] = tileGrid
            }
        })

        await Promise.all(p)

    }
}