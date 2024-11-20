import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { ProjectProperties } from "."
import { Node, Output } from "rete"
import { BaseComponent } from "./base_component"



export class NatmapSoilComponent extends BaseComponent {

    constructor(projectProps: ProjectProperties) {
        super("NATMAP Soil")
        this.category = "Inputs"
    }

    async builder(node: Node) {
    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
    }
}