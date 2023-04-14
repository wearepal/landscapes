import { BinaryOpComponent } from './BinaryOpComponent'
import { DistanceMapComponent } from './DistanceMapComponent'
import { InputLabellingComponent } from './InputLabellingComponent'
import { InputOverlayComponent } from './InputOverlayComponent'
import { NumericConstantComponent } from './NumericConstantComponent'
import { BuildLabellingLayerComponent } from './BuildLabellingLayerComponent'
import { UnaryOpComponent } from './UnaryOpComponent'
import { setSocket, mapSocket } from '../sockets'
import { VariadicOpComponent } from './VariadicOpComponent'
import { SaveLabellingComponent } from './SaveLabellingComponent'
import { LoadLabellingComponent } from './LoadLabellingComponent'
import { SplitLabellingLayerComponent } from './SplitLabellingLayerComponent'
import { AreaComponent } from './AreaComponent'
import { BarChartComponent } from './BarChartComponent'
import { SankeyComponent } from './SankeyComponent'
import { MaskLabellingComponent } from './MaskLabellingComponent'
import { MaskNumericDataComponent } from './MaskNumericDataComponent'
import { InputHabitatComponent } from './InputHabitatComponent'
import { NevoLayerComponent } from './NevoLayerComponent'
import { OSMLandUseComponent } from './OSMLandUseComponent'
import { DigitalModelComponent } from './DigitalModelComponent'

export function createDefaultComponents({ label_schemas, regions }) {
  return [
    new InputLabellingComponent(label_schemas),
    new LoadLabellingComponent(regions, label_schemas),
    new SplitLabellingLayerComponent(label_schemas),
    new InputOverlayComponent(regions),
    new InputHabitatComponent(),
    new OSMLandUseComponent(),
    new NevoLayerComponent(),
    new DigitalModelComponent(),
    new BuildLabellingLayerComponent(label_schemas),
    new NumericConstantComponent(),
    new SaveLabellingComponent(regions),

    new VariadicOpComponent('Union', '⋃', setSocket, setSocket, 'Set operations'),
    new VariadicOpComponent('Intersection', '⋂', setSocket, setSocket, 'Set operations'),
    new BinaryOpComponent('Set difference', '−', setSocket, setSocket, 'Set operations'),
    new VariadicOpComponent('Symmetric difference', 'Δ', setSocket, setSocket, 'Set operations'),
    new UnaryOpComponent('Complement', '′', 'postfix', setSocket, setSocket, 'Set operations'),


    new MaskNumericDataComponent(),
    new VariadicOpComponent('Sum', '∑', mapSocket, mapSocket, 'Arithmetic'),
    new VariadicOpComponent('Product', '∏', mapSocket, mapSocket, 'Arithmetic'),
    new BinaryOpComponent('Add', '+', mapSocket, mapSocket, 'Arithmetic'),
    new BinaryOpComponent('Subtract', '−', mapSocket, mapSocket, 'Arithmetic'),
    new BinaryOpComponent('Multiply', '×', mapSocket, mapSocket, 'Arithmetic'),
    new BinaryOpComponent('Divide', '÷', mapSocket, mapSocket, 'Arithmetic'),
    new BinaryOpComponent('Power', '^', mapSocket, mapSocket, 'Arithmetic'),
    new UnaryOpComponent('Negate', '−', 'prefix', mapSocket, mapSocket, 'Arithmetic'),
    new UnaryOpComponent('Reciprocal', '⁻¹', 'postfix', mapSocket, mapSocket, 'Arithmetic'),

    new BinaryOpComponent('Less', '<', mapSocket, setSocket, 'Comparisons'),
    new BinaryOpComponent('Greater', '>', mapSocket, setSocket, 'Comparisons'),

    new AreaComponent(),

    new BarChartComponent(),
    new SankeyComponent(),

    new DistanceMapComponent(),
    new MaskLabellingComponent(),
  ]
}
