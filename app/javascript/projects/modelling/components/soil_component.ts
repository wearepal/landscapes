import { BaseComponent } from "./base_component"
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { Input, Node, Output } from 'rete'
import { ProjectProperties } from "."
import { Extent } from "ol/extent"


export class SoilComponent extends BaseComponent {
    projectZoom: number
    projectExtent: Extent
    maskMode: boolean
    maskLayer: string
    maskCQL: string


    constructor(projectProps: ProjectProperties) {
        super("Soil")
        [
            this.projectExtent, 
            this.projectZoom, 
            this.maskMode, 
            this.maskLayer, 
            this.maskCQL
        ] = [
            projectProps.extent, 
            projectProps.zoom, 
            projectProps.mask, 
            projectProps.maskLayer, 
            projectProps.maskCQL
        ]
        this.category = "Inputs"
    }


    async builder(node: Node) {
    }


    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
    }

}