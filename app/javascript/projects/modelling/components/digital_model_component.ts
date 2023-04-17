import { Node } from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { BaseComponent } from "./base_component";

export class DigitalModelComponent extends BaseComponent {

    constructor() {
        super("Digital Model")
        this.category = "Inputs"
    }

    async builder(node: Node) {
    }


    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
    }

}