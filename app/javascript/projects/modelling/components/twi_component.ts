import { BaseComponent } from "./base_component"
import { Input, Node, Output } from "rete"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { ProjectProperties } from "."
import { numberSocket, numericDataSocket } from "../socket_types"
import { NumericTileGrid } from "../tile_grid"
import { Extent } from "ol/extent"
import { NumericConstant } from "../numeric_constant"
import { workerPool } from '../../../modelling/workerPool'

export class SlopeComponent extends BaseComponent {
    projectExtent: Extent
    projectZoom: number
    maskMode: boolean
    maskLayer: string
    maskCQL: string
    private cache: Map<string, NumericTileGrid>

    constructor(projectProps: ProjectProperties) {
        super("Slope")
        this.category = "Arithmetic"
        this.projectExtent = projectProps.extent
        this.projectZoom = projectProps.zoom
        this.maskMode = projectProps.mask
        this.maskLayer = projectProps.maskLayer
        this.maskCQL = projectProps.maskCQL
        this.cache = new Map()
    }

    private getCacheKey(elevation: NumericTileGrid, type: string, scale?: number): string {
        // Include a hash of the data to differentiate between different elevation models with same coordinates
        const dataHash = elevation.getData().reduce((acc, val) => acc + val, 0);
        return `${elevation.zoom}_${elevation.x}_${elevation.y}_${dataHash}_${type}_${scale || 'default'}`
    }

    async builder(node: Node) {

        node.addInput(new Input("scale", "Scale (m) (optional, default 10m)", numberSocket))
        node.addInput(new Input("input", "Elevation model", numericDataSocket))

        node.addOutput(new Output("horn_slope_rad", "Slope (Horn) (ᶜ)", numericDataSocket))
        node.addOutput(new Output("horn_slope_deg", "Slope (Horn) (°)", numericDataSocket))

        node.addOutput(new Output("zt_slope_rad", "Slope (Zevenbergen Thorne) (ᶜ)", numericDataSocket))
        node.addOutput(new Output("zt_slope_deg", "Slope (Zevenbergen Thorne) (°)", numericDataSocket))

        node.addOutput(new Output("horn_aspect", "Aspect (Horn)", numericDataSocket))
        node.addOutput(new Output("zt_aspect", "Aspect (Zevenbergen Thorne)", numericDataSocket))

        node.addOutput(new Output("horn_contour", "Contour (Horn)", numericDataSocket))
        node.addOutput(new Output("zt_contour", "Contour (Zevenbergen Thorne)", numericDataSocket))
        
        node.addOutput(new Output("twi", "TWI (Topographical Wetness Index)", numericDataSocket))
        
    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
        const editorNode = this.editor?.nodes.find(n => n.id === node.id)
        if (editorNode === undefined) { return }
            
        const elevation = inputs["input"][0] as NumericTileGrid

        if (!elevation) {
            editorNode.meta.errorMessage = "Elevation model is required!"
            return
        }

        const scale = node.inputs['scale'].connections.length > 0 ? (inputs['scale'][0] as NumericConstant).value : 10

        if(node.outputs['zt_slope_rad'].connections.length > 0) {
            const ztKey = this.getCacheKey(elevation, "zt_slope_rad", scale)
            if (!this.cache.has(ztKey)) {
                await workerPool.queue(async worker =>
                    this.cache.set(ztKey, worker.calculateSlope(elevation, "ZevenbergenThorne", scale, true))
                )
            }
            outputs['zt_slope_rad'] = this.cache.get(ztKey)
        }

        if(node.outputs['zt_slope_deg'].connections.length > 0) {
            const ztKey = this.getCacheKey(elevation, "zt_slope_deg", scale)
            if (!this.cache.has(ztKey)) {
                await workerPool.queue(async worker =>
                    this.cache.set(ztKey, worker.calculateSlope(elevation, "ZevenbergenThorne", scale))
                )
            }
            outputs['zt_slope_deg'] = this.cache.get(ztKey)
        }

        if(node.outputs['horn_slope_rad'].connections.length > 0) {
            const hornKey = this.getCacheKey(elevation, "horn_slope_rad", scale)
            if (!this.cache.has(hornKey)) {
                await workerPool.queue(async worker =>
                    this.cache.set(hornKey, worker.calculateSlope(elevation, "Horn", scale, true))
                )
            }
            outputs['horn_slope_rad'] = this.cache.get(hornKey)
        }

        if(node.outputs['horn_slope_deg'].connections.length > 0) {
            const hornKey = this.getCacheKey(elevation, "horn_slope_deg", scale)
            if (!this.cache.has(hornKey)) {
                await workerPool.queue(async worker =>
                    this.cache.set(hornKey, worker.calculateSlope(elevation, "Horn", scale))
                )
            }
            outputs['horn_slope_deg'] = this.cache.get(hornKey)
        }

        if(node.outputs['horn_aspect'].connections.length > 0) {
            const hornKey = this.getCacheKey(elevation, "horn_aspect", scale)
            if (!this.cache.has(hornKey)) {
                await workerPool.queue(async worker =>
                    this.cache.set(hornKey, worker.calculateContour(elevation, "Horn", scale))
                )
            }
            outputs['horn_aspect'] = this.cache.get(hornKey)
        }

        if(node.outputs['zt_aspect'].connections.length > 0) {
            const hornKey = this.getCacheKey(elevation, "zt_aspect", scale)
            if (!this.cache.has(hornKey)) {
                await workerPool.queue(async worker =>
                    this.cache.set(hornKey, worker.calculateContour(elevation, "ZevenbergenThorne", scale))
                )
            }
            outputs['zt_aspect'] = this.cache.get(hornKey)
        }

        if(node.outputs['horn_contour'].connections.length > 0) {
            const hornKey = this.getCacheKey(elevation, "horn_contour", scale)
            if (!this.cache.has(hornKey)) {
                await workerPool.queue(async worker =>
                    this.cache.set(hornKey, worker.calculateContour(elevation, "Horn", scale))
                )
            }
            outputs['horn_contour'] = this.cache.get(hornKey)
        }

        if(node.outputs['zt_contour'].connections.length > 0) {
            const hornKey = this.getCacheKey(elevation, "zt_contour", scale)
            if (!this.cache.has(hornKey)) {
                await workerPool.queue(async worker =>
                    this.cache.set(hornKey, worker.calculateContour(elevation, "ZevenbergenThorne", scale))
                )
            }
            outputs['zt_contour'] = this.cache.get(hornKey)
        }

        if(node.outputs['twi'].connections.length > 0) {
            const twiKey = this.getCacheKey(elevation, "twi")
            if (!this.cache.has(twiKey)) {
                await workerPool.queue(async worker =>
                    this.cache.set(twiKey, worker.calculateTWI(elevation, "ZevenbergenThorne", scale))
                )
            }
            outputs['twi'] = this.cache.get(twiKey)
        }
    }
}
