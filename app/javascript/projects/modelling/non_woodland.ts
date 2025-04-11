import { VectorLayerData } from "./components/vector_component"

const nonWoodlandTreesSource = ['nateng:FR_TOW_V1_South_East', 'nateng:FR_TOW_V1_South_West', 'nateng:FR_TOW_V1_Yorkshire_and_Humber', 'nateng:FR_TOW_V1_North_East', 'nateng:FR_TOW_V1_North_West', 'nateng:FR_TOW_V1_West_Midlands', 'nateng:FR_TOW_V1_East_Midlands', 'nateng:FR_TOW_V1_London', 'nateng:FR_TOW_V1_Eastern']

export const noneWoodlandTreesLayer: VectorLayerData[] = [
  {
    name: 'Non-woodland trees (all)',
    source: nonWoodlandTreesSource,
    key: 'Woodland_Type',
    output: 'BooleanTileGrid',
    distributed: false,
    wms: true
  },
  {
    name: 'Max height [[m]]',
    source: nonWoodlandTreesSource,
    key: 'MAXHT',
    output: 'NumericTileGrid',
    properties: {
      unit: 'm',
      area: undefined,
      type: undefined
    },
    distributed: false,
    wms: false
  },
  {
    name: 'Min height [[m]]',
    source: nonWoodlandTreesSource,
    key: 'MINHT',
    output: 'NumericTileGrid',
    properties: {
      unit: 'm',
      area: undefined,
      type: undefined
    },
    distributed: false,
    wms: false
  },
  {
    name: 'Mean height [[m]]',
    source: nonWoodlandTreesSource,
    key: 'MEANHT',
    output: 'NumericTileGrid',
    properties: {
      unit: 'm',
      area: undefined,
      type: undefined
    },
    distributed: false,
    wms: false
  },
  {
    name: 'Standard deviation height [[m]]',
    source: nonWoodlandTreesSource,
    key: 'STDVHT',
    output: 'NumericTileGrid',
    properties: {
      unit: 'm',
      area: undefined,
      type: undefined
    },
    distributed: false,
    wms: false
  },
  {
    name: 'Lone trees',
    source: nonWoodlandTreesSource,
    key: 'Woodland_Type',
    value: ['Lone Tree'],
    output: 'BooleanTileGrid',
    distributed: false,
    wms: false
  },
  {
    name: 'Group of Trees',
    source: nonWoodlandTreesSource,
    key: 'Woodland_Type',
    value: ['Group of Trees'],
    output: 'BooleanTileGrid',
    distributed: false,
    wms: false
  },
  {
    name: 'Small Woodland',
    source: nonWoodlandTreesSource,
    key: 'Woodland_Type',
    value: ['Small Woodland'],
    output: 'BooleanTileGrid',
    distributed: false,
    wms: false
  },
  {
    name: 'NFI OHC',
    source: nonWoodlandTreesSource,
    key: 'Woodland_Type',
    value: ['NFI OHC'],
    output: 'BooleanTileGrid',
    distributed: false,
    wms: false
  },
  {
    name: 'Woodland Type',
    source: nonWoodlandTreesSource,
    key: 'Woodland_Type',
    value: ['NFI OHC', 'Small Woodland', 'Group of Trees', 'Lone Tree'],
    output: 'CategoricalTileGrid',
    distributed: false,
    wms: false
  }


]
