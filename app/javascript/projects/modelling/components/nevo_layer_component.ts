import { BaseComponent } from "./base_component"
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { Node, Output } from 'rete'
import { numericDataSocket } from "../socket_types"
import { PreviewControl } from "../controls/preview"
import { NumericTileGrid } from "../tile_grid"
import GeoJSON from "ol/format/GeoJSON"
import { createXYZ } from "ol/tilegrid"
import { getArea } from "ol/extent"
import { SelectControl } from "../controls/select"
import { Geometry } from "ol/geom"
import { Feature } from "ol"

import { currentBbox as bbox, currentExtent as extent } from "../bounding_box"


interface LayerProperty {
    code: string
    name: string
    id: number
}

const geoServer = "https://geo.leep.exeter.ac.uk/geoserver/nevo/wfs?"
const zoom = 20


async function retrieveLandCoverData(bbox: string): Promise<Object> {

    const response = await fetch(
        geoServer +
        new URLSearchParams(
            {
                outputFormat: 'application/json',
                request: 'GetFeature',
                typeName: 'nevo:explore_2km_rounded',
                srsName: 'EPSG:3857',
                bbox
            }
        )
    )

    if (!response.ok) throw new Error()

    return await response.json()
}

export const LayerProperties: LayerProperty[] = [
    {
        "code": "tot_area",
        "name": "tot_area - total hectare area of spatial unit",
        "id": 0
    },
    {
        "code": "wood_ha",
        "name": "wood_ha - woodland hectares",
        "id": 1
    },
    {
        "code": "sngrass_ha",
        "name": "sngrass_ha - semi-natural grassland hectares",
        "id": 2
    },
    {
        "code": "urban_ha",
        "name": "urban_ha - urban hectares",
        "id": 3
    },
    {
        "code": "water_ha",
        "name": "water_ha - water hectares",
        "id": 4
    },
    {
        "code": "farm_ha",
        "name": "farm_ha - farmland hectares",
        "id": 5
    },
    {
        "code": "arable_ha_20",
        "name": "arable_ha_20 - predicted annual arable hectares in 2020s",
        "id": 6
    },
    {
        "code": "arable_ha_30",
        "name": "arable_ha_30 - predicted annual arable hectares in 2030s",
        "id": 7
    },
    {
        "code": "arable_ha_40",
        "name": "arable_ha_40 - predicted annual arable hectares in 2040s",
        "id": 8
    },
    {
        "code": "arable_ha_50",
        "name": "arable_ha_50 - predicted annual arable hectares in 2050s",
        "id": 9
    },
    {
        "code": "grass_ha_20",
        "name": "grass_ha_20 - predicted annual farm grassland hectares in 2020s",
        "id": 10
    },
    {
        "code": "grass_ha_30",
        "name": "grass_ha_30 - predicted annual farm grassland hectares in 2030s",
        "id": 11
    },
    {
        "code": "grass_ha_40",
        "name": "grass_ha_40 - predicted annual farm grassland hectares in 2040s",
        "id": 12
    },
    {
        "code": "grass_ha_50",
        "name": "grass_ha_50 - predicted annual farm grassland hectares in 2050s",
        "id": 13
    },
    {
        "code": "wheat_ha_20",
        "name": "wheat_ha_20 - predicted annual wheat hectares in 2020s",
        "id": 14
    },
    {
        "code": "wheat_ha_30",
        "name": "wheat_ha_30 - predicted annual wheat hectares in 2030s",
        "id": 15
    },
    {
        "code": "wheat_ha_40",
        "name": "wheat_ha_40 - predicted annual wheat hectares in 2040s",
        "id": 16
    },
    {
        "code": "wheat_ha_50",
        "name": "wheat_ha_50 - predicted annual wheat hectares in 2050s",
        "id": 17
    },
    {
        "code": "osr_ha_20",
        "name": "osr_ha_20 - predicted annual oil seed rape hectares in 2020s",
        "id": 18
    },
    {
        "code": "osr_ha_30",
        "name": "osr_ha_30 - predicted annual oil seed rape hectares in 2030s",
        "id": 19
    },
    {
        "code": "osr_ha_40",
        "name": "osr_ha_40 - predicted annual oil seed rape hectares in 2040s",
        "id": 20
    },
    {
        "code": "osr_ha_50",
        "name": "osr_ha_50 - predicted annual oil seed rape hectares in 2050s",
        "id": 21
    },
    {
        "code": "wbar_ha_20",
        "name": "wbar_ha_20 - predicted annual winter barley hectares in 2020s",
        "id": 22
    },
    {
        "code": "wbar_ha_30",
        "name": "wbar_ha_30 - predicted annual winter barley hectares in 2030s",
        "id": 23
    },
    {
        "code": "wbar_ha_40",
        "name": "wbar_ha_40 - predicted annual winter barley hectares in 2040s",
        "id": 24
    },
    {
        "code": "wbar_ha_50",
        "name": "wbar_ha_50 - predicted annual winter barley hectares in 2050s",
        "id": 25
    },
    {
        "code": "sbar_ha_20",
        "name": "sbar_ha_20 - predicted annual spring barley hectares in 2020s",
        "id": 26
    },
    {
        "code": "sbar_ha_30",
        "name": "sbar_ha_30 - predicted annual spring barley hectares in 2030s",
        "id": 27
    },
    {
        "code": "sbar_ha_40",
        "name": "sbar_ha_40 - predicted annual spring barley hectares in 2040s",
        "id": 28
    },
    {
        "code": "sbar_ha_50",
        "name": "sbar_ha_50 - predicted annual spring barley hectares in 2050s",
        "id": 29
    },
    {
        "code": "pot_ha_20",
        "name": "pot_ha_20 - predicted annual potato hectares in 2020s",
        "id": 30
    },
    {
        "code": "pot_ha_30",
        "name": "pot_ha_30 - predicted annual potato hectares in 2030s",
        "id": 31
    },
    {
        "code": "pot_ha_40",
        "name": "pot_ha_40 - predicted annual potato hectares in 2040s",
        "id": 32
    },
    {
        "code": "pot_ha_50",
        "name": "pot_ha_50 - predicted annual potato hectares in 2050s",
        "id": 33
    },
    {
        "code": "sb_ha_20",
        "name": "sb_ha_20 - predicted annual sugarbeet hectares in 2020s",
        "id": 34
    },
    {
        "code": "sb_ha_30",
        "name": "sb_ha_30 - predicted annual sugarbeet hectares in 2030s",
        "id": 35
    },
    {
        "code": "sb_ha_40",
        "name": "sb_ha_40 - predicted annual sugarbeet hectares in 2040s",
        "id": 36
    },
    {
        "code": "sb_ha_50",
        "name": "sb_ha_50 - predicted annual sugarbeet hectares in 2050s",
        "id": 37
    },
    {
        "code": "other_ha_20",
        "name": "other_ha_20 - predicted annual other farmland hectares in 2020s",
        "id": 38
    },
    {
        "code": "other_ha_30",
        "name": "other_ha_30 - predicted annual other farmland hectares in 2030s",
        "id": 39
    },
    {
        "code": "other_ha_40",
        "name": "other_ha_40 - predicted annual other farmland hectares in 2040s",
        "id": 40
    },
    {
        "code": "other_ha_50",
        "name": "other_ha_50 - predicted annual other farmland hectares in 2050s",
        "id": 41
    },
    {
        "code": "pgrass_ha_20",
        "name": "pgrass_ha_20 - predicted annual permanent grassland hectares in 2020s",
        "id": 42
    },
    {
        "code": "pgrass_ha_30",
        "name": "pgrass_ha_30 - predicted annual permanent grassland hectares in 2030s",
        "id": 43
    },
    {
        "code": "pgrass_ha_40",
        "name": "pgrass_ha_40 - predicted annual permanent grassland hectares in 2040s",
        "id": 44
    },
    {
        "code": "pgrass_ha_50",
        "name": "pgrass_ha_50 - predicted annual permanent grassland hectares in 2050s",
        "id": 45
    },
    {
        "code": "tgrass_ha_20",
        "name": "tgrass_ha_20 - predicted annual temporary grassland hectares in 2020s",
        "id": 46
    },
    {
        "code": "tgrass_ha_30",
        "name": "tgrass_ha_30 - predicted annual temporary grassland hectares in 2030s",
        "id": 47
    },
    {
        "code": "tgrass_ha_40",
        "name": "tgrass_ha_40 - predicted annual temporary grassland hectares in 2040s",
        "id": 48
    },
    {
        "code": "tgrass_ha_50",
        "name": "tgrass_ha_50 - predicted annual temporary grassland hectares in 2050s",
        "id": 49
    },
    {
        "code": "rgraz_ha_20",
        "name": "rgraz_ha_20 - predicted annual rough grazing hectares in 2020s",
        "id": 50
    },
    {
        "code": "rgraz_ha_30",
        "name": "rgraz_ha_30 - predicted annual rough grazing hectares in 2030s",
        "id": 51
    },
    {
        "code": "rgraz_ha_40",
        "name": "rgraz_ha_40 - predicted annual rough grazing hectares in 2040s",
        "id": 52
    },
    {
        "code": "rgraz_ha_50",
        "name": "rgraz_ha_50 - predicted annual rough grazing hectares in 2050s",
        "id": 53
    },
    {
        "code": "dairy_20",
        "name": "dairy_20 - predicted annual dairy heads in 2020s",
        "id": 54
    },
    {
        "code": "dairy_30",
        "name": "dairy_30 - predicted annual dairy heads in 2030s",
        "id": 55
    },
    {
        "code": "dairy_40",
        "name": "dairy_40 - predicted annual dairy heads in 2040s",
        "id": 56
    },
    {
        "code": "dairy_50",
        "name": "dairy_50 - predicted annual dairy heads in 2050s",
        "id": 57
    },
    {
        "code": "beef_20",
        "name": "beef_20 - predicted annual beef heads in 2020s",
        "id": 58
    },
    {
        "code": "beef_30",
        "name": "beef_30 - predicted annual beef heads in 2030s",
        "id": 59
    },
    {
        "code": "beef_40",
        "name": "beef_40 - predicted annual beef heads in 2040s",
        "id": 60
    },
    {
        "code": "beef_50",
        "name": "beef_50 - predicted annual beef heads in 2050s",
        "id": 61
    },
    {
        "code": "sheep_20",
        "name": "sheep_20 - predicted annual sheep heads in 2020s",
        "id": 62
    },
    {
        "code": "sheep_30",
        "name": "sheep_30 - predicted annual sheep heads in 2030s",
        "id": 63
    },
    {
        "code": "sheep_40",
        "name": "sheep_40 - predicted annual sheep heads in 2040s",
        "id": 64
    },
    {
        "code": "sheep_50",
        "name": "sheep_50 - predicted annual sheep heads in 2050s",
        "id": 65
    },
    {
        "code": "livestock_20",
        "name": "livestock_20 - predicted annual livestock heads in 2020s",
        "id": 66
    },
    {
        "code": "livestock_30",
        "name": "livestock_30 - predicted annual livestock heads in 2030s",
        "id": 67
    },
    {
        "code": "livestock_40",
        "name": "livestock_40 - predicted annual livestock heads in 2040s",
        "id": 68
    },
    {
        "code": "livestock_50",
        "name": "livestock_50 - predicted annual livestock heads in 2050s",
        "id": 69
    },
    {
        "code": "wheat_food_20",
        "name": "wheat_food_20 - predicted annual wheat yield (kg) in 2020s",
        "id": 70
    },
    {
        "code": "wheat_food_30",
        "name": "wheat_food_30 - predicted annual wheat yield (kg) in 2030s",
        "id": 71
    },
    {
        "code": "wheat_food_40",
        "name": "wheat_food_40 - predicted annual wheat yield (kg) in 2040s",
        "id": 72
    },
    {
        "code": "wheat_food_50",
        "name": "wheat_food_50 - predicted annual wheat yield (kg) in 2050s",
        "id": 73
    },
    {
        "code": "osr_food_20",
        "name": "osr_food_20 - predicted annual oil seed rape yield (kg) in 2020s",
        "id": 74
    },
    {
        "code": "osr_food_30",
        "name": "osr_food_30 - predicted annual oil seed rape yield (kg) in 2030s",
        "id": 75
    },
    {
        "code": "osr_food_40",
        "name": "osr_food_40 - predicted annual oil seed rape yield (kg) in 2040s",
        "id": 76
    },
    {
        "code": "osr_food_50",
        "name": "osr_food_50 - predicted annual oil seed rape yield (kg) in 2050s",
        "id": 77
    },
    {
        "code": "wbar_food_20",
        "name": "wbar_food_20 - predicted annual winter barley yield (kg) in 2020s",
        "id": 78
    },
    {
        "code": "wbar_food_30",
        "name": "wbar_food_30 - predicted annual winter barley yield (kg) in 2030s",
        "id": 79
    },
    {
        "code": "wbar_food_40",
        "name": "wbar_food_40 - predicted annual winter barley yield (kg) in 2040s",
        "id": 80
    },
    {
        "code": "wbar_food_50",
        "name": "wbar_food_50 - predicted annual winter barley yield (kg) in 2050s",
        "id": 81
    },
    {
        "code": "sbar_food_20",
        "name": "sbar_food_20 - predicted annual spring barley yield (kg) in 2020s",
        "id": 82
    },
    {
        "code": "sbar_food_30",
        "name": "sbar_food_30 - predicted annual spring barley yield (kg) in 2030s",
        "id": 83
    },
    {
        "code": "sbar_food_40",
        "name": "sbar_food_40 - predicted annual spring barley yield (kg) in 2040s",
        "id": 84
    },
    {
        "code": "sbar_food_50",
        "name": "sbar_food_50 - predicted annual spring barley yield (kg) in 2050s",
        "id": 85
    },
    {
        "code": "pot_food_20",
        "name": "pot_food_20 - predicted annual potato yield (kg) in 2020s",
        "id": 86
    },
    {
        "code": "pot_food_30",
        "name": "pot_food_30 - predicted annual potato yield (kg) in 2030s",
        "id": 87
    },
    {
        "code": "pot_food_40",
        "name": "pot_food_40 - predicted annual potato yield (kg) in 2040s",
        "id": 88
    },
    {
        "code": "pot_food_50",
        "name": "pot_food_50 - predicted annual potato yield (kg) in 2050s",
        "id": 89
    },
    {
        "code": "sb_food_20",
        "name": "sb_food_20 - predicted annual sugarbeet yield (kg) in 2020s",
        "id": 90
    },
    {
        "code": "sb_food_30",
        "name": "sb_food_30 - predicted annual sugarbeet yield (kg) in 2030s",
        "id": 91
    },
    {
        "code": "sb_food_40",
        "name": "sb_food_40 - predicted annual sugarbeet yield (kg) in 2040s",
        "id": 92
    },
    {
        "code": "sb_food_50",
        "name": "sb_food_50 - predicted annual sugarbeet yield (kg) in 2050s",
        "id": 93
    },
    {
        "code": "food_20",
        "name": "food_20 - predicted annual crop yield (kg) in 2020s",
        "id": 94
    },
    {
        "code": "food_30",
        "name": "food_30 - predicted annual crop yield (kg) in 2030s",
        "id": 95
    },
    {
        "code": "food_40",
        "name": "food_40 - predicted annual crop yield (kg) in 2040s",
        "id": 96
    },
    {
        "code": "food_50",
        "name": "food_50 - predicted annual crop yield (kg) in 2050s",
        "id": 97
    },
    {
        "code": "arable_profit_ann",
        "name": "arable_profit_ann - predicted annual arable profit",
        "id": 98
    },
    {
        "code": "livestock_profit_ann",
        "name": "livestock_profit_ann - predicted annual livestock profit",
        "id": 99
    },
    {
        "code": "farm_profit_ann",
        "name": "farm_profit_ann - predicted annual farm profit",
        "id": 100
    },
    {
        "code": "arable_profit_flow_20",
        "name": "arable_profit_flow_20 - predicted annual arable profit in 2020s",
        "id": 101
    },
    {
        "code": "arable_profit_flow_30",
        "name": "arable_profit_flow_30 - predicted annual arable profit in 2030s",
        "id": 102
    },
    {
        "code": "arable_profit_flow_40",
        "name": "arable_profit_flow_40 - predicted annual arable profit in 2040s",
        "id": 103
    },
    {
        "code": "arable_profit_flow_50",
        "name": "arable_profit_flow_50 - predicted annual arable profit in 2050s",
        "id": 104
    },
    {
        "code": "livestock_profit_flow_20",
        "name": "livestock_profit_flow_20 - predicted annual livestock profit in 2020s",
        "id": 105
    },
    {
        "code": "livestock_profit_flow_30",
        "name": "livestock_profit_flow_30 - predicted annual livestock profit in 2030s",
        "id": 106
    },
    {
        "code": "livestock_profit_flow_40",
        "name": "livestock_profit_flow_40 - predicted annual livestock profit in 2040s",
        "id": 107
    },
    {
        "code": "livestock_profit_flow_50",
        "name": "livestock_profit_flow_50 - predicted annual livestock profit in 2050s",
        "id": 108
    },
    {
        "code": "farm_profit_flow_20",
        "name": "farm_profit_flow_20 - predicted annual farm profit in 2020s",
        "id": 109
    },
    {
        "code": "farm_profit_flow_30",
        "name": "farm_profit_flow_30 - predicted annual farm profit in 2030s",
        "id": 110
    },
    {
        "code": "farm_profit_flow_40",
        "name": "farm_profit_flow_40 - predicted annual farm profit in 2040s",
        "id": 111
    },
    {
        "code": "farm_profit_flow_50",
        "name": "farm_profit_flow_50 - predicted annual farm profit in 2050s",
        "id": 112
    },
    {
        "code": "ghg_arable_20",
        "name": "ghg_arable_20 - predicted annual greenhouse gas sequestration from arable in 2020s",
        "id": 113
    },
    {
        "code": "ghg_arable_30",
        "name": "ghg_arable_30 - predicted annual greenhouse gas sequestration from arable in 2030s",
        "id": 114
    },
    {
        "code": "ghg_arable_40",
        "name": "ghg_arable_40 - predicted annual greenhouse gas sequestration from arable in 2040s",
        "id": 115
    },
    {
        "code": "ghg_arable_50",
        "name": "ghg_arable_50 - predicted annual greenhouse gas sequestration from arable in 2050s",
        "id": 116
    },
    {
        "code": "ghg_grass_20",
        "name": "ghg_grass_20 - predicted annual greenhouse gas sequestration from farm grassland in 2020s",
        "id": 117
    },
    {
        "code": "ghg_grass_30",
        "name": "ghg_grass_30 - predicted annual greenhouse gas sequestration from farm grassland in 2030s",
        "id": 118
    },
    {
        "code": "ghg_grass_40",
        "name": "ghg_grass_40 - predicted annual greenhouse gas sequestration from farm grassland in 2040s",
        "id": 119
    },
    {
        "code": "ghg_grass_50",
        "name": "ghg_grass_50 - predicted annual greenhouse gas sequestration from farm grassland in 2050s",
        "id": 120
    },
    {
        "code": "ghg_livestock_20",
        "name": "ghg_livestock_20 - predicted annual greenhouse gas sequestration from livestock in 2020s",
        "id": 121
    },
    {
        "code": "ghg_livestock_30",
        "name": "ghg_livestock_30 - predicted annual greenhouse gas sequestration from livestock in 2030s",
        "id": 122
    },
    {
        "code": "ghg_livestock_40",
        "name": "ghg_livestock_40 - predicted annual greenhouse gas sequestration from livestock in 2040s",
        "id": 123
    },
    {
        "code": "ghg_livestock_50",
        "name": "ghg_livestock_50 - predicted annual greenhouse gas sequestration from livestock in 2050s",
        "id": 124
    },
    {
        "code": "ghg_farm_20",
        "name": "ghg_farm_20 - predicted annual greenhouse gas sequestration from farm in 2020s",
        "id": 125
    },
    {
        "code": "ghg_farm_30",
        "name": "ghg_farm_30 - predicted annual greenhouse gas sequestration from farm in 2030s",
        "id": 126
    },
    {
        "code": "ghg_farm_40",
        "name": "ghg_farm_40 - predicted annual greenhouse gas sequestration from farm in 2040s",
        "id": 127
    },
    {
        "code": "ghg_farm_50",
        "name": "ghg_farm_50 - predicted annual greenhouse gas sequestration from farm in 2050s",
        "id": 128
    },
    {
        "code": "ghg_arable_ann",
        "name": "ghg_arable_ann - predicted annual greenhouse gas sequestration value from arable",
        "id": 129
    },
    {
        "code": "ghg_grass_ann",
        "name": "ghg_grass_ann - predicted annual greenhouse gas sequestration value from farm grassland",
        "id": 130
    },
    {
        "code": "ghg_livestock_ann",
        "name": "ghg_livestock_ann - predicted annual greenhouse gas sequestration value from livestock",
        "id": 131
    },
    {
        "code": "ghg_farm_ann",
        "name": "ghg_farm_ann - predicted annual greenhouse gas sequestration value from farm",
        "id": 132
    },
    {
        "code": "ghg_arable_flow_20",
        "name": "ghg_arable_flow_20 - predicted annual greenhouse gas sequestration value from arable in 2020s",
        "id": 133
    },
    {
        "code": "ghg_arable_flow_30",
        "name": "ghg_arable_flow_30 - predicted annual greenhouse gas sequestration value from arable in 2030s",
        "id": 134
    },
    {
        "code": "ghg_arable_flow_40",
        "name": "ghg_arable_flow_40 - predicted annual greenhouse gas sequestration value from arable in 2040s",
        "id": 135
    },
    {
        "code": "ghg_arable_flow_50",
        "name": "ghg_arable_flow_50 - predicted annual greenhouse gas sequestration value from arable in 2050s",
        "id": 136
    },
    {
        "code": "ghg_grass_flow_20",
        "name": "ghg_grass_flow_20 - predicted annual greenhouse gas sequestration value from farm grassland in 2020s",
        "id": 137
    },
    {
        "code": "ghg_grass_flow_30",
        "name": "ghg_grass_flow_30 - predicted annual greenhouse gas sequestration value from farm grassland in 2030s",
        "id": 138
    },
    {
        "code": "ghg_grass_flow_40",
        "name": "ghg_grass_flow_40 - predicted annual greenhouse gas sequestration value from farm grassland in 2040s",
        "id": 139
    },
    {
        "code": "ghg_grass_flow_50",
        "name": "ghg_grass_flow_50 - predicted annual greenhouse gas sequestration value from farm grassland in 2050s",
        "id": 140
    },
    {
        "code": "ghg_livestock_flow_20",
        "name": "ghg_livestock_flow_20 - predicted annual greenhouse gas sequestration value from livestock in 2020s",
        "id": 141
    },
    {
        "code": "ghg_livestock_flow_30",
        "name": "ghg_livestock_flow_30 - predicted annual greenhouse gas sequestration value from livestock in 2030s",
        "id": 142
    },
    {
        "code": "ghg_livestock_flow_40",
        "name": "ghg_livestock_flow_40 - predicted annual greenhouse gas sequestration value from livestock in 2040s",
        "id": 143
    },
    {
        "code": "ghg_livestock_flow_50",
        "name": "ghg_livestock_flow_50 - predicted annual greenhouse gas sequestration value from livestock in 2050s",
        "id": 144
    },
    {
        "code": "ghg_farm_flow_20",
        "name": "ghg_farm_flow_20 - predicted annual greenhouse gas sequestration value from farm in 2020s",
        "id": 145
    },
    {
        "code": "ghg_farm_flow_30",
        "name": "ghg_farm_flow_30 - predicted annual greenhouse gas sequestration value from farm in 2030s",
        "id": 146
    },
    {
        "code": "ghg_farm_flow_40",
        "name": "ghg_farm_flow_40 - predicted annual greenhouse gas sequestration value from farm in 2040s",
        "id": 147
    },
    {
        "code": "ghg_farm_flow_50",
        "name": "ghg_farm_flow_50 - predicted annual greenhouse gas sequestration value from farm in 2050s",
        "id": 148
    },
    {
        "code": "nfwood_ha",
        "name": "nfwood_ha - non-farm woodland hectares",
        "id": 149
    },
    {
        "code": "fwood_ha",
        "name": "fwood_ha - farm woodland hectares",
        "id": 150
    },
    {
        "code": "broad_ha",
        "name": "broad_ha - broadleaf woodland hectares",
        "id": 151
    },
    {
        "code": "conif_ha",
        "name": "conif_ha - coniferous woodland hectares",
        "id": 152
    },
    {
        "code": "wood_mgmt_ha",
        "name": "wood_mgmt_ha - managed woodland hectares",
        "id": 153
    },
    {
        "code": "wood_nmgmt_ha",
        "name": "wood_nmgmt_ha - non-managed woodland hectares",
        "id": 154
    },
    {
        "code": "broad_mgmt_ha",
        "name": "broad_mgmt_ha - managed broadleaf woodland hectares",
        "id": 155
    },
    {
        "code": "conif_mgmt_ha",
        "name": "conif_mgmt_ha - managed coniferous woodland hectares",
        "id": 156
    },
    {
        "code": "broad_nmgmt_ha",
        "name": "broad_nmgmt_ha - non-managed broadleaf hectares",
        "id": 157
    },
    {
        "code": "conif_nmgmt_ha",
        "name": "conif_nmgmt_ha - non-managed coniferous hectares",
        "id": 158
    },
    {
        "code": "broad_yc_20",
        "name": "broad_yc_20 - predicted broadleaf yield class in 2020s",
        "id": 159
    },
    {
        "code": "broad_yc_30",
        "name": "broad_yc_30 - predicted broadleaf yield class in 2030s",
        "id": 160
    },
    {
        "code": "broad_yc_40",
        "name": "broad_yc_40 - predicted broadleaf yield class in 2040s",
        "id": 161
    },
    {
        "code": "broad_yc_50",
        "name": "broad_yc_50 - predicted broadleaf yield class in 2050s",
        "id": 162
    },
    {
        "code": "conif_yc_20",
        "name": "conif_yc_20 - predicted coniferous yield class in 2020s",
        "id": 163
    },
    {
        "code": "conif_yc_30",
        "name": "conif_yc_30 - predicted coniferous yield class in 2030s",
        "id": 164
    },
    {
        "code": "conif_yc_40",
        "name": "conif_yc_40 - predicted coniferous yield class in 2040s",
        "id": 165
    },
    {
        "code": "conif_yc_50",
        "name": "conif_yc_50 - predicted coniferous yield class in 2050s",
        "id": 166
    },
    {
        "code": "broad_rp",
        "name": "broad_rp - predicted broadleaf rotation period",
        "id": 167
    },
    {
        "code": "conif_rp",
        "name": "conif_rp - predicted coniferous rotation period",
        "id": 168
    },
    {
        "code": "timber_broad_yr",
        "name": "timber_broad_yr - predicted annual timber volume (cubic metres) from 100% broadleaf managed woodland",
        "id": 169
    },
    {
        "code": "timber_conif_yr",
        "name": "timber_conif_yr - predicted annual timber volume (cubic metres) from 100% coniferous managed woodland",
        "id": 170
    },
    {
        "code": "timber_mixed_yr",
        "name": "timber_mixed_yr - predicted annual timber volume (cubic metres) from 60% broadleaf 40% coniferous managed woodland",
        "id": 171
    },
    {
        "code": "timber_current_yr",
        "name": "timber_current_yr - predicted annual timber volume (cubic metres) from managed woodland with current broadleaf coniferous mix",
        "id": 172
    },
    {
        "code": "timber_broad_50",
        "name": "timber_broad_50 - predicted annual timber volume (cubic metres) from 100% broadleaf managed woodland in 2050s",
        "id": 173
    },
    {
        "code": "timber_conif_40",
        "name": "timber_conif_40 - predicted annual timber volume (cubic metres) from 100% coniferous managed woodland in 2040s",
        "id": 174
    },
    {
        "code": "timber_conif_50",
        "name": "timber_conif_50 - predicted annual timber volume (cubic metres) from 100% coniferous managed woodland in 2050s",
        "id": 175
    },
    {
        "code": "timber_mixed_40",
        "name": "timber_mixed_40 - predicted annual timber volume (cubic metres) from 60% broadleaf 40% coniferous managed woodland in 2040s",
        "id": 176
    },
    {
        "code": "timber_mixed_50",
        "name": "timber_mixed_50 - predicted annual timber volume (cubic metres) from 60% broadleaf 40% coniferous managed woodland in 2050s",
        "id": 177
    },
    {
        "code": "timber_current_40",
        "name": "timber_current_40 - predicted annual timber volume (cubic metres) from managed woodland with current broadleaf coniferous mix in 2040s",
        "id": 178
    },
    {
        "code": "timber_current_50",
        "name": "timber_current_50 - predicted annual timber volume (cubic metres) from managed woodland with current broadleaf coniferous mix in 2050s",
        "id": 179
    },
    {
        "code": "timber_broad_ann",
        "name": "timber_broad_ann - predicted annual timber value from 100% broadleaf managed woodland",
        "id": 180
    },
    {
        "code": "timber_conif_ann",
        "name": "timber_conif_ann - predicted annual timber values from 100% coniferous managed woodland",
        "id": 181
    },
    {
        "code": "timber_mixed_ann",
        "name": "timber_mixed_ann - predicted annual timber values from 60% broadleaf 40% coniferous managed woodland",
        "id": 182
    },
    {
        "code": "timber_current_ann",
        "name": "timber_current_ann - predicted annual timber values from managed woodland with current broadleaf coniferous mix",
        "id": 183
    },
    {
        "code": "timber_broad_flow_20",
        "name": "timber_broad_flow_20 - predicted annual timber value from 100% broadleaf managed woodland in 2020s",
        "id": 184
    },
    {
        "code": "timber_broad_flow_30",
        "name": "timber_broad_flow_30 - predicted annual timber value from 100% broadleaf managed woodland in 2030s",
        "id": 185
    },
    {
        "code": "timber_broad_flow_40",
        "name": "timber_broad_flow_40 - predicted annual timber value from 100% broadleaf managed woodland in 2040s",
        "id": 186
    },
    {
        "code": "timber_broad_flow_50",
        "name": "timber_broad_flow_50 - predicted annual timber value from 100% broadleaf managed woodland in 2050s",
        "id": 187
    },
    {
        "code": "timber_conif_flow_20",
        "name": "timber_conif_flow_20 - predicted annual timber values from 100% coniferous managed woodland in 2020s",
        "id": 188
    },
    {
        "code": "timber_conif_flow_30",
        "name": "timber_conif_flow_30 - predicted annual timber values from 100% coniferous managed woodland in 2030s",
        "id": 189
    },
    {
        "code": "timber_conif_flow_40",
        "name": "timber_conif_flow_40 - predicted annual timber values from 100% coniferous managed woodland in 2040s",
        "id": 190
    },
    {
        "code": "timber_conif_flow_50",
        "name": "timber_conif_flow_50 - predicted annual timber values from 100% coniferous managed woodland in 2050s",
        "id": 191
    },
    {
        "code": "timber_mixed_flow_20",
        "name": "timber_mixed_flow_20 - predicted annual timber values from 60% broadleaf 40% coniferous managed woodland in 2020s",
        "id": 192
    },
    {
        "code": "timber_mixed_flow_30",
        "name": "timber_mixed_flow_30 - predicted annual timber values from 60% broadleaf 40% coniferous managed woodland in 2030s",
        "id": 193
    },
    {
        "code": "timber_mixed_flow_40",
        "name": "timber_mixed_flow_40 - predicted annual timber values from 60% broadleaf 40% coniferous managed woodland in 2040s",
        "id": 194
    },
    {
        "code": "timber_mixed_flow_50",
        "name": "timber_mixed_flow_50 - predicted annual timber values from 60% broadleaf 40% coniferous managed woodland in 2050s",
        "id": 195
    },
    {
        "code": "timber_current_flow_20",
        "name": "timber_current_flow_20 - predicted annual timber values from managed woodland with current broadleaf coniferous mix in 2020s",
        "id": 196
    },
    {
        "code": "timber_current_flow_30",
        "name": "timber_current_flow_30 - predicted annual timber values from managed woodland with current broadleaf coniferous mix in 2030s",
        "id": 197
    },
    {
        "code": "timber_current_flow_40",
        "name": "timber_current_flow_40 - predicted annual timber values from managed woodland with current broadleaf coniferous mix in 2040s",
        "id": 198
    },
    {
        "code": "timber_current_flow_50",
        "name": "timber_current_flow_50 - predicted annual timber values from managed woodland with current broadleaf coniferous mix in 2050s",
        "id": 199
    },
    {
        "code": "ghg_broad_yr",
        "name": "ghg_broad_yr - predicted annual greenhouse gas sequestration from 100% broadleaf managed woodland",
        "id": 200
    },
    {
        "code": "ghg_conif_yr",
        "name": "ghg_conif_yr - predicted annual greenhouse gas sequestration from 100% coniferous managed woodland",
        "id": 201
    },
    {
        "code": "ghg_mixed_yr",
        "name": "ghg_mixed_yr - predicted annual greenhouse gas sequestration from 60% broadleaf 40% coniferous managed woodland",
        "id": 202
    },
    {
        "code": "ghg_current_yr",
        "name": "ghg_current_yr - predicted annual greenhouse gas sequestration from managed woodland with current broadleaf coniferous mix",
        "id": 203
    },
    {
        "code": "ghg_broad_30",
        "name": "ghg_broad_30 - predicted annual greenhouse gas sequestration from 100% broadleaf managed woodland in 2030s",
        "id": 204
    },
    {
        "code": "ghg_broad_40",
        "name": "ghg_broad_40 - predicted annual greenhouse gas sequestration from 100% broadleaf managed woodland in 2040s",
        "id": 205
    },
    {
        "code": "ghg_broad_50",
        "name": "ghg_broad_50 - predicted annual greenhouse gas sequestration from 100% broadleaf managed woodland in 2050s",
        "id": 206
    },
    {
        "code": "ghg_conif_20",
        "name": "ghg_conif_20 - predicted annual greenhouse gas sequestration from 100% coniferous managed woodland in 2020s",
        "id": 207
    },
    {
        "code": "ghg_conif_30",
        "name": "ghg_conif_30 - predicted annual greenhouse gas sequestration from 100% coniferous managed woodland in 2030s",
        "id": 208
    },
    {
        "code": "ghg_conif_40",
        "name": "ghg_conif_40 - predicted annual greenhouse gas sequestration from 100% coniferous managed woodland in 2040s",
        "id": 209
    },
    {
        "code": "ghg_conif_50",
        "name": "ghg_conif_50 - predicted annual greenhouse gas sequestration from 100% coniferous managed woodland in 2050s",
        "id": 210
    },
    {
        "code": "ghg_mixed_30",
        "name": "ghg_mixed_30 - predicted annual greenhouse gas sequestration from 60% broadleaf 40% coniferous managed woodland in 2030s",
        "id": 211
    },
    {
        "code": "ghg_mixed_40",
        "name": "ghg_mixed_40 - predicted annual greenhouse gas sequestration from 60% broadleaf 40% coniferous managed woodland in 2040s",
        "id": 212
    },
    {
        "code": "ghg_mixed_50",
        "name": "ghg_mixed_50 - predicted annual greenhouse gas sequestration from 60% broadleaf 40% coniferous managed woodland in 2050s",
        "id": 213
    },
    {
        "code": "ghg_current_30",
        "name": "ghg_current_30 - predicted annual greenhouse gas sequestration from managed woodland with current broadleaf coniferous mix in 2030s",
        "id": 214
    },
    {
        "code": "ghg_current_40",
        "name": "ghg_current_40 - predicted annual greenhouse gas sequestration from managed woodland with current broadleaf coniferous mix in 2040s",
        "id": 215
    },
    {
        "code": "ghg_current_50",
        "name": "ghg_current_50 - predicted annual greenhouse gas sequestration from managed woodland with current broadleaf coniferous mix in 2050s",
        "id": 216
    },
    {
        "code": "ghg_broad_ann",
        "name": "ghg_broad_ann - predicted annual greenhouse gas sequestration value from 100% broadleaf managed woodland",
        "id": 217
    },
    {
        "code": "ghg_conif_ann",
        "name": "ghg_conif_ann - predicted annual greenhouse gas sequestration value from 100% coniferous managed woodland",
        "id": 218
    },
    {
        "code": "ghg_mixed_ann",
        "name": "ghg_mixed_ann - predicted annual greenhouse gas sequestration value from 60% broadleaf 40% coniferous managed woodland",
        "id": 219
    },
    {
        "code": "ghg_current_ann",
        "name": "ghg_current_ann - predicted annual greenhouse gas sequestration value from managed woodland from current broadleaf coniferous mix",
        "id": 220
    },
    {
        "code": "ghg_broad_flow_20",
        "name": "ghg_broad_flow_20 - predicted annual greenhouse gas sequestration value from 100% broadleaf managed woodland in 2020s",
        "id": 221
    },
    {
        "code": "ghg_broad_flow_30",
        "name": "ghg_broad_flow_30 - predicted annual greenhouse gas sequestration value from 100% broadleaf managed woodland in 2030s",
        "id": 222
    },
    {
        "code": "ghg_broad_flow_40",
        "name": "ghg_broad_flow_40 - predicted annual greenhouse gas sequestration value from 100% broadleaf managed woodland in 2040s",
        "id": 223
    },
    {
        "code": "ghg_broad_flow_50",
        "name": "ghg_broad_flow_50 - predicted annual greenhouse gas sequestration value from 100% broadleaf managed woodland in 2050s",
        "id": 224
    },
    {
        "code": "ghg_conif_flow_20",
        "name": "ghg_conif_flow_20 - predicted annual greenhouse gas sequestration value from 100% coniferous managed woodland in 2020s",
        "id": 225
    },
    {
        "code": "ghg_conif_flow_30",
        "name": "ghg_conif_flow_30 - predicted annual greenhouse gas sequestration value from 100% coniferous managed woodland in 2030s",
        "id": 226
    },
    {
        "code": "ghg_conif_flow_40",
        "name": "ghg_conif_flow_40 - predicted annual greenhouse gas sequestration value from 100% coniferous managed woodland in 2040s",
        "id": 227
    },
    {
        "code": "ghg_conif_flow_50",
        "name": "ghg_conif_flow_50 - predicted annual greenhouse gas sequestration value from 100% coniferous managed woodland in 2050s",
        "id": 228
    },
    {
        "code": "ghg_mixed_flow_20",
        "name": "ghg_mixed_flow_20 - predicted annual greenhouse gas sequestration value from 60% broadleaf 40% coniferous managed woodland in 2020s",
        "id": 229
    },
    {
        "code": "ghg_mixed_flow_30",
        "name": "ghg_mixed_flow_30 - predicted annual greenhouse gas sequestration value from 60% broadleaf 40% coniferous managed woodland in 2030s",
        "id": 230
    },
    {
        "code": "ghg_mixed_flow_40",
        "name": "ghg_mixed_flow_40 - predicted annual greenhouse gas sequestration value from 60% broadleaf 40% coniferous managed woodland in 2040s",
        "id": 231
    },
    {
        "code": "ghg_mixed_flow_50",
        "name": "ghg_mixed_flow_50 - predicted annual greenhouse gas sequestration value from 60% broadleaf 40% coniferous managed woodland in 2050s",
        "id": 232
    },
    {
        "code": "ghg_current_flow_20",
        "name": "ghg_current_flow_20 - predicted annual greenhouse gas sequestration value from managed woodland from current broadleaf coniferous mix in 2020s",
        "id": 233
    },
    {
        "code": "ghg_current_flow_30",
        "name": "ghg_current_flow_30 - predicted annual greenhouse gas sequestration value from managed woodland from current broadleaf coniferous mix in 2030s",
        "id": 234
    },
    {
        "code": "ghg_current_flow_40",
        "name": "ghg_current_flow_40 - predicted annual greenhouse gas sequestration value from managed woodland from current broadleaf coniferous mix in 2040s",
        "id": 235
    },
    {
        "code": "ghg_current_flow_50",
        "name": "ghg_current_flow_50 - predicted annual greenhouse gas sequestration value from managed woodland from current broadleaf coniferous mix in 2050s",
        "id": 236
    },
    {
        "code": "fert_nitr_20",
        "name": "fert_nitr_20 - predicted annual nitrate fertiliser use (kg) on farmland in 2020s",
        "id": 237
    },
    {
        "code": "fert_nitr_30",
        "name": "fert_nitr_30 - predicted annual nitrate fertiliser use (kg) on farmland in 2030s",
        "id": 238
    },
    {
        "code": "fert_nitr_40",
        "name": "fert_nitr_40 - predicted annual nitrate fertiliser use (kg) on farmland in 2040s",
        "id": 239
    },
    {
        "code": "fert_nitr_50",
        "name": "fert_nitr_50 - predicted annual nitrate fertiliser use (kg) on farmland in 2050s",
        "id": 240
    },
    {
        "code": "fert_phos_20",
        "name": "fert_phos_20 - predicted annual phosphate fertiliser use (kg) on farmland in 2020s",
        "id": 241
    },
    {
        "code": "fert_phos_30",
        "name": "fert_phos_30 - predicted annual phosphate fertiliser use (kg) on farmland in 2030s",
        "id": 242
    },
    {
        "code": "fert_phos_40",
        "name": "fert_phos_40 - predicted annual phosphate fertiliser use (kg) on farmland in 2040s",
        "id": 243
    },
    {
        "code": "fert_phos_50",
        "name": "fert_phos_50 - predicted annual phosphate fertiliser use (kg) on farmland in 2050s",
        "id": 244
    },
    {
        "code": "pest_20",
        "name": "pest_20 - predicted annual pesticide use (kg) on farmland in 2020s",
        "id": 245
    },
    {
        "code": "pest_30",
        "name": "pest_30 - predicted annual pesticide use (kg) on farmland in 2030s",
        "id": 246
    },
    {
        "code": "pest_40",
        "name": "pest_40 - predicted annual pesticide use (kg) on farmland in 2040s",
        "id": 247
    },
    {
        "code": "pest_50",
        "name": "pest_50 - predicted annual pesticide use (kg) on farmland in 2050s",
        "id": 248
    },
    {
        "code": "tot_fert_pest_20",
        "name": "tot_fert_pest_20 - predicted annual total fertiliser and pesticide use (kg) on farmland in 2020s",
        "id": 249
    },
    {
        "code": "tot_fert_pest_30",
        "name": "tot_fert_pest_30 - predicted annual total fertiliser and pesticide use (kg) on farmland in 2030s",
        "id": 250
    },
    {
        "code": "tot_fert_pest_40",
        "name": "tot_fert_pest_40 - predicted annual total fertiliser and pesticide use (kg) on farmland in 2040s",
        "id": 251
    },
    {
        "code": "tot_fert_pest_50",
        "name": "tot_fert_pest_50 - predicted annual total fertiliser and pesticide use (kg) on farmland in 2050s",
        "id": 252
    },
    {
        "code": "prk_area",
        "name": "prk_area - total area of recreational parks",
        "id": 253
    },
    {
        "code": "pth_len",
        "name": "pth_len - total length of recreational paths",
        "id": 254
    },
    {
        "code": "prk_vis_20",
        "name": "prk_vis_20 - predicted annual total visits to parks in 2020s",
        "id": 255
    },
    {
        "code": "prk_viscar_20",
        "name": "prk_viscar_20 - predicted annual visits by car to parks in 2020s",
        "id": 256
    },
    {
        "code": "prk_viswlk_20",
        "name": "prk_viswlk_20 - predicted annual visits on foot to parks in 2020s",
        "id": 257
    },
    {
        "code": "prk_visab_20",
        "name": "prk_visab_20 - predicted annual visits to parks from socioeconomic class AB in 2020s",
        "id": 258
    },
    {
        "code": "prk_visc1_20",
        "name": "prk_visc1_20 - predicted annual visits to parks from socioeconomic class C1 in 2020s",
        "id": 259
    },
    {
        "code": "prk_visc2_20",
        "name": "prk_visc2_20 - predicted annual visits to parks from socioeconomic class C2 in 2020s",
        "id": 260
    },
    {
        "code": "prk_visde_20",
        "name": "prk_visde_20 - predicted annual visits to parks from socioeconomic class DE in 2020s",
        "id": 261
    },
    {
        "code": "prk_val_20",
        "name": "prk_val_20 - predicted annual recreational value from parks in 2020s",
        "id": 262
    },
    {
        "code": "prk_valab_20",
        "name": "prk_valab_20 - predicted annual recreational value from socioeconomic class AB in 2020s",
        "id": 263
    },
    {
        "code": "prk_valc1_20",
        "name": "prk_valc1_20 - predicted annual recreation value from socioeconomic class C1 in 2020s",
        "id": 264
    },
    {
        "code": "prk_valc2_20",
        "name": "prk_valc2_20 - predicted annual recreation value from socioeconomic class C2 in 2020s",
        "id": 265
    },
    {
        "code": "prk_valde_20",
        "name": "prk_valde_20 - predicted annual recreation value from socioeconomic class DE in 2020s",
        "id": 266
    },
    {
        "code": "pth_vis_20",
        "name": "pth_vis_20 - predicted annual total visits to paths in 2020s",
        "id": 267
    },
    {
        "code": "pth_viscar_20",
        "name": "pth_viscar_20 - predicted annual visits by car to paths in 2020s",
        "id": 268
    },
    {
        "code": "pth_viswlk_20",
        "name": "pth_viswlk_20 - predicted annual visits on foot to paths in 2020s",
        "id": 269
    },
    {
        "code": "pth_visab_20",
        "name": "pth_visab_20 - predicted annual visits to paths from socioeconomic class AB in 2020s",
        "id": 270
    },
    {
        "code": "pth_visc1_20",
        "name": "pth_visc1_20 - predicted annual visits to paths from socioeconomic class C1 in 2020s",
        "id": 271
    },
    {
        "code": "pth_visc2_20",
        "name": "pth_visc2_20 - predicted annual visits to paths from socioeconomic class C2 in 2020s",
        "id": 272
    },
    {
        "code": "pth_visde_20",
        "name": "pth_visde_20 - predicted annual visits to paths from socioeconomic class DE in 2020s",
        "id": 273
    },
    {
        "code": "pth_val_20",
        "name": "pth_val_20 - predicted annual recreational value from paths in 2020s",
        "id": 274
    },
    {
        "code": "pth_valab_20",
        "name": "pth_valab_20 - predicted annual recreational value from socioeconomic class AB in 2020s",
        "id": 275
    },
    {
        "code": "pth_valc1_20",
        "name": "pth_valc1_20 - predicted annual recreation value from socioeconomic class C1 in 2020s",
        "id": 276
    },
    {
        "code": "pth_valc2_20",
        "name": "pth_valc2_20 - predicted annual recreation value from socioeconomic class C2 in 2020s",
        "id": 277
    },
    {
        "code": "pth_valde_20",
        "name": "pth_valde_20 - predicted annual recreation value from socioeconomic class DE in 2020s",
        "id": 278
    },
    {
        "code": "prk_vis_30",
        "name": "prk_vis_30 - predicted annual total visits to parks in 2030s",
        "id": 279
    },
    {
        "code": "prk_viscar_30",
        "name": "prk_viscar_30 - predicted annual visits by car to parks in 2030s",
        "id": 280
    },
    {
        "code": "prk_viswlk_30",
        "name": "prk_viswlk_30 - predicted annual visits on foot to parks in 2030s",
        "id": 281
    },
    {
        "code": "prk_visab_30",
        "name": "prk_visab_30 - predicted annual visits to parks from socioeconomic class AB in 2030s",
        "id": 282
    },
    {
        "code": "prk_visc1_30",
        "name": "prk_visc1_30 - predicted annual visits to parks from socioeconomic class C1 in 2030s",
        "id": 283
    },
    {
        "code": "prk_visc2_30",
        "name": "prk_visc2_30 - predicted annual visits to parks from socioeconomic class C2 in 2030s",
        "id": 284
    },
    {
        "code": "prk_visde_30",
        "name": "prk_visde_30 - predicted annual visits to parks from socioeconomic class DE in 2030s",
        "id": 285
    },
    {
        "code": "prk_val_30",
        "name": "prk_val_30 - predicted annual recreational value from parks in 2030s",
        "id": 286
    },
    {
        "code": "prk_valab_30",
        "name": "prk_valab_30 - predicted annual recreational value from socioeconomic class AB in 2030s",
        "id": 287
    },
    {
        "code": "prk_valc1_30",
        "name": "prk_valc1_30 - predicted annual recreation value from socioeconomic class C1 in 2030s",
        "id": 288
    },
    {
        "code": "prk_valc2_30",
        "name": "prk_valc2_30 - predicted annual recreation value from socioeconomic class C2 in 2030s",
        "id": 289
    },
    {
        "code": "prk_valde_30",
        "name": "prk_valde_30 - predicted annual recreation value from socioeconomic class DE in 2030s",
        "id": 290
    },
    {
        "code": "pth_vis_30",
        "name": "pth_vis_30 - predicted annual total visits to paths in 2030s",
        "id": 291
    },
    {
        "code": "pth_viscar_30",
        "name": "pth_viscar_30 - predicted annual visits by car to paths in 2030s",
        "id": 292
    },
    {
        "code": "pth_viswlk_30",
        "name": "pth_viswlk_30 - predicted annual visits on foot to paths in 2030s",
        "id": 293
    },
    {
        "code": "pth_visab_30",
        "name": "pth_visab_30 - predicted annual visits to paths from socioeconomic class AB in 2030s",
        "id": 294
    },
    {
        "code": "pth_visc1_30",
        "name": "pth_visc1_30 - predicted annual visits to paths from socioeconomic class C1 in 2030s",
        "id": 295
    },
    {
        "code": "pth_visc2_30",
        "name": "pth_visc2_30 - predicted annual visits to paths from socioeconomic class C2 in 2030s",
        "id": 296
    },
    {
        "code": "pth_visde_30",
        "name": "pth_visde_30 - predicted annual visits to paths from socioeconomic class DE in 2030s",
        "id": 297
    },
    {
        "code": "pth_val_30",
        "name": "pth_val_30 - predicted annual recreational value from paths in 2030s",
        "id": 298
    },
    {
        "code": "pth_valab_30",
        "name": "pth_valab_30 - predicted annual recreational value from socioeconomic class AB in 2030s",
        "id": 299
    },
    {
        "code": "pth_valc1_30",
        "name": "pth_valc1_30 - predicted annual recreation value from socioeconomic class C1 in 2030s",
        "id": 300
    },
    {
        "code": "pth_valc2_30",
        "name": "pth_valc2_30 - predicted annual recreation value from socioeconomic class C2 in 2030s",
        "id": 301
    },
    {
        "code": "pth_valde_30",
        "name": "pth_valde_30 - predicted annual recreation value from socioeconomic class DE in 2030s",
        "id": 302
    },
    {
        "code": "prk_vis_40",
        "name": "prk_vis_40 - predicted annual total visits to parks in 2040s",
        "id": 303
    },
    {
        "code": "prk_viscar_40",
        "name": "prk_viscar_40 - predicted annual visits by car to parks in 2040s",
        "id": 304
    },
    {
        "code": "prk_viswlk_40",
        "name": "prk_viswlk_40 - predicted annual visits on foot to parks in 2040s",
        "id": 305
    },
    {
        "code": "prk_visab_40",
        "name": "prk_visab_40 - predicted annual visits to parks from socioeconomic class AB in 2040s",
        "id": 306
    },
    {
        "code": "prk_visc1_40",
        "name": "prk_visc1_40 - predicted annual visits to parks from socioeconomic class C1 in 2040s",
        "id": 307
    },
    {
        "code": "prk_visc2_40",
        "name": "prk_visc2_40 - predicted annual visits to parks from socioeconomic class C2 in 2040s",
        "id": 308
    },
    {
        "code": "prk_visde_40",
        "name": "prk_visde_40 - predicted annual visits to parks from socioeconomic class DE in 2040s",
        "id": 309
    },
    {
        "code": "prk_val_40",
        "name": "prk_val_40 - predicted annual recreational value from parks in 2040s",
        "id": 310
    },
    {
        "code": "prk_valab_40",
        "name": "prk_valab_40 - predicted annual recreational value from socioeconomic class AB in 2040s",
        "id": 311
    },
    {
        "code": "prk_valc1_40",
        "name": "prk_valc1_40 - predicted annual recreation value from socioeconomic class C1 in 2040s",
        "id": 312
    },
    {
        "code": "prk_valc2_40",
        "name": "prk_valc2_40 - predicted annual recreation value from socioeconomic class C2 in 2040s",
        "id": 313
    },
    {
        "code": "prk_valde_40",
        "name": "prk_valde_40 - predicted annual recreation value from socioeconomic class DE in 2040s",
        "id": 314
    },
    {
        "code": "pth_vis_40",
        "name": "pth_vis_40 - predicted annual total visits to paths in 2040s",
        "id": 315
    },
    {
        "code": "pth_viscar_40",
        "name": "pth_viscar_40 - predicted annual visits by car to paths in 2040s",
        "id": 316
    },
    {
        "code": "pth_viswlk_40",
        "name": "pth_viswlk_40 - predicted annual visits on foot to paths in 2040s",
        "id": 317
    },
    {
        "code": "pth_visab_40",
        "name": "pth_visab_40 - predicted annual visits to paths from socioeconomic class AB in 2040s",
        "id": 318
    },
    {
        "code": "pth_visc1_40",
        "name": "pth_visc1_40 - predicted annual visits to paths from socioeconomic class C1 in 2040s",
        "id": 319
    },
    {
        "code": "pth_visc2_40",
        "name": "pth_visc2_40 - predicted annual visits to paths from socioeconomic class C2 in 2040s",
        "id": 320
    },
    {
        "code": "pth_visde_40",
        "name": "pth_visde_40 - predicted annual visits to paths from socioeconomic class DE in 2040s",
        "id": 321
    },
    {
        "code": "pth_val_40",
        "name": "pth_val_40 - predicted annual recreational value from paths in 2040s",
        "id": 322
    },
    {
        "code": "pth_valab_40",
        "name": "pth_valab_40 - predicted annual recreational value from socioeconomic class AB in 2040s",
        "id": 323
    },
    {
        "code": "pth_valc1_40",
        "name": "pth_valc1_40 - predicted annual recreation value from socioeconomic class C1 in 2040s",
        "id": 324
    },
    {
        "code": "pth_valc2_40",
        "name": "pth_valc2_40 - predicted annual recreation value from socioeconomic class C2 in 2040s",
        "id": 325
    },
    {
        "code": "pth_valde_40",
        "name": "pth_valde_40 - predicted annual recreation value from socioeconomic class DE in 2040s",
        "id": 326
    },
    {
        "code": "prk_vis_50",
        "name": "prk_vis_50 - predicted annual total visits to parks in 2050s",
        "id": 327
    },
    {
        "code": "prk_viscar_50",
        "name": "prk_viscar_50 - predicted annual visits by car to parks in 2050s",
        "id": 328
    },
    {
        "code": "prk_viswlk_50",
        "name": "prk_viswlk_50 - predicted annual visits on foot to parks in 2050s",
        "id": 329
    },
    {
        "code": "prk_visab_50",
        "name": "prk_visab_50 - predicted annual visits to parks from socioeconomic class AB in 2050s",
        "id": 330
    },
    {
        "code": "prk_visc1_50",
        "name": "prk_visc1_50 - predicted annual visits to parks from socioeconomic class C1 in 2050s",
        "id": 331
    },
    {
        "code": "prk_visc2_50",
        "name": "prk_visc2_50 - predicted annual visits to parks from socioeconomic class C2 in 2050s",
        "id": 332
    },
    {
        "code": "prk_visde_50",
        "name": "prk_visde_50 - predicted annual visits to parks from socioeconomic class DE in 2050s",
        "id": 333
    },
    {
        "code": "prk_val_50",
        "name": "prk_val_50 - predicted annual recreational value from parks in 2050s",
        "id": 334
    },
    {
        "code": "prk_valab_50",
        "name": "prk_valab_50 - predicted annual recreational value from socioeconomic class AB in 2050s",
        "id": 335
    },
    {
        "code": "prk_valc1_50",
        "name": "prk_valc1_50 - predicted annual recreation value from socioeconomic class C1 in 2050s",
        "id": 336
    },
    {
        "code": "prk_valc2_50",
        "name": "prk_valc2_50 - predicted annual recreation value from socioeconomic class C2 in 2050s",
        "id": 337
    },
    {
        "code": "prk_valde_50",
        "name": "prk_valde_50 - predicted annual recreation value from socioeconomic class DE in 2050s",
        "id": 338
    },
    {
        "code": "pth_vis_50",
        "name": "pth_vis_50 - predicted annual total visits to paths in 2050s",
        "id": 339
    },
    {
        "code": "pth_viscar_50",
        "name": "pth_viscar_50 - predicted annual visits by car to paths in 2050s",
        "id": 340
    },
    {
        "code": "pth_viswlk_50",
        "name": "pth_viswlk_50 - predicted annual visits on foot to paths in 2050s",
        "id": 341
    },
    {
        "code": "pth_visab_50",
        "name": "pth_visab_50 - predicted annual visits to paths from socioeconomic class AB in 2050s",
        "id": 342
    },
    {
        "code": "pth_visc1_50",
        "name": "pth_visc1_50 - predicted annual visits to paths from socioeconomic class C1 in 2050s",
        "id": 343
    },
    {
        "code": "pth_visc2_50",
        "name": "pth_visc2_50 - predicted annual visits to paths from socioeconomic class C2 in 2050s",
        "id": 344
    },
    {
        "code": "pth_visde_50",
        "name": "pth_visde_50 - predicted annual visits to paths from socioeconomic class DE in 2050s",
        "id": 345
    },
    {
        "code": "pth_val_50",
        "name": "pth_val_50 - predicted annual recreational value from paths in 2050s",
        "id": 346
    },
    {
        "code": "pth_valab_50",
        "name": "pth_valab_50 - predicted annual recreational value from socioeconomic class AB in 2050s",
        "id": 347
    },
    {
        "code": "pth_valc1_50",
        "name": "pth_valc1_50 - predicted annual recreation value from socioeconomic class C1 in 2050s",
        "id": 348
    },
    {
        "code": "pth_valc2_50",
        "name": "pth_valc2_50 - predicted annual recreation value from socioeconomic class C2 in 2050s",
        "id": 349
    },
    {
        "code": "pth_valde_50",
        "name": "pth_valde_50 - predicted annual recreation value from socioeconomic class DE in 2050s",
        "id": 350
    },
    {
        "code": "rec_vis_20",
        "name": "rec_vis_20 - predicted annual total recreational visits in 2020s",
        "id": 351
    },
    {
        "code": "rec_vis_30",
        "name": "rec_vis_30 - predicted annual total recreational visits in 2030s",
        "id": 352
    },
    {
        "code": "rec_vis_40",
        "name": "rec_vis_40 - predicted annual total recreational visits in 2040s",
        "id": 353
    },
    {
        "code": "rec_vis_50",
        "name": "rec_vis_50 - predicted annual total recreational visits in 2050s",
        "id": 354
    },
    {
        "code": "rec_val_20",
        "name": "rec_val_20 - predicted annual total recreational value in 2020s",
        "id": 355
    },
    {
        "code": "rec_val_30",
        "name": "rec_val_30 - predicted annual total recreational value in 2030s",
        "id": 356
    },
    {
        "code": "rec_val_40",
        "name": "rec_val_40 - predicted annual total recreational value in 2040s",
        "id": 357
    },
    {
        "code": "rec_val_50",
        "name": "rec_val_50 - predicted annual total recreational value in 2050s",
        "id": 358
    },
    {
        "code": "prk_val_ann",
        "name": "prk_val_ann - predicted annual recreational value from parks",
        "id": 359
    },
    {
        "code": "prk_valab_ann",
        "name": "prk_valab_ann - predicted annual recreation value from socioeconomic class AB from parks",
        "id": 360
    },
    {
        "code": "prk_valc1_ann",
        "name": "prk_valc1_ann - predicted annual recreation value from socioeconomic class C1 from parks",
        "id": 361
    },
    {
        "code": "prk_valc2_ann",
        "name": "prk_valc2_ann - predicted annual recreation value from socioeconomic class C2 from parks",
        "id": 362
    },
    {
        "code": "prk_valde_ann",
        "name": "prk_valde_ann - predicted annual recreation value from socioeconomic class DE from parks",
        "id": 363
    },
    {
        "code": "pth_val_ann",
        "name": "pth_val_ann - predicted annual recreation value from paths",
        "id": 364
    },
    {
        "code": "pth_valab_ann",
        "name": "pth_valab_ann - predicted annual recreation value from socioeconomic class AB from paths",
        "id": 365
    },
    {
        "code": "pth_valc1_ann",
        "name": "pth_valc1_ann - predicted annual recreation value from socioeconomic class C1 from paths",
        "id": 366
    },
    {
        "code": "pth_valc2_ann",
        "name": "pth_valc2_ann - predicted annual recreation value from socioeconomic class C2 from paths",
        "id": 367
    },
    {
        "code": "pth_valde_ann",
        "name": "pth_valde_ann - predicted annual recreation value from socioeconomic class DE from paths",
        "id": 368
    },
    {
        "code": "rec_val_ann",
        "name": "rec_val_ann - predicted annual total recreational value",
        "id": 369
    },
    {
        "code": "sr_bird_20",
        "name": "sr_bird_20 - predicted bird species richness in 2020s",
        "id": 370
    },
    {
        "code": "sr_herp_20",
        "name": "sr_herp_20 - predicted herp species richness in 2020s",
        "id": 371
    },
    {
        "code": "sr_invert_20",
        "name": "sr_invert_20 - predicted invert species richness in 2020s",
        "id": 372
    },
    {
        "code": "sr_lichen_20",
        "name": "sr_lichen_20 - predicted lichen species richness in 2020s",
        "id": 373
    },
    {
        "code": "sr_mammal_20",
        "name": "sr_mammal_20 - predicted mammal species richness in 2020s",
        "id": 374
    },
    {
        "code": "sr_plant_20",
        "name": "sr_plant_20 - predicted plant species richness in 2020s",
        "id": 375
    },
    {
        "code": "sr_100_20",
        "name": "sr_100_20 - predicted species richness in 2020s",
        "id": 376
    },
    {
        "code": "sr_bird_30",
        "name": "sr_bird_30 - predicted bird species richness in 2030s",
        "id": 377
    },
    {
        "code": "sr_herp_30",
        "name": "sr_herp_30 - predicted herp species richness in 2030s",
        "id": 378
    },
    {
        "code": "sr_invert_30",
        "name": "sr_invert_30 - predicted invert species richness in 2030s",
        "id": 379
    },
    {
        "code": "sr_lichen_30",
        "name": "sr_lichen_30 - predicted lichen species richness in 2030s",
        "id": 380
    },
    {
        "code": "sr_mammal_30",
        "name": "sr_mammal_30 - predicted mammal species richness in 2030s",
        "id": 381
    },
    {
        "code": "sr_plant_30",
        "name": "sr_plant_30 - predicted plant species richness in 2030s",
        "id": 382
    },
    {
        "code": "sr_100_30",
        "name": "sr_100_30 - predicted species richness in 2030s",
        "id": 383
    },
    {
        "code": "sr_bird_40",
        "name": "sr_bird_40 - predicted bird species richness in 2040s",
        "id": 384
    },
    {
        "code": "sr_herp_40",
        "name": "sr_herp_40 - predicted herp species richness in 2040s",
        "id": 385
    },
    {
        "code": "sr_invert_40",
        "name": "sr_invert_40 - predicted invert species richness in 2040s",
        "id": 386
    },
    {
        "code": "sr_lichen_40",
        "name": "sr_lichen_40 - predicted lichen species richness in 2040s",
        "id": 387
    },
    {
        "code": "sr_mammal_40",
        "name": "sr_mammal_40 - predicted mammal species richness in 2040s",
        "id": 388
    },
    {
        "code": "sr_plant_40",
        "name": "sr_plant_40 - predicted plant species richness in 2040s",
        "id": 389
    },
    {
        "code": "sr_100_40",
        "name": "sr_100_40 - predicted species richness in 2040s",
        "id": 390
    },
    {
        "code": "sr_bird_50",
        "name": "sr_bird_50 - predicted bird species richness in 2050s",
        "id": 391
    },
    {
        "code": "sr_herp_50",
        "name": "sr_herp_50 - predicted herp species richness in 2050s",
        "id": 392
    },
    {
        "code": "sr_invert_50",
        "name": "sr_invert_50 - predicted invert species richness in 2050s",
        "id": 393
    },
    {
        "code": "sr_lichen_50",
        "name": "sr_lichen_50 - predicted lichen species richness in 2050s",
        "id": 394
    },
    {
        "code": "sr_mammal_50",
        "name": "sr_mammal_50 - predicted mammal species richness in 2050s",
        "id": 395
    },
    {
        "code": "sr_plant_50",
        "name": "sr_plant_50 - predicted plant species richness in 2050s",
        "id": 396
    },
    {
        "code": "sr_100_50",
        "name": "sr_100_50 - predicted species richness in 2050s",
        "id": 397
    }
]

export class NevoLayerComponent extends BaseComponent {
    nevoOutput: Feature<Geometry>[] | null
    outputCache: Map<string, NumericTileGrid>


    constructor() {
        super("NEVO layer")
        this.category = "Inputs"
    }

    async builder(node: Node) {


        node.meta.toolTip = "The NEVO dataset by the University of Exeter is a combination of models covering subjects such as agriculture, forestry, and recreation. This component uses their 2KM grid models, values are adjusted to reflect each pixel. Further, more indepth, technical documentation can be found on their website. [click here for more info]."
        node.meta.toolTipLink = "https://www.leep.exeter.ac.uk/nevo/documentation/"


        this.nevoOutput = null
        this.outputCache = new Map()

        node.addOutput(new Output('out', 'Output', numericDataSocket))

        node.addControl(
            new SelectControl(
                this.editor,
                'nevoLayerId',
                () => LayerProperties,
                () => [],
                'Layer'
            )
        )

        node.addControl(new PreviewControl(() =>
            node.meta.output as any || new NumericTileGrid(0, 0, 0, 1, 1)
        ))

    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {

        const editorNode = this.editor?.nodes.find(n => n.id === node.id)
        if (editorNode === undefined) { return }

        if (this.nevoOutput === null) {
            const json = await retrieveLandCoverData(bbox)
            this.nevoOutput = new GeoJSON().readFeatures(json)
        }

        const features = this.nevoOutput

        const tileGrid = createXYZ()

        const outputTileRange = tileGrid.getTileRangeForExtentAndZ(extent, zoom)


        let index = node.data.nevoLayerId as number
        if (index === undefined) { index = 0 }

        const code = LayerProperties[index].code

        if (this.outputCache.has(code)) {

            const result = editorNode.meta.output = outputs['out'] = this.outputCache.get(code)

        } else {

            const result = editorNode.meta.output = outputs['out'] = new NumericTileGrid(
                zoom,
                outputTileRange.minX,
                outputTileRange.minY,
                outputTileRange.getWidth(),
                outputTileRange.getHeight()
            )

            for (let feature of features) {

                const val = feature.get(code)

                const geom = feature.getGeometry()
                if (geom === undefined) { continue }

                const featureTileRange = tileGrid.getTileRangeForExtentAndZ(
                    geom.getExtent(),
                    zoom
                )

                const featureArea = getArea(geom.getExtent())

                for (
                    let x = Math.max(featureTileRange.minX, outputTileRange.minX);
                    x <= Math.min(featureTileRange.maxX, outputTileRange.maxX);
                    ++x
                ) {
                    for (
                        let y = Math.max(featureTileRange.minY, outputTileRange.minY);
                        y <= Math.min(featureTileRange.maxY, outputTileRange.maxY);
                        ++y
                    ) {
                        const tileExtent = tileGrid.getTileCoordExtent([zoom, x, y])
                        if (geom.intersectsExtent(tileExtent)) {

                            const tileArea = getArea(tileExtent)

                            const factor = tileArea / featureArea

                            result.set(x, y, val * factor)
                        }
                    }
                }
            }

            this.outputCache.set(code, result)
        }




        const previewControl: any = editorNode.controls.get('Preview')
        previewControl.update()
        editorNode.update()

    }
}