import { Extent } from "ol/extent"
import { BaseComponent } from "./base_component"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { Node, Output } from "rete"
import { createXYZ } from "ol/tilegrid"
import { BooleanTileGrid } from "../tile_grid"
import { designations, Designation } from "../designations"
import { retrieveModelData } from "../model_retrieval"
import { TypedArray } from "d3"
import { maskFromExtentAndShape } from "../bounding_box"

async function renderDesignation(extent: Extent, zoom: number, designation: Designation, cacheFn: (result : BooleanTileGrid) => BooleanTileGrid) : Promise<BooleanTileGrid>{


    const mask = await maskFromExtentAndShape(extent, zoom, "shapefiles:westminster_const", "Name='Brighton, Pavilion Boro Const'")

    const tileGrid = createXYZ()
    const outputTileRange = tileGrid.getTileRangeForExtentAndZ(extent, zoom)

    const geotiff = await retrieveModelData(extent, designation.identifier, outputTileRange)

    const rasters = await geotiff.readRasters({ bbox: extent, width: outputTileRange.getWidth(), height: outputTileRange.getHeight() })
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

    return cacheFn(result)
}

export class DesignationsComponent extends BaseComponent {
    projectExtent: Extent
    projectZoom: number
    cachedDesignations: Map<string, BooleanTileGrid>
    
    constructor(projectExtent: Extent, projectZoom: number) {
        super("Designations")
        this.category = "Inputs"
        this.projectExtent = projectExtent
        this.projectZoom = projectZoom
        this.cachedDesignations = new Map()
    }
    
    async builder(node: Node) {
        designations.forEach(designation => node.addOutput(new Output(designation.value, designation.name, designation.socket)))
    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
        designations.filter(
            designation => node.outputs[designation.value].connections.length > 0
        ).forEach(designation => 
            outputs[designation.value] = this.cachedDesignations.has(designation.value) ? this.cachedDesignations.get(designation.value) : renderDesignation(this.projectExtent, this.projectZoom, designation, 
                (r : BooleanTileGrid) => {
                    this.cachedDesignations.set(designation.value, r)
                    return r
                }
            )
        )
    }

}