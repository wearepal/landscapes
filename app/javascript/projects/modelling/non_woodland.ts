import { VectorLayerData } from "./components/vector_component"

const nonWoodlandTreesSource = ['nateng:FR_TOW_V1_South_East', 'nateng:FR_TOW_V1_South_West', 'nateng:FR_TOW_V1_Yorkshire_and_Humber', 'nateng:FR_TOW_V1_North_East', 'nateng:FR_TOW_V1_North_West', 'nateng:FR_TOW_V1_West_Midlands', 'nateng:FR_TOW_V1_East_Midlands', 'nateng:FR_TOW_V1_London', 'nateng:FR_TOW_V1_Eastern']
const NFI_Source = ['nateng:National_Forest_Inventory_GB_2023']

const NFI_Categories = ['Non woodland', 'Woodland']
const NFT_IFT_IOA = ['Conifer', 'Broadleaved', 'Mixed mainly conifer', 'Mixed mainly broadleaved', 'Coppice', 'Coppice with standards', 'Shrub', 'Young trees', 'Felled', 'Ground prep', 'Cloud \ shadow', 'Uncertain', 'Low density', 'Assumed woodland', 'Failed', 'Windblow', 'Open water', 'Grassland', 'Agricultural land', 'Urban', 'Road', 'River', 'Powerline', 'Quarry', 'Bare area', 'Windfarm', 'Other vegetation']
export const nationalForestInventoryLayer: VectorLayerData[] = [
  {
    name: 'All',
    source: NFI_Source,
    key: 'CATEGORY',
    output: 'BooleanTileGrid',
    distributed: false,
    wms: false
  }
]

NFI_Categories.forEach(category => {
  nationalForestInventoryLayer.push({
    name: category,
    source: NFI_Source,
    key: 'CATEGORY',
    value: [category],
    output: 'BooleanTileGrid',
    distributed: false,
    wms: false
  })
})

nationalForestInventoryLayer.push({
  name: 'Category',
  source: NFI_Source,
  key: 'CATEGORY',
  value: NFI_Categories,
  output: 'CategoricalTileGrid',
  distributed: false,
  wms: false
})

NFT_IFT_IOA.forEach(category => {
  nationalForestInventoryLayer.push({
    name: category,
    source: NFI_Source,
    key: 'IFT_IOA',
    value: [category],
    output: 'BooleanTileGrid',
    distributed: false,
    wms: false
  })
})

nationalForestInventoryLayer.push({
  name: 'Interpreted Forest Type / Open Area',
  source: NFI_Source,
  key: 'IFT_IOA',
  value: NFT_IFT_IOA,
  output: 'CategoricalTileGrid',
  distributed: false,
  wms: false
})

export const noneWoodlandTreesLayer: VectorLayerData[] = [
  {
    name: 'Non-woodland trees (all)',
    source: nonWoodlandTreesSource,
    key: 'Woodland_Type',
    output: 'BooleanTileGrid',
    distributed: false,
    wms: true,
    wmsTriggerZoom: 20
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
