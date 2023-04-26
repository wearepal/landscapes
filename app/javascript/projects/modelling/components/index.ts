import { booleanDataSocket, numericDataSocket } from "../socket_types"
import { BaseComponent } from "./base_component"
import { BinaryOpComponent } from "./binary_op_component"
import { UkcehLandCoverComponent } from "./ukceh_land_cover_component"
import { MapLayerComponent, SaveMapLayer } from "./map_layer_component"
import { NumericConstantComponent } from "./numeric_constant_component"
import { UnaryOpComponent } from "./unary_op_component"
import { VariadicOpComponent } from "./variadic_op_component"
import { MaskNumericDataComponent } from "./mask_numeric_data_component"
import { NumberToNumericDatasetComponent } from "./number_to_numeric_dataset_component"
import { NevoLayerComponent } from "./nevo_layer_component"
import { OSMLandUseComponent } from "./osm_land_use_component"
import { AreaComponent } from "./area_component"
import { BarChartComponent } from "./bar_chart_component"

export function createDefaultComponents(saveMapLayer: SaveMapLayer): BaseComponent[] {
  return [
    // Inputs
    new UkcehLandCoverComponent(),
    new NevoLayerComponent(),
    new OSMLandUseComponent(),
    new NumericConstantComponent(),

    // Outputs
    new MapLayerComponent(saveMapLayer),

    // Conversions
    new NumberToNumericDatasetComponent(),

    // Calculations
    new AreaComponent(),

    // Charts
    new BarChartComponent(),

    // Set operations
    new VariadicOpComponent('Union', '⋃', booleanDataSocket, booleanDataSocket, 'Set operations'),
    new VariadicOpComponent('Intersection', '⋂', booleanDataSocket, booleanDataSocket, 'Set operations'),
    new BinaryOpComponent('Set difference', '−', booleanDataSocket, booleanDataSocket, 'Set operations'),
    new VariadicOpComponent('Symmetric difference', 'Δ', booleanDataSocket, booleanDataSocket, 'Set operations'),
    new UnaryOpComponent('Complement', '′', 'postfix', booleanDataSocket, booleanDataSocket, 'Set operations'),

    // Arithmetic
    new MaskNumericDataComponent(),
    new VariadicOpComponent('Sum', '∑', numericDataSocket, numericDataSocket, 'Arithmetic'),
    new VariadicOpComponent('Product', '∏', numericDataSocket, numericDataSocket, 'Arithmetic'),
    new BinaryOpComponent('Add', '+', numericDataSocket, numericDataSocket, 'Arithmetic'),
    new BinaryOpComponent('Subtract', '−', numericDataSocket, numericDataSocket, 'Arithmetic'),
    new BinaryOpComponent('Multiply', '×', numericDataSocket, numericDataSocket, 'Arithmetic'),
    new BinaryOpComponent('Divide', '÷', numericDataSocket, numericDataSocket, 'Arithmetic'),
    new BinaryOpComponent('Power', '^', numericDataSocket, numericDataSocket, 'Arithmetic'),
    new UnaryOpComponent('Negate', '−', 'prefix', numericDataSocket, numericDataSocket, 'Arithmetic'),
    new UnaryOpComponent('Reciprocal', '⁻¹', 'postfix', numericDataSocket, numericDataSocket, 'Arithmetic'),
    new BinaryOpComponent('Less', '<', numericDataSocket, booleanDataSocket, 'Arithmetic'),
    new BinaryOpComponent('Greater', '>', numericDataSocket, booleanDataSocket, 'Arithmetic'),
  ]
}
