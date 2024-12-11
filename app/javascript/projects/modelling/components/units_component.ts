import { Node, Output } from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { BaseComponent } from "./base_component";
import { ProjectProperties } from ".";
import { propertySocket } from "../socket_types";
import { SelectControl, SelectControlOptions } from "../controls/select";

export class UnitComponent extends BaseComponent {
    unitArray: SelectControlOptions[]
    unitType: string
    unit: string

    constructor(unit: string, projectProps : ProjectProperties, unitArray: SelectControlOptions[]) {
        super(`${unit} Property`)
        this.category = "Properties"
        this.unitArray = unitArray
        this.unit = unit
    }

    async builder(node: Node) {
        node.addControl(new SelectControl(
            this.editor,
            this.unit,
            () => this.unitArray,
            () => []
        ))
        node.addOutput(new Output(this.unit, this.unit, propertySocket))
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]): void {
        const idx = (node.data[this.unit] ?? 0 )as number
        outputs[this.unit] = {
            type: this.unit,
            unit: this.unitArray[idx].name
        }
    }
}