import { BaseComponent } from "./base_component"
import { Node, Output, Socket } from "rete"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { ProjectProperties } from "."

export class KewHabsComponent extends BaseComponent {
    projectProps: ProjectProperties


    constructor(projectProps : ProjectProperties) {
        super("Wakehurst Habitats")
        this.category = "Kew"
        this.projectProps = projectProps
    }

    async builder(node: Node) {
    }


    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
    }


}