import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { BaseComponent } from "./base_component"
import { Input, Node, Output } from 'rete'
import { ProjectProperties } from "./index"

export class HedgerowComponent extends BaseComponent {
    ProjectProperties: ProjectProperties

    constructor(projectProps: ProjectProperties) {
        super("Hedgerows")
        this.category = "Inputs"
        this.ProjectProperties = projectProps
    }


    async builder(node: Node) {
    }


    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
    }

}