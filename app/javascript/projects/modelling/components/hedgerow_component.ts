import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { BaseComponent } from "./base_component"
import { Input, Node, Output } from 'rete'
import { ProjectProperties } from "./index"
import { booleanDataSocket } from "../socket_types"
import { maskFromExtentAndShape } from "../bounding_box"
import { retrieveModelData } from "../model_retrieval"
import { createXYZ } from "ol/tilegrid"
import { TypedArray } from "d3"
import { BooleanTileGrid } from "../tile_grid"

export class HedgerowComponent extends BaseComponent {
    ProjectProperties: ProjectProperties
    cachedHedgerows: BooleanTileGrid

    constructor(projectProps: ProjectProperties) {
        super("Hedgerows")
        this.category = "Inputs"
        this.ProjectProperties = projectProps
    }

    async builder(node: Node) {
        node.addOutput(new Output('out', 'Hedgerows', booleanDataSocket))
    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {

        const editorNode = this.editor?.nodes.find(n => n.id === node.id)
        if (editorNode === undefined) { return }

        const mask = await maskFromExtentAndShape(
            this.ProjectProperties.extent, 
            this.ProjectProperties.zoom, 
            this.ProjectProperties.maskLayer, 
            this.ProjectProperties.maskCQL, 
            this.ProjectProperties.mask
        )

        if (node.outputs['out'].connections.length > 0)
        {

            if(this.cachedHedgerows === undefined) {

                const tileGrid = createXYZ()
                const outputTileRange = tileGrid.getTileRangeForExtentAndZ(
                    this.ProjectProperties.extent, 
                    this.ProjectProperties.zoom
                )
                const geotiff = await retrieveModelData(
                    this.ProjectProperties.extent, 
                    'nateng:defra_lcm_hedges', 
                    outputTileRange
                )

                const rasters = await geotiff.readRasters({ 
                    bbox: this.ProjectProperties.extent, 
                    width: outputTileRange.getWidth(), 
                    height: outputTileRange.getHeight() 
                })

                const image = await geotiff.getImage()

                const result = new BooleanTileGrid(
                    this.ProjectProperties.zoom,
                    outputTileRange.minX,
                    outputTileRange.minY,
                    outputTileRange.getWidth(),
                    outputTileRange.getHeight()
                )

                for (let i = 0; i < (rasters[0] as TypedArray).length; i++) {

                    let x = (outputTileRange.minX + i % image.getWidth())
                    let y = (outputTileRange.minY + Math.floor(i / image.getWidth()))
            
                    result.set(x, y, rasters[3][i] === 0 ? false : (mask.get(x, y) === true ? true : false))
            
                }

                this.cachedHedgerows = result
                outputs['out'] = result

            }else{

                outputs['out'] = this.cachedHedgerows

            }
        }

    }

}