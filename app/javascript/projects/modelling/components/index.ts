import { booleanDataSocket } from "../socketTypes"
import { BaseComponent } from "./base_component"
import { BinaryOpComponent } from "./binary_op_component"
import { InputUkcehComponent } from "./input_ukceh_component"
import { NumericConstantComponent } from "./numeric_constant"

export function createDefaultComponents(): BaseComponent[] {
  return [
    new InputUkcehComponent(),
    new NumericConstantComponent(),

    new BinaryOpComponent('Set difference', '−', booleanDataSocket, booleanDataSocket, 'Set operations'),
  ]
}
