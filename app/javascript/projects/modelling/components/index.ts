import { booleanDataSocket } from "../socketTypes"
import { BaseComponent } from "./base_component"
import { BinaryOpComponent } from "./binary_op_component"
import { UkcehLandCoverComponent } from "./ukceh_land_cover_component"
import { MapLayerComponent } from "./map_layer_component"
import { NumericConstantComponent } from "./numeric_constant"

export function createDefaultComponents(): BaseComponent[] {
  return [
    new UkcehLandCoverComponent(),
    new NumericConstantComponent(),

    new BinaryOpComponent('Set difference', '−', booleanDataSocket, booleanDataSocket, 'Set operations'),

    new MapLayerComponent(() => {})
  ]
}
