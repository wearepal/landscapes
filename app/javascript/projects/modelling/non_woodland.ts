import { VectorLayerData } from "./components/vector_component"

const noneWoodlandTreesSource = ['nateng:FR_TOW_V1_South_East', 'nateng:FR_TOW_V1_South_West', 'nateng:FR_TOW_V1_Yorkshire_and_Humber', 'nateng:FR_TOW_V1_North_East', 'nateng:FR_TOW_V1_North_West', 'nateng:FR_TOW_V1_West_Midlands', 'nateng:FR_TOW_V1_East_Midlands', 'nateng:FR_TOW_V1_London', 'nateng:FR_TOW_V1_Eastern']

export const noneWoodlandTreesLayer: VectorLayerData[] = [
  {
    name: 'Non-woodland trees (all)',
    source: noneWoodlandTreesSource,
    key: 'Woodland_Type',
    output: 'BooleanTileGrid',
    distributed: false
  },
  {
    name: 'Max height [[m]]',
    source: noneWoodlandTreesSource,
    key: 'MAXHT',
    output: 'NumericTileGrid',
    properties: {
      unit: 'm',
      area: undefined
    },
    distributed: false
  },
  {
    name: 'Min height [[m]]',
    source: noneWoodlandTreesSource,
    key: 'MINHT',
    output: 'NumericTileGrid',
    properties: {
      unit: 'm',
      area: undefined
    },
    distributed: false
  },
  {
    name: 'Mean height [[m]]',
    source: noneWoodlandTreesSource,
    key: 'MEANHT',
    output: 'NumericTileGrid',
    properties: {
      unit: 'm',
      area: undefined
    },
    distributed: false
  },
  {
    name: 'Standard deviation height [[m]]',
    source: noneWoodlandTreesSource,
    key: 'STDVHT',
    output: 'NumericTileGrid',
    properties: {
      unit: 'm',
      area: undefined
    },
    distributed: false
  },
  {
    name: 'Lone trees',
    source: noneWoodlandTreesSource,
    key: 'Woodland_Type',
    value: ['Lone Tree'],
    output: 'BooleanTileGrid',
    distributed: false
  },
  {
    name: 'Group of Trees',
    source: noneWoodlandTreesSource,
    key: 'Woodland_Type',
    value: ['Group of Trees'],
    output: 'BooleanTileGrid',
    distributed: false
  },
  {
    name: 'Small Woodland',
    source: noneWoodlandTreesSource,
    key: 'Woodland_Type',
    value: ['Small Woodland'],
    output: 'BooleanTileGrid',
    distributed: false
  },
  {
    name: 'NFI OHC',
    source: noneWoodlandTreesSource,
    key: 'Woodland_Type',
    value: ['NFI OHC'],
    output: 'BooleanTileGrid',
    distributed: false
  },
  {
    name: 'Woodland Type',
    source: noneWoodlandTreesSource,
    key: 'Woodland_Type',
    value: ['NFI OHC', 'Small Woodland', 'Group of Trees', 'Lone Tree'],
    output: 'CategoricalTileGrid',
    distributed: false
  }


]
