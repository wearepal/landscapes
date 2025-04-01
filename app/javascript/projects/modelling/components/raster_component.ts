import { BaseComponent } from "./base_component"
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { Input, Node, Output, Socket } from 'rete'
import { booleanDataSocket, numericDataSocket } from "../socket_types"
import { ProjectProperties } from "."

import { maskFromExtentAndShape } from "../bounding_box"
import { createXYZ } from "ol/tilegrid"
import { retrieveModelDataWCS } from "../model_retrieval"
import { NumericTileGrid } from "../tile_grid"
import { TypedArray } from "d3"

// Generic component class for handling raster datasets

interface RasterComponentOption {
    name: string
    source: string
    area?: string
    unit?: string
}

export class RasterComponent extends BaseComponent {
    projectProps: ProjectProperties
    options: RasterComponentOption[]
    cache: Map<string, NumericTileGrid>

    constructor(projectProps: ProjectProperties, name: string, category: string, options: RasterComponentOption[]) {
        super(name)
        this.category = category
        this.projectProps = projectProps
        this.options = options
        this.cache = new Map()
    }

    async builder(node: Node) {
        this.options.forEach((option) => {
            node.addOutput(new Output(option.name, `${option.name} [[${option.unit ?? ''}/${option.area ?? ''}]]`, numericDataSocket))
        })
    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
        const editorNode = this.editor?.nodes.find(n => n.id === node.id)
        if (editorNode === undefined) { return }

        const mask = await maskFromExtentAndShape(
            this.projectProps.extent,
            this.projectProps.zoom,
            this.projectProps.maskLayer,
            this.projectProps.maskCQL,
            this.projectProps.mask
        )


        const tileGrid = createXYZ()
        const outputTileRange = tileGrid.getTileRangeForExtentAndZ(this.projectProps.extent, this.projectProps.zoom)

        const promises = this.options.filter(
            opt => node.outputs[opt.name].connections.length > 0
        ).map(
            async opt => {
                if (this.cache.has(opt.name)) {

                    outputs[opt.name] = this.cache.get(opt.name)
                    
                }else{

                    const geotiff = await retrieveModelDataWCS(this.projectProps.extent, opt.source, outputTileRange)

                    const image = await geotiff.getImage()
                    const rasters = await geotiff.readRasters({ bbox: this.projectProps.extent, width: outputTileRange.getWidth(), height: outputTileRange.getHeight() })
                    
                    const out =  new NumericTileGrid(this.projectProps.zoom, outputTileRange.minX, outputTileRange.minY, outputTileRange.getWidth(), outputTileRange.getHeight())
                    
                    for (let i = 0; i < (rasters[0] as TypedArray).length; i++) {
                        let x = (outputTileRange.minX + i % image.getWidth()) 
                        let y = (outputTileRange.minY + Math.floor(i / image.getWidth()))
                    
                        out.set(x, y, mask.get(x, y) === true ? (rasters[0][i]) : NaN)
                    }

                    out.properties.unit = opt.unit
                    out.properties.area = opt.area

                    outputs[opt.name] = out
                    this.cache.set(opt.name, out)

                }
                
            }
        )

        await Promise.all(promises)
    }

}

