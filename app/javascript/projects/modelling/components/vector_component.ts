import { Input, Node, Output } from "rete"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { booleanDataSocket, categoricalDataSocket, dataSocket, numericDataSocket, propertySocket } from "../socket_types"
import { BooleanTileGrid, CategoricalTileGrid, NumericTileGrid, TileGridJSON, TileGridProps } from "../tile_grid"
import { BaseComponent } from "./base_component"
import { ProjectProperties } from "./index"
import { createXYZ } from "ol/tilegrid"
import { maskFromExtentAndShape } from "../bounding_box"
import { retrieveWFSData } from "../model_retrieval"
import { Feature } from "ol"
import { Geometry } from "ol/geom"

export interface VectorLayerData {
    name: string
    source: string[]
    key: string
    value?: string[]
    output: 'BooleanTileGrid' | 'CategoricalTileGrid' | 'NumericTileGrid'
    properties?: TileGridProps
    distributed: boolean
}

const featuresCache: Map<string, Feature<Geometry>[]> = new Map()

async function buildVectorTileGrid(layer: VectorLayerData, projectProps: ProjectProperties) : Promise<BooleanTileGrid | CategoricalTileGrid | NumericTileGrid> {

    // TODO: Add support for multiple sources
    const features = featuresCache.get(layer.source.join(',')) ?? await retrieveWFSData(layer.source.join(','), projectProps)

    featuresCache.set(layer.source[0], features)

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
            console.log(result.labels)
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
                            // TODO: Add support for categorical data
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
                const tileGrid = this.tileGridsCache.get(i) ?? await buildVectorTileGrid(layer, this.projectProps)
                this.tileGridsCache.set(i, tileGrid)
                outputs[i.toString()] = tileGrid
            }
        })

        await Promise.all(p)

    }
}