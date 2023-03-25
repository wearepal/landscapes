import { booleanDataSocket } from "../socketTypes"
import { BaseComponent } from "./base_component"
import { BinaryOpComponent } from "./binary_op_component"
import { UkcehLandCoverComponent } from "./ukceh_land_cover_component"
import { MapLayerComponent, SaveMapLayer } from "./map_layer_component"
import { NumericConstantComponent } from "./numeric_constant"
import { UnaryOpComponent } from "./unary_op_component"
import { VariadicOpComponent } from "./variadic_op_component"

export function createDefaultComponents(saveMapLayer: SaveMapLayer): BaseComponent[] {
  return [
    new UkcehLandCoverComponent(),
    new NumericConstantComponent(),

    new VariadicOpComponent('Union', '⋃', booleanDataSocket, booleanDataSocket, 'Set operations'),
    new VariadicOpComponent('Intersection', '⋂', booleanDataSocket, booleanDataSocket, 'Set operations'),
    new BinaryOpComponent('Set difference', '−', booleanDataSocket, booleanDataSocket, 'Set operations'),
    new VariadicOpComponent('Symmetric difference', 'Δ', booleanDataSocket, booleanDataSocket, 'Set operations'),
    new UnaryOpComponent('Complement', '′', 'postfix', booleanDataSocket, booleanDataSocket, 'Set operations'),

    new MapLayerComponent(saveMapLayer)
  ]
}
