export const nevoLevelNames = {
  "2km": "2km Grid",
  "subbasins": "Subcatchment",
  "national_parks": "National Park",
  "lad": "Local Authority",
  "basins": "Catchment",
  "counties_uas": "County",
  "regions": "Government Office Region",
  "countries": "Country",
} as const

export type NevoLevel = keyof typeof nevoLevelNames

export const nevoPropertyNames = {
  "tot_area": "total hectare area of spatial unit",
  "wood_ha": "woodland hectares",
  "sngrass_ha": "semi-natural grassland hectares",
  "urban_ha": "urban hectares",
  "water_ha": "water hectares",
  "farm_ha": "farmland hectares",
  "arable_ha_20": "predicted annual arable hectares in 2020s",
  "arable_ha_30": "predicted annual arable hectares in 2030s",
  "arable_ha_40": "predicted annual arable hectares in 2040s",
  "arable_ha_50": "predicted annual arable hectares in 2050s",
  "grass_ha_20": "predicted annual farm grassland hectares in 2020s",
  "grass_ha_30": "predicted annual farm grassland hectares in 2030s",
  "grass_ha_40": "predicted annual farm grassland hectares in 2040s",
  "grass_ha_50": "predicted annual farm grassland hectares in 2050s",
  "wheat_ha_20": "predicted annual wheat hectares in 2020s",
  "wheat_ha_30": "predicted annual wheat hectares in 2030s",
  "wheat_ha_40": "predicted annual wheat hectares in 2040s",
  "wheat_ha_50": "predicted annual wheat hectares in 2050s",
  "osr_ha_20": "predicted annual oil seed rape hectares in 2020s",
  "osr_ha_30": "predicted annual oil seed rape hectares in 2030s",
  "osr_ha_40": "predicted annual oil seed rape hectares in 2040s",
  "osr_ha_50": "predicted annual oil seed rape hectares in 2050s",
  "wbar_ha_20": "predicted annual winter barley hectares in 2020s",
  "wbar_ha_30": "predicted annual winter barley hectares in 2030s",
  "wbar_ha_40": "predicted annual winter barley hectares in 2040s",
  "wbar_ha_50": "predicted annual winter barley hectares in 2050s",
  "sbar_ha_20": "predicted annual spring barley hectares in 2020s",
  "sbar_ha_30": "predicted annual spring barley hectares in 2030s",
  "sbar_ha_40": "predicted annual spring barley hectares in 2040s",
  "sbar_ha_50": "predicted annual spring barley hectares in 2050s",
  "pot_ha_20": "predicted annual potato hectares in 2020s",
  "pot_ha_30": "predicted annual potato hectares in 2030s",
  "pot_ha_40": "predicted annual potato hectares in 2040s",
  "pot_ha_50": "predicted annual potato hectares in 2050s",
  "sb_ha_20": "predicted annual sugarbeet hectares in 2020s",
  "sb_ha_30": "predicted annual sugarbeet hectares in 2030s",
  "sb_ha_40": "predicted annual sugarbeet hectares in 2040s",
  "sb_ha_50": "predicted annual sugarbeet hectares in 2050s",
  "other_ha_20": "predicted annual other farmland hectares in 2020s",
  "other_ha_30": "predicted annual other farmland hectares in 2030s",
  "other_ha_40": "predicted annual other farmland hectares in 2040s",
  "other_ha_50": "predicted annual other farmland hectares in 2050s",
  "pgrass_ha_20": "predicted annual permanent grassland hectares in 2020s",
  "pgrass_ha_30": "predicted annual permanent grassland hectares in 2030s",
  "pgrass_ha_40": "predicted annual permanent grassland hectares in 2040s",
  "pgrass_ha_50": "predicted annual permanent grassland hectares in 2050s",
  "tgrass_ha_20": "predicted annual temporary grassland hectares in 2020s",
  "tgrass_ha_30": "predicted annual temporary grassland hectares in 2030s",
  "tgrass_ha_40": "predicted annual temporary grassland hectares in 2040s",
  "tgrass_ha_50": "predicted annual temporary grassland hectares in 2050s",
  "rgraz_ha_20": "predicted annual rough grazing hectares in 2020s",
  "rgraz_ha_30": "predicted annual rough grazing hectares in 2030s",
  "rgraz_ha_40": "predicted annual rough grazing hectares in 2040s",
  "rgraz_ha_50": "predicted annual rough grazing hectares in 2050s",
  "dairy_20": "predicted annual dairy heads in 2020s",
  "dairy_30": "predicted annual dairy heads in 2030s",
  "dairy_40": "predicted annual dairy heads in 2040s",
  "dairy_50": "predicted annual dairy heads in 2050s",
  "beef_20": "predicted annual beef heads in 2020s",
  "beef_30": "predicted annual beef heads in 2030s",
  "beef_40": "predicted annual beef heads in 2040s",
  "beef_50": "predicted annual beef heads in 2050s",
  "sheep_20": "predicted annual sheep heads in 2020s",
  "sheep_30": "predicted annual sheep heads in 2030s",
  "sheep_40": "predicted annual sheep heads in 2040s",
  "sheep_50": "predicted annual sheep heads in 2050s",
  "livestock_20": "predicted annual livestock heads in 2020s",
  "livestock_30": "predicted annual livestock heads in 2030s",
  "livestock_40": "predicted annual livestock heads in 2040s",
  "livestock_50": "predicted annual livestock heads in 2050s",
  "wheat_food_20": "predicted annual wheat yield (kg) in 2020s",
  "wheat_food_30": "predicted annual wheat yield (kg) in 2030s",
  "wheat_food_40": "predicted annual wheat yield (kg) in 2040s",
  "wheat_food_50": "predicted annual wheat yield (kg) in 2050s",
  "osr_food_20": "predicted annual oil seed rape yield (kg) in 2020s",
  "osr_food_30": "predicted annual oil seed rape yield (kg) in 2030s",
  "osr_food_40": "predicted annual oil seed rape yield (kg) in 2040s",
  "osr_food_50": "predicted annual oil seed rape yield (kg) in 2050s",
  "wbar_food_20": "predicted annual winter barley yield (kg) in 2020s",
  "wbar_food_30": "predicted annual winter barley yield (kg) in 2030s",
  "wbar_food_40": "predicted annual winter barley yield (kg) in 2040s",
  "wbar_food_50": "predicted annual winter barley yield (kg) in 2050s",
  "sbar_food_20": "predicted annual spring barley yield (kg) in 2020s",
  "sbar_food_30": "predicted annual spring barley yield (kg) in 2030s",
  "sbar_food_40": "predicted annual spring barley yield (kg) in 2040s",
  "sbar_food_50": "predicted annual spring barley yield (kg) in 2050s",
  "pot_food_20": "predicted annual potato yield (kg) in 2020s",
  "pot_food_30": "predicted annual potato yield (kg) in 2030s",
  "pot_food_40": "predicted annual potato yield (kg) in 2040s",
  "pot_food_50": "predicted annual potato yield (kg) in 2050s",
  "sb_food_20": "predicted annual sugarbeet yield (kg) in 2020s",
  "sb_food_30": "predicted annual sugarbeet yield (kg) in 2030s",
  "sb_food_40": "predicted annual sugarbeet yield (kg) in 2040s",
  "sb_food_50": "predicted annual sugarbeet yield (kg) in 2050s",
  "food_20": "predicted annual crop yield (kg) in 2020s",
  "food_30": "predicted annual crop yield (kg) in 2030s",
  "food_40": "predicted annual crop yield (kg) in 2040s",
  "food_50": "predicted annual crop yield (kg) in 2050s",
  "arable_profit_ann": "predicted annual arable profit",
  "livestock_profit_ann": "predicted annual livestock profit",
  "farm_profit_ann": "predicted annual farm profit",
  "arable_profit_flow_20": "predicted annual arable profit in 2020s",
  "arable_profit_flow_30": "predicted annual arable profit in 2030s",
  "arable_profit_flow_40": "predicted annual arable profit in 2040s",
  "arable_profit_flow_50": "predicted annual arable profit in 2050s",
  "livestock_profit_flow_20": "predicted annual livestock profit in 2020s",
  "livestock_profit_flow_30": "predicted annual livestock profit in 2030s",
  "livestock_profit_flow_40": "predicted annual livestock profit in 2040s",
  "livestock_profit_flow_50": "predicted annual livestock profit in 2050s",
  "farm_profit_flow_20": "predicted annual farm profit in 2020s",
  "farm_profit_flow_30": "predicted annual farm profit in 2030s",
  "farm_profit_flow_40": "predicted annual farm profit in 2040s",
  "farm_profit_flow_50": "predicted annual farm profit in 2050s",
  "ghg_arable_20": "predicted annual greenhouse gas sequestration from arable in 2020s",
  "ghg_arable_30": "predicted annual greenhouse gas sequestration from arable in 2030s",
  "ghg_arable_40": "predicted annual greenhouse gas sequestration from arable in 2040s",
  "ghg_arable_50": "predicted annual greenhouse gas sequestration from arable in 2050s",
  "ghg_grass_20": "predicted annual greenhouse gas sequestration from farm grassland in 2020s",
  "ghg_grass_30": "predicted annual greenhouse gas sequestration from farm grassland in 2030s",
  "ghg_grass_40": "predicted annual greenhouse gas sequestration from farm grassland in 2040s",
  "ghg_grass_50": "predicted annual greenhouse gas sequestration from farm grassland in 2050s",
  "ghg_livestock_20": "predicted annual greenhouse gas sequestration from livestock in 2020s",
  "ghg_livestock_30": "predicted annual greenhouse gas sequestration from livestock in 2030s",
  "ghg_livestock_40": "predicted annual greenhouse gas sequestration from livestock in 2040s",
  "ghg_livestock_50": "predicted annual greenhouse gas sequestration from livestock in 2050s",
  "ghg_farm_20": "predicted annual greenhouse gas sequestration from farm in 2020s",
  "ghg_farm_30": "predicted annual greenhouse gas sequestration from farm in 2030s",
  "ghg_farm_40": "predicted annual greenhouse gas sequestration from farm in 2040s",
  "ghg_farm_50": "predicted annual greenhouse gas sequestration from farm in 2050s",
  "ghg_arable_ann": "predicted annual greenhouse gas sequestration value from arable",
  "ghg_grass_ann": "predicted annual greenhouse gas sequestration value from farm grassland",
  "ghg_livestock_ann": "predicted annual greenhouse gas sequestration value from livestock",
  "ghg_farm_ann": "predicted annual greenhouse gas sequestration value from farm",
  "ghg_arable_flow_20": "predicted annual greenhouse gas sequestration value from arable in 2020s",
  "ghg_arable_flow_30": "predicted annual greenhouse gas sequestration value from arable in 2030s",
  "ghg_arable_flow_40": "predicted annual greenhouse gas sequestration value from arable in 2040s",
  "ghg_arable_flow_50": "predicted annual greenhouse gas sequestration value from arable in 2050s",
  "ghg_grass_flow_20": "predicted annual greenhouse gas sequestration value from farm grassland in 2020s",
  "ghg_grass_flow_30": "predicted annual greenhouse gas sequestration value from farm grassland in 2030s",
  "ghg_grass_flow_40": "predicted annual greenhouse gas sequestration value from farm grassland in 2040s",
  "ghg_grass_flow_50": "predicted annual greenhouse gas sequestration value from farm grassland in 2050s",
  "ghg_livestock_flow_20": "predicted annual greenhouse gas sequestration value from livestock in 2020s",
  "ghg_livestock_flow_30": "predicted annual greenhouse gas sequestration value from livestock in 2030s",
  "ghg_livestock_flow_40": "predicted annual greenhouse gas sequestration value from livestock in 2040s",
  "ghg_livestock_flow_50": "predicted annual greenhouse gas sequestration value from livestock in 2050s",
  "ghg_farm_flow_20": "predicted annual greenhouse gas sequestration value from farm in 2020s",
  "ghg_farm_flow_30": "predicted annual greenhouse gas sequestration value from farm in 2030s",
  "ghg_farm_flow_40": "predicted annual greenhouse gas sequestration value from farm in 2040s",
  "ghg_farm_flow_50": "predicted annual greenhouse gas sequestration value from farm in 2050s",
  "nfwood_ha": "non-farm woodland hectares",
  "fwood_ha": "farm woodland hectares",
  "broad_ha": "broadleaf woodland hectares",
  "conif_ha": "coniferous woodland hectares",
  "wood_mgmt_ha": "managed woodland hectares",
  "wood_nmgmt_ha": "non-managed woodland hectares",
  "broad_mgmt_ha": "managed broadleaf woodland hectares",
  "conif_mgmt_ha": "managed coniferous woodland hectares",
  "broad_nmgmt_ha": "non-managed broadleaf hectares",
  "conif_nmgmt_ha": "non-managed coniferous hectares",
  "broad_yc_20": "predicted broadleaf yield class in 2020s",
  "broad_yc_30": "predicted broadleaf yield class in 2030s",
  "broad_yc_40": "predicted broadleaf yield class in 2040s",
  "broad_yc_50": "predicted broadleaf yield class in 2050s",
  "conif_yc_20": "predicted coniferous yield class in 2020s",
  "conif_yc_30": "predicted coniferous yield class in 2030s",
  "conif_yc_40": "predicted coniferous yield class in 2040s",
  "conif_yc_50": "predicted coniferous yield class in 2050s",
  "broad_rp": "predicted broadleaf rotation period",
  "conif_rp": "predicted coniferous rotation period",
  "timber_broad_yr": "predicted annual timber volume (cubic metres) from 100% broadleaf managed woodland",
  "timber_conif_yr": "predicted annual timber volume (cubic metres) from 100% coniferous managed woodland",
  "timber_mixed_yr": "predicted annual timber volume (cubic metres) from 60% broadleaf 40% coniferous managed woodland",
  "timber_current_yr": "predicted annual timber volume (cubic metres) from managed woodland with current broadleaf coniferous mix",
  "timber_broad_50": "predicted annual timber volume (cubic metres) from 100% broadleaf managed woodland in 2050s",
  "timber_conif_40": "predicted annual timber volume (cubic metres) from 100% coniferous managed woodland in 2040s",
  "timber_conif_50": "predicted annual timber volume (cubic metres) from 100% coniferous managed woodland in 2050s",
  "timber_mixed_40": "predicted annual timber volume (cubic metres) from 60% broadleaf 40% coniferous managed woodland in 2040s",
  "timber_mixed_50": "predicted annual timber volume (cubic metres) from 60% broadleaf 40% coniferous managed woodland in 2050s",
  "timber_current_40": "predicted annual timber volume (cubic metres) from managed woodland with current broadleaf coniferous mix in 2040s",
  "timber_current_50": "predicted annual timber volume (cubic metres) from managed woodland with current broadleaf coniferous mix in 2050s",
  "timber_broad_ann": "predicted annual timber value from 100% broadleaf managed woodland",
  "timber_conif_ann": "predicted annual timber values from 100% coniferous managed woodland",
  "timber_mixed_ann": "predicted annual timber values from 60% broadleaf 40% coniferous managed woodland",
  "timber_current_ann": "predicted annual timber values from managed woodland with current broadleaf coniferous mix",
  "timber_broad_flow_20": "predicted annual timber value from 100% broadleaf managed woodland in 2020s",
  "timber_broad_flow_30": "predicted annual timber value from 100% broadleaf managed woodland in 2030s",
  "timber_broad_flow_40": "predicted annual timber value from 100% broadleaf managed woodland in 2040s",
  "timber_broad_flow_50": "predicted annual timber value from 100% broadleaf managed woodland in 2050s",
  "timber_conif_flow_20": "predicted annual timber values from 100% coniferous managed woodland in 2020s",
  "timber_conif_flow_30": "predicted annual timber values from 100% coniferous managed woodland in 2030s",
  "timber_conif_flow_40": "predicted annual timber values from 100% coniferous managed woodland in 2040s",
  "timber_conif_flow_50": "predicted annual timber values from 100% coniferous managed woodland in 2050s",
  "timber_mixed_flow_20": "predicted annual timber values from 60% broadleaf 40% coniferous managed woodland in 2020s",
  "timber_mixed_flow_30": "predicted annual timber values from 60% broadleaf 40% coniferous managed woodland in 2030s",
  "timber_mixed_flow_40": "predicted annual timber values from 60% broadleaf 40% coniferous managed woodland in 2040s",
  "timber_mixed_flow_50": "predicted annual timber values from 60% broadleaf 40% coniferous managed woodland in 2050s",
  "timber_current_flow_20": "predicted annual timber values from managed woodland with current broadleaf coniferous mix in 2020s",
  "timber_current_flow_30": "predicted annual timber values from managed woodland with current broadleaf coniferous mix in 2030s",
  "timber_current_flow_40": "predicted annual timber values from managed woodland with current broadleaf coniferous mix in 2040s",
  "timber_current_flow_50": "predicted annual timber values from managed woodland with current broadleaf coniferous mix in 2050s",
  "ghg_broad_yr": "predicted annual greenhouse gas sequestration from 100% broadleaf managed woodland",
  "ghg_conif_yr": "predicted annual greenhouse gas sequestration from 100% coniferous managed woodland",
  "ghg_mixed_yr": "predicted annual greenhouse gas sequestration from 60% broadleaf 40% coniferous managed woodland",
  "ghg_current_yr": "predicted annual greenhouse gas sequestration from managed woodland with current broadleaf coniferous mix",
  "ghg_broad_30": "predicted annual greenhouse gas sequestration from 100% broadleaf managed woodland in 2030s",
  "ghg_broad_40": "predicted annual greenhouse gas sequestration from 100% broadleaf managed woodland in 2040s",
  "ghg_broad_50": "predicted annual greenhouse gas sequestration from 100% broadleaf managed woodland in 2050s",
  "ghg_conif_20": "predicted annual greenhouse gas sequestration from 100% coniferous managed woodland in 2020s",
  "ghg_conif_30": "predicted annual greenhouse gas sequestration from 100% coniferous managed woodland in 2030s",
  "ghg_conif_40": "predicted annual greenhouse gas sequestration from 100% coniferous managed woodland in 2040s",
  "ghg_conif_50": "predicted annual greenhouse gas sequestration from 100% coniferous managed woodland in 2050s",
  "ghg_mixed_30": "predicted annual greenhouse gas sequestration from 60% broadleaf 40% coniferous managed woodland in 2030s",
  "ghg_mixed_40": "predicted annual greenhouse gas sequestration from 60% broadleaf 40% coniferous managed woodland in 2040s",
  "ghg_mixed_50": "predicted annual greenhouse gas sequestration from 60% broadleaf 40% coniferous managed woodland in 2050s",
  "ghg_current_30": "predicted annual greenhouse gas sequestration from managed woodland with current broadleaf coniferous mix in 2030s",
  "ghg_current_40": "predicted annual greenhouse gas sequestration from managed woodland with current broadleaf coniferous mix in 2040s",
  "ghg_current_50": "predicted annual greenhouse gas sequestration from managed woodland with current broadleaf coniferous mix in 2050s",
  "ghg_broad_ann": "predicted annual greenhouse gas sequestration value from 100% broadleaf managed woodland",
  "ghg_conif_ann": "predicted annual greenhouse gas sequestration value from 100% coniferous managed woodland",
  "ghg_mixed_ann": "predicted annual greenhouse gas sequestration value from 60% broadleaf 40% coniferous managed woodland",
  "ghg_current_ann": "predicted annual greenhouse gas sequestration value from managed woodland from current broadleaf coniferous mix",
  "ghg_broad_flow_20": "predicted annual greenhouse gas sequestration value from 100% broadleaf managed woodland in 2020s",
  "ghg_broad_flow_30": "predicted annual greenhouse gas sequestration value from 100% broadleaf managed woodland in 2030s",
  "ghg_broad_flow_40": "predicted annual greenhouse gas sequestration value from 100% broadleaf managed woodland in 2040s",
  "ghg_broad_flow_50": "predicted annual greenhouse gas sequestration value from 100% broadleaf managed woodland in 2050s",
  "ghg_conif_flow_20": "predicted annual greenhouse gas sequestration value from 100% coniferous managed woodland in 2020s",
  "ghg_conif_flow_30": "predicted annual greenhouse gas sequestration value from 100% coniferous managed woodland in 2030s",
  "ghg_conif_flow_40": "predicted annual greenhouse gas sequestration value from 100% coniferous managed woodland in 2040s",
  "ghg_conif_flow_50": "predicted annual greenhouse gas sequestration value from 100% coniferous managed woodland in 2050s",
  "ghg_mixed_flow_20": "predicted annual greenhouse gas sequestration value from 60% broadleaf 40% coniferous managed woodland in 2020s",
  "ghg_mixed_flow_30": "predicted annual greenhouse gas sequestration value from 60% broadleaf 40% coniferous managed woodland in 2030s",
  "ghg_mixed_flow_40": "predicted annual greenhouse gas sequestration value from 60% broadleaf 40% coniferous managed woodland in 2040s",
  "ghg_mixed_flow_50": "predicted annual greenhouse gas sequestration value from 60% broadleaf 40% coniferous managed woodland in 2050s",
  "ghg_current_flow_20": "predicted annual greenhouse gas sequestration value from managed woodland from current broadleaf coniferous mix in 2020s",
  "ghg_current_flow_30": "predicted annual greenhouse gas sequestration value from managed woodland from current broadleaf coniferous mix in 2030s",
  "ghg_current_flow_40": "predicted annual greenhouse gas sequestration value from managed woodland from current broadleaf coniferous mix in 2040s",
  "ghg_current_flow_50": "predicted annual greenhouse gas sequestration value from managed woodland from current broadleaf coniferous mix in 2050s",
  "fert_nitr_20": "predicted annual nitrate fertiliser use (kg) on farmland in 2020s",
  "fert_nitr_30": "predicted annual nitrate fertiliser use (kg) on farmland in 2030s",
  "fert_nitr_40": "predicted annual nitrate fertiliser use (kg) on farmland in 2040s",
  "fert_nitr_50": "predicted annual nitrate fertiliser use (kg) on farmland in 2050s",
  "fert_phos_20": "predicted annual phosphate fertiliser use (kg) on farmland in 2020s",
  "fert_phos_30": "predicted annual phosphate fertiliser use (kg) on farmland in 2030s",
  "fert_phos_40": "predicted annual phosphate fertiliser use (kg) on farmland in 2040s",
  "fert_phos_50": "predicted annual phosphate fertiliser use (kg) on farmland in 2050s",
  "pest_20": "predicted annual pesticide use (kg) on farmland in 2020s",
  "pest_30": "predicted annual pesticide use (kg) on farmland in 2030s",
  "pest_40": "predicted annual pesticide use (kg) on farmland in 2040s",
  "pest_50": "predicted annual pesticide use (kg) on farmland in 2050s",
  "tot_fert_pest_20": "predicted annual total fertiliser and pesticide use (kg) on farmland in 2020s",
  "tot_fert_pest_30": "predicted annual total fertiliser and pesticide use (kg) on farmland in 2030s",
  "tot_fert_pest_40": "predicted annual total fertiliser and pesticide use (kg) on farmland in 2040s",
  "tot_fert_pest_50": "predicted annual total fertiliser and pesticide use (kg) on farmland in 2050s",
  "prk_area": "total area of recreational parks",
  "pth_len": "total length of recreational paths",
  "prk_vis_20": "predicted annual total visits to parks in 2020s",
  "prk_viscar_20": "predicted annual visits by car to parks in 2020s",
  "prk_viswlk_20": "predicted annual visits on foot to parks in 2020s",
  "prk_visab_20": "predicted annual visits to parks from socioeconomic class AB in 2020s",
  "prk_visc1_20": "predicted annual visits to parks from socioeconomic class C1 in 2020s",
  "prk_visc2_20": "predicted annual visits to parks from socioeconomic class C2 in 2020s",
  "prk_visde_20": "predicted annual visits to parks from socioeconomic class DE in 2020s",
  "prk_val_20": "predicted annual recreational value from parks in 2020s",
  "prk_valab_20": "predicted annual recreational value from socioeconomic class AB in 2020s",
  "prk_valc1_20": "predicted annual recreation value from socioeconomic class C1 in 2020s",
  "prk_valc2_20": "predicted annual recreation value from socioeconomic class C2 in 2020s",
  "prk_valde_20": "predicted annual recreation value from socioeconomic class DE in 2020s",
  "pth_vis_20": "predicted annual total visits to paths in 2020s",
  "pth_viscar_20": "predicted annual visits by car to paths in 2020s",
  "pth_viswlk_20": "predicted annual visits on foot to paths in 2020s",
  "pth_visab_20": "predicted annual visits to paths from socioeconomic class AB in 2020s",
  "pth_visc1_20": "predicted annual visits to paths from socioeconomic class C1 in 2020s",
  "pth_visc2_20": "predicted annual visits to paths from socioeconomic class C2 in 2020s",
  "pth_visde_20": "predicted annual visits to paths from socioeconomic class DE in 2020s",
  "pth_val_20": "predicted annual recreational value from paths in 2020s",
  "pth_valab_20": "predicted annual recreational value from socioeconomic class AB in 2020s",
  "pth_valc1_20": "predicted annual recreation value from socioeconomic class C1 in 2020s",
  "pth_valc2_20": "predicted annual recreation value from socioeconomic class C2 in 2020s",
  "pth_valde_20": "predicted annual recreation value from socioeconomic class DE in 2020s",
  "prk_vis_30": "predicted annual total visits to parks in 2030s",
  "prk_viscar_30": "predicted annual visits by car to parks in 2030s",
  "prk_viswlk_30": "predicted annual visits on foot to parks in 2030s",
  "prk_visab_30": "predicted annual visits to parks from socioeconomic class AB in 2030s",
  "prk_visc1_30": "predicted annual visits to parks from socioeconomic class C1 in 2030s",
  "prk_visc2_30": "predicted annual visits to parks from socioeconomic class C2 in 2030s",
  "prk_visde_30": "predicted annual visits to parks from socioeconomic class DE in 2030s",
  "prk_val_30": "predicted annual recreational value from parks in 2030s",
  "prk_valab_30": "predicted annual recreational value from socioeconomic class AB in 2030s",
  "prk_valc1_30": "predicted annual recreation value from socioeconomic class C1 in 2030s",
  "prk_valc2_30": "predicted annual recreation value from socioeconomic class C2 in 2030s",
  "prk_valde_30": "predicted annual recreation value from socioeconomic class DE in 2030s",
  "pth_vis_30": "predicted annual total visits to paths in 2030s",
  "pth_viscar_30": "predicted annual visits by car to paths in 2030s",
  "pth_viswlk_30": "predicted annual visits on foot to paths in 2030s",
  "pth_visab_30": "predicted annual visits to paths from socioeconomic class AB in 2030s",
  "pth_visc1_30": "predicted annual visits to paths from socioeconomic class C1 in 2030s",
  "pth_visc2_30": "predicted annual visits to paths from socioeconomic class C2 in 2030s",
  "pth_visde_30": "predicted annual visits to paths from socioeconomic class DE in 2030s",
  "pth_val_30": "predicted annual recreational value from paths in 2030s",
  "pth_valab_30": "predicted annual recreational value from socioeconomic class AB in 2030s",
  "pth_valc1_30": "predicted annual recreation value from socioeconomic class C1 in 2030s",
  "pth_valc2_30": "predicted annual recreation value from socioeconomic class C2 in 2030s",
  "pth_valde_30": "predicted annual recreation value from socioeconomic class DE in 2030s",
  "prk_vis_40": "predicted annual total visits to parks in 2040s",
  "prk_viscar_40": "predicted annual visits by car to parks in 2040s",
  "prk_viswlk_40": "predicted annual visits on foot to parks in 2040s",
  "prk_visab_40": "predicted annual visits to parks from socioeconomic class AB in 2040s",
  "prk_visc1_40": "predicted annual visits to parks from socioeconomic class C1 in 2040s",
  "prk_visc2_40": "predicted annual visits to parks from socioeconomic class C2 in 2040s",
  "prk_visde_40": "predicted annual visits to parks from socioeconomic class DE in 2040s",
  "prk_val_40": "predicted annual recreational value from parks in 2040s",
  "prk_valab_40": "predicted annual recreational value from socioeconomic class AB in 2040s",
  "prk_valc1_40": "predicted annual recreation value from socioeconomic class C1 in 2040s",
  "prk_valc2_40": "predicted annual recreation value from socioeconomic class C2 in 2040s",
  "prk_valde_40": "predicted annual recreation value from socioeconomic class DE in 2040s",
  "pth_vis_40": "predicted annual total visits to paths in 2040s",
  "pth_viscar_40": "predicted annual visits by car to paths in 2040s",
  "pth_viswlk_40": "predicted annual visits on foot to paths in 2040s",
  "pth_visab_40": "predicted annual visits to paths from socioeconomic class AB in 2040s",
  "pth_visc1_40": "predicted annual visits to paths from socioeconomic class C1 in 2040s",
  "pth_visc2_40": "predicted annual visits to paths from socioeconomic class C2 in 2040s",
  "pth_visde_40": "predicted annual visits to paths from socioeconomic class DE in 2040s",
  "pth_val_40": "predicted annual recreational value from paths in 2040s",
  "pth_valab_40": "predicted annual recreational value from socioeconomic class AB in 2040s",
  "pth_valc1_40": "predicted annual recreation value from socioeconomic class C1 in 2040s",
  "pth_valc2_40": "predicted annual recreation value from socioeconomic class C2 in 2040s",
  "pth_valde_40": "predicted annual recreation value from socioeconomic class DE in 2040s",
  "prk_vis_50": "predicted annual total visits to parks in 2050s",
  "prk_viscar_50": "predicted annual visits by car to parks in 2050s",
  "prk_viswlk_50": "predicted annual visits on foot to parks in 2050s",
  "prk_visab_50": "predicted annual visits to parks from socioeconomic class AB in 2050s",
  "prk_visc1_50": "predicted annual visits to parks from socioeconomic class C1 in 2050s",
  "prk_visc2_50": "predicted annual visits to parks from socioeconomic class C2 in 2050s",
  "prk_visde_50": "predicted annual visits to parks from socioeconomic class DE in 2050s",
  "prk_val_50": "predicted annual recreational value from parks in 2050s",
  "prk_valab_50": "predicted annual recreational value from socioeconomic class AB in 2050s",
  "prk_valc1_50": "predicted annual recreation value from socioeconomic class C1 in 2050s",
  "prk_valc2_50": "predicted annual recreation value from socioeconomic class C2 in 2050s",
  "prk_valde_50": "predicted annual recreation value from socioeconomic class DE in 2050s",
  "pth_vis_50": "predicted annual total visits to paths in 2050s",
  "pth_viscar_50": "predicted annual visits by car to paths in 2050s",
  "pth_viswlk_50": "predicted annual visits on foot to paths in 2050s",
  "pth_visab_50": "predicted annual visits to paths from socioeconomic class AB in 2050s",
  "pth_visc1_50": "predicted annual visits to paths from socioeconomic class C1 in 2050s",
  "pth_visc2_50": "predicted annual visits to paths from socioeconomic class C2 in 2050s",
  "pth_visde_50": "predicted annual visits to paths from socioeconomic class DE in 2050s",
  "pth_val_50": "predicted annual recreational value from paths in 2050s",
  "pth_valab_50": "predicted annual recreational value from socioeconomic class AB in 2050s",
  "pth_valc1_50": "predicted annual recreation value from socioeconomic class C1 in 2050s",
  "pth_valc2_50": "predicted annual recreation value from socioeconomic class C2 in 2050s",
  "pth_valde_50": "predicted annual recreation value from socioeconomic class DE in 2050s",
  "rec_vis_20": "predicted annual total recreational visits in 2020s",
  "rec_vis_30": "predicted annual total recreational visits in 2030s",
  "rec_vis_40": "predicted annual total recreational visits in 2040s",
  "rec_vis_50": "predicted annual total recreational visits in 2050s",
  "rec_val_20": "predicted annual total recreational value in 2020s",
  "rec_val_30": "predicted annual total recreational value in 2030s",
  "rec_val_40": "predicted annual total recreational value in 2040s",
  "rec_val_50": "predicted annual total recreational value in 2050s",
  "prk_val_ann": "predicted annual recreational value from parks",
  "prk_valab_ann": "predicted annual recreation value from socioeconomic class AB from parks",
  "prk_valc1_ann": "predicted annual recreation value from socioeconomic class C1 from parks",
  "prk_valc2_ann": "predicted annual recreation value from socioeconomic class C2 from parks",
  "prk_valde_ann": "predicted annual recreation value from socioeconomic class DE from parks",
  "pth_val_ann": "predicted annual recreation value from paths",
  "pth_valab_ann": "predicted annual recreation value from socioeconomic class AB from paths",
  "pth_valc1_ann": "predicted annual recreation value from socioeconomic class C1 from paths",
  "pth_valc2_ann": "predicted annual recreation value from socioeconomic class C2 from paths",
  "pth_valde_ann": "predicted annual recreation value from socioeconomic class DE from paths",
  "rec_val_ann": "predicted annual total recreational value",
  "sr_bird_20": "predicted bird species richness in 2020s",
  "sr_herp_20": "predicted herp species richness in 2020s",
  "sr_invert_20": "predicted invert species richness in 2020s",
  "sr_lichen_20": "predicted lichen species richness in 2020s",
  "sr_mammal_20": "predicted mammal species richness in 2020s",
  "sr_plant_20": "predicted plant species richness in 2020s",
  "sr_100_20": "predicted species richness in 2020s",
  "sr_bird_30": "predicted bird species richness in 2030s",
  "sr_herp_30": "predicted herp species richness in 2030s",
  "sr_invert_30": "predicted invert species richness in 2030s",
  "sr_lichen_30": "predicted lichen species richness in 2030s",
  "sr_mammal_30": "predicted mammal species richness in 2030s",
  "sr_plant_30": "predicted plant species richness in 2030s",
  "sr_100_30": "predicted species richness in 2030s",
  "sr_bird_40": "predicted bird species richness in 2040s",
  "sr_herp_40": "predicted herp species richness in 2040s",
  "sr_invert_40": "predicted invert species richness in 2040s",
  "sr_lichen_40": "predicted lichen species richness in 2040s",
  "sr_mammal_40": "predicted mammal species richness in 2040s",
  "sr_plant_40": "predicted plant species richness in 2040s",
  "sr_100_40": "predicted species richness in 2040s",
  "sr_bird_50": "predicted bird species richness in 2050s",
  "sr_herp_50": "predicted herp species richness in 2050s",
  "sr_invert_50": "predicted invert species richness in 2050s",
  "sr_lichen_50": "predicted lichen species richness in 2050s",
  "sr_mammal_50": "predicted mammal species richness in 2050s",
  "sr_plant_50": "predicted plant species richness in 2050s",
  "sr_100_50": "predicted species richness in 2050s",
} as const

export type NevoProperty = keyof typeof nevoPropertyNames

export const minZoomByNevoLevel: Readonly<Record<NevoLevel, number>> = {
  "2km": 11,
  "subbasins": 11,
  "national_parks": 0,
  "lad": 0,
  "basins": 10,
  "counties_uas": 0,
  "regions": 0,
  "countries": 0,
}

// TODO: dynamically generate this on the server-side
export const minMaxByNevoLevelAndProperty: Readonly<Record<NevoLevel, Record<NevoProperty, number[]>>> = {
  "2km": {
    "tot_area": [
      1,
      1
    ],
    "wood_ha": [
      0,
      1
    ],
    "sngrass_ha": [
      0,
      0.76
    ],
    "urban_ha": [
      0,
      1
    ],
    "water_ha": [
      0,
      1
    ],
    "farm_ha": [
      0,
      1
    ],
    "arable_ha_20": [
      0,
      0.9025
    ],
    "arable_ha_30": [
      0,
      0.8825
    ],
    "arable_ha_40": [
      0,
      0.89
    ],
    "arable_ha_50": [
      0,
      0.88
    ],
    "grass_ha_20": [
      0,
      0.9925
    ],
    "grass_ha_30": [
      0,
      0.9925
    ],
    "grass_ha_40": [
      0,
      0.9925
    ],
    "grass_ha_50": [
      0,
      0.9925
    ],
    "wheat_ha_20": [
      0,
      0.64
    ],
    "wheat_ha_30": [
      0,
      0.635
    ],
    "wheat_ha_40": [
      0,
      0.635
    ],
    "wheat_ha_50": [
      0,
      0.635
    ],
    "osr_ha_20": [
      0,
      0.2125
    ],
    "osr_ha_30": [
      0,
      0.2025
    ],
    "osr_ha_40": [
      0,
      0.2025
    ],
    "osr_ha_50": [
      0,
      0.195
    ],
    "wbar_ha_20": [
      0,
      0.205
    ],
    "wbar_ha_30": [
      0,
      0.205
    ],
    "wbar_ha_40": [
      0,
      0.2025
    ],
    "wbar_ha_50": [
      0,
      0.195
    ],
    "sbar_ha_20": [
      0,
      0.3
    ],
    "sbar_ha_30": [
      0,
      0.3025
    ],
    "sbar_ha_40": [
      0,
      0.3025
    ],
    "sbar_ha_50": [
      0,
      0.295
    ],
    "pot_ha_20": [
      0,
      0.315
    ],
    "pot_ha_30": [
      0,
      0.35
    ],
    "pot_ha_40": [
      0,
      0.375
    ],
    "pot_ha_50": [
      0,
      0.38
    ],
    "sb_ha_20": [
      0,
      0.265
    ],
    "sb_ha_30": [
      0,
      0.2525
    ],
    "sb_ha_40": [
      0,
      0.245
    ],
    "sb_ha_50": [
      0,
      0.245
    ],
    "other_ha_20": [
      0,
      0.2825
    ],
    "other_ha_30": [
      0,
      0.2925
    ],
    "other_ha_40": [
      0,
      0.3025
    ],
    "other_ha_50": [
      0,
      0.3175
    ],
    "pgrass_ha_20": [
      0,
      0.72
    ],
    "pgrass_ha_30": [
      0,
      0.725
    ],
    "pgrass_ha_40": [
      0,
      0.7325
    ],
    "pgrass_ha_50": [
      0,
      0.72
    ],
    "tgrass_ha_20": [
      0,
      0.1875
    ],
    "tgrass_ha_30": [
      0,
      0.19
    ],
    "tgrass_ha_40": [
      0,
      0.19
    ],
    "tgrass_ha_50": [
      0,
      0.185
    ],
    "rgraz_ha_20": [
      0,
      0.9925
    ],
    "rgraz_ha_30": [
      0,
      0.985
    ],
    "rgraz_ha_40": [
      0,
      0.9775
    ],
    "rgraz_ha_50": [
      0,
      0.9775
    ],
    "dairy_20": [
      0,
      0.5825
    ],
    "dairy_30": [
      0,
      0.58
    ],
    "dairy_40": [
      0,
      0.5675
    ],
    "dairy_50": [
      0,
      0.545
    ],
    "beef_20": [
      0,
      0.6475
    ],
    "beef_30": [
      0,
      0.635
    ],
    "beef_40": [
      0,
      0.615
    ],
    "beef_50": [
      0,
      0.595
    ],
    "sheep_20": [
      0,
      8.4175
    ],
    "sheep_30": [
      0,
      7.945
    ],
    "sheep_40": [
      0,
      7.3825
    ],
    "sheep_50": [
      0,
      6.96
    ],
    "livestock_20": [
      0,
      8.7725
    ],
    "livestock_30": [
      0,
      8.275
    ],
    "livestock_40": [
      0,
      7.72
    ],
    "livestock_50": [
      0,
      7.21
    ],
    "wheat_food_20": [
      0,
      5.235
    ],
    "wheat_food_30": [
      0,
      5.1975
    ],
    "wheat_food_40": [
      0,
      5.1975
    ],
    "wheat_food_50": [
      0,
      5.1975
    ],
    "osr_food_20": [
      0,
      0.7475
    ],
    "osr_food_30": [
      0,
      0.7175
    ],
    "osr_food_40": [
      0,
      0.72
    ],
    "osr_food_50": [
      0,
      0.69
    ],
    "wbar_food_20": [
      0,
      1.385
    ],
    "wbar_food_30": [
      0,
      1.38
    ],
    "wbar_food_40": [
      0,
      1.3675
    ],
    "wbar_food_50": [
      0,
      1.32
    ],
    "sbar_food_20": [
      0,
      1.675
    ],
    "sbar_food_30": [
      0,
      1.685
    ],
    "sbar_food_40": [
      0,
      1.685
    ],
    "sbar_food_50": [
      0,
      1.645
    ],
    "pot_food_20": [
      0,
      11.69
    ],
    "pot_food_30": [
      0,
      12.9625
    ],
    "pot_food_40": [
      0,
      13.9075
    ],
    "pot_food_50": [
      0,
      14.07
    ],
    "sb_food_20": [
      0,
      16.1
    ],
    "sb_food_30": [
      0,
      15.36
    ],
    "sb_food_40": [
      0,
      14.925
    ],
    "sb_food_50": [
      0,
      14.925
    ],
    "food_20": [
      0,
      25.815
    ],
    "food_30": [
      0,
      24.7875
    ],
    "food_40": [
      0,
      23.9825
    ],
    "food_50": [
      0,
      23.9825
    ],
    "arable_profit_ann": [
      0,
      839.22
    ],
    "livestock_profit_ann": [
      0,
      423.07
    ],
    "farm_profit_ann": [
      0,
      887.0275
    ],
    "arable_profit_flow_20": [
      0,
      801.1875
    ],
    "arable_profit_flow_30": [
      0,
      874.5725
    ],
    "arable_profit_flow_40": [
      0,
      887.0725
    ],
    "arable_profit_flow_50": [
      0,
      897.9975
    ],
    "livestock_profit_flow_20": [
      0,
      431.73
    ],
    "livestock_profit_flow_30": [
      0,
      427.6675
    ],
    "livestock_profit_flow_40": [
      0,
      417.0925
    ],
    "livestock_profit_flow_50": [
      0,
      403.205
    ],
    "farm_profit_flow_20": [
      0,
      857.525
    ],
    "farm_profit_flow_30": [
      0,
      916.8
    ],
    "farm_profit_flow_40": [
      0,
      938.225
    ],
    "farm_profit_flow_50": [
      0,
      942.6675
    ],
    "ghg_arable_20": [
      -2.8075,
      0
    ],
    "ghg_arable_30": [
      -2.6775,
      0
    ],
    "ghg_arable_40": [
      -2.58,
      0
    ],
    "ghg_arable_50": [
      -2.58,
      0
    ],
    "ghg_grass_20": [
      -1.2775,
      0
    ],
    "ghg_grass_30": [
      -1.29,
      0
    ],
    "ghg_grass_40": [
      -1.295,
      0
    ],
    "ghg_grass_50": [
      -1.285,
      0
    ],
    "ghg_livestock_20": [
      -4.9825,
      0
    ],
    "ghg_livestock_30": [
      -4.8675,
      0
    ],
    "ghg_livestock_40": [
      -4.735,
      0
    ],
    "ghg_livestock_50": [
      -4.565,
      0
    ],
    "ghg_farm_20": [
      -6.335,
      0
    ],
    "ghg_farm_30": [
      -6.2075,
      0
    ],
    "ghg_farm_40": [
      -6.04,
      0
    ],
    "ghg_farm_50": [
      -5.8675,
      0
    ],
    "ghg_arable_ann": [
      -22.2725,
      0
    ],
    "ghg_grass_ann": [
      -10.7275,
      0
    ],
    "ghg_livestock_ann": [
      -39.9675,
      0
    ],
    "ghg_farm_ann": [
      -50.9275,
      0
    ],
    "ghg_arable_flow_20": [
      -17.84,
      0
    ],
    "ghg_arable_flow_30": [
      -21.34,
      0
    ],
    "ghg_arable_flow_40": [
      -25.855,
      0
    ],
    "ghg_arable_flow_50": [
      -32.45,
      0
    ],
    "ghg_grass_flow_20": [
      -8.1325,
      0
    ],
    "ghg_grass_flow_30": [
      -10.3075,
      0
    ],
    "ghg_grass_flow_40": [
      -12.9825,
      0
    ],
    "ghg_grass_flow_50": [
      -16.175,
      0
    ],
    "ghg_livestock_flow_20": [
      -31.6675,
      0
    ],
    "ghg_livestock_flow_30": [
      -38.8475,
      0
    ],
    "ghg_livestock_flow_40": [
      -47.425,
      0
    ],
    "ghg_livestock_flow_50": [
      -57.3675,
      0
    ],
    "ghg_farm_flow_20": [
      -40.2725,
      0
    ],
    "ghg_farm_flow_30": [
      -49.5175,
      0
    ],
    "ghg_farm_flow_40": [
      -60.5025,
      0
    ],
    "ghg_farm_flow_50": [
      -73.74,
      0
    ],
    "nfwood_ha": [
      0,
      1
    ],
    "fwood_ha": [
      0,
      0.345
    ],
    "broad_ha": [
      0,
      0.75
    ],
    "conif_ha": [
      0,
      0.945
    ],
    "wood_mgmt_ha": [
      0,
      0.9675
    ],
    "wood_nmgmt_ha": [
      0,
      1
    ],
    "broad_mgmt_ha": [
      0,
      0.61
    ],
    "conif_mgmt_ha": [
      0,
      0.925
    ],
    "broad_nmgmt_ha": [
      0,
      0.75
    ],
    "conif_nmgmt_ha": [
      0,
      0.845
    ],
    "broad_yc_20": [
      0.005,
      0.02
    ],
    "broad_yc_30": [
      0.005,
      0.02
    ],
    "broad_yc_40": [
      0.005,
      0.02
    ],
    "broad_yc_50": [
      0.005,
      0.02
    ],
    "conif_yc_20": [
      0.015,
      0.05
    ],
    "conif_yc_30": [
      0.015,
      0.05
    ],
    "conif_yc_40": [
      0.015,
      0.05
    ],
    "conif_yc_50": [
      0.015,
      0.05
    ],
    "broad_rp": [
      0.375,
      0.375
    ],
    "conif_rp": [
      0.125,
      0.175
    ],
    "timber_broad_yr": [
      0,
      4.685
    ],
    "timber_conif_yr": [
      0,
      16.0575
    ],
    "timber_mixed_yr": [
      0,
      8.25
    ],
    "timber_current_yr": [
      0,
      14.5475
    ],
    "timber_broad_50": [
      0,
      40.6025
    ],
    "timber_conif_40": [
      0,
      114.5025
    ],
    "timber_conif_50": [
      0,
      114.5025
    ],
    "timber_mixed_40": [
      0,
      45.8
    ],
    "timber_mixed_50": [
      0,
      60.74
    ],
    "timber_current_40": [
      0,
      103.685
    ],
    "timber_current_50": [
      0,
      103.81
    ],
    "timber_broad_ann": [
      -220.395,
      0
    ],
    "timber_conif_ann": [
      -91.665,
      33.9425
    ],
    "timber_mixed_ann": [
      -162.295,
      0
    ],
    "timber_current_ann": [
      -132.28,
      16.635
    ],
    "timber_broad_flow_20": [
      -605.605,
      0
    ],
    "timber_broad_flow_30": [
      -29.0075,
      0
    ],
    "timber_broad_flow_40": [
      -17.405,
      0
    ],
    "timber_broad_flow_50": [
      -14.5025,
      0.8525
    ],
    "timber_conif_flow_20": [
      -254.2425,
      0
    ],
    "timber_conif_flow_30": [
      -29.0075,
      0
    ],
    "timber_conif_flow_40": [
      -17.4,
      27.1525
    ],
    "timber_conif_flow_50": [
      -14.5,
      224.535
    ],
    "timber_mixed_flow_20": [
      -465.06,
      0
    ],
    "timber_mixed_flow_30": [
      -29.0075,
      0
    ],
    "timber_mixed_flow_40": [
      -17.4,
      1.0475
    ],
    "timber_mixed_flow_50": [
      -14.5,
      81.635
    ],
    "timber_current_flow_20": [
      -460.5425,
      0
    ],
    "timber_current_flow_30": [
      -29.0075,
      0
    ],
    "timber_current_flow_40": [
      -17.4,
      21.7325
    ],
    "timber_current_flow_50": [
      -14.5,
      179.8725
    ],
    "ghg_broad_yr": [
      0,
      1.3375
    ],
    "ghg_conif_yr": [
      0,
      1.2075
    ],
    "ghg_mixed_yr": [
      0,
      1.035
    ],
    "ghg_current_yr": [
      0,
      1.105
    ],
    "ghg_broad_30": [
      0,
      0.075
    ],
    "ghg_broad_40": [
      0,
      0.155
    ],
    "ghg_broad_50": [
      0,
      0.1175
    ],
    "ghg_conif_20": [
      0,
      0.015
    ],
    "ghg_conif_30": [
      0,
      0.125
    ],
    "ghg_conif_40": [
      0,
      0.18
    ],
    "ghg_conif_50": [
      0,
      0.2025
    ],
    "ghg_mixed_30": [
      0,
      0.065
    ],
    "ghg_mixed_40": [
      0,
      0.135
    ],
    "ghg_mixed_50": [
      0,
      0.15
    ],
    "ghg_current_30": [
      0,
      0.1025
    ],
    "ghg_current_40": [
      0,
      0.1675
    ],
    "ghg_current_50": [
      0,
      0.195
    ],
    "ghg_broad_ann": [
      0,
      25.525
    ],
    "ghg_conif_ann": [
      0,
      15.23
    ],
    "ghg_mixed_ann": [
      0,
      17.7375
    ],
    "ghg_current_ann": [
      0,
      16.405
    ],
    "ghg_broad_flow_20": [
      0,
      2.4425
    ],
    "ghg_broad_flow_30": [
      0,
      20.155
    ],
    "ghg_broad_flow_40": [
      0,
      39.975
    ],
    "ghg_broad_flow_50": [
      0,
      42.9925
    ],
    "ghg_conif_flow_20": [
      0,
      3.5675
    ],
    "ghg_conif_flow_30": [
      0,
      31.0075
    ],
    "ghg_conif_flow_40": [
      0,
      48.3475
    ],
    "ghg_conif_flow_50": [
      0,
      61.8525
    ],
    "ghg_mixed_flow_20": [
      0,
      1.7175
    ],
    "ghg_mixed_flow_30": [
      0,
      16.7775
    ],
    "ghg_mixed_flow_40": [
      0,
      35.7325
    ],
    "ghg_mixed_flow_50": [
      0,
      45.9175
    ],
    "ghg_current_flow_20": [
      0,
      3.4575
    ],
    "ghg_current_flow_30": [
      0,
      25.55
    ],
    "ghg_current_flow_40": [
      0,
      42.6325
    ],
    "ghg_current_flow_50": [
      0,
      58.44
    ],
    "fert_nitr_20": [
      0,
      103.985
    ],
    "fert_nitr_30": [
      0,
      101.88
    ],
    "fert_nitr_40": [
      0,
      102.3525
    ],
    "fert_nitr_50": [
      0,
      101.485
    ],
    "fert_phos_20": [
      0,
      84.555
    ],
    "fert_phos_30": [
      0,
      91.0975
    ],
    "fert_phos_40": [
      0,
      91.2275
    ],
    "fert_phos_50": [
      0,
      92.04
    ],
    "pest_20": [
      0,
      6.5775
    ],
    "pest_30": [
      0,
      6.9875
    ],
    "pest_40": [
      0,
      6.88
    ],
    "pest_50": [
      0,
      6.6975
    ],
    "tot_fert_pest_20": [
      0,
      183.8775
    ],
    "tot_fert_pest_30": [
      0,
      192.165
    ],
    "tot_fert_pest_40": [
      0,
      189.1125
    ],
    "tot_fert_pest_50": [
      0,
      183.11
    ],
    "prk_area": [
      0,
      352235.4675
    ],
    "pth_len": [
      0,
      96.2825
    ],
    "prk_vis_20": [
      0,
      16759.4175
    ],
    "prk_viscar_20": [
      0,
      7504.665
    ],
    "prk_viswlk_20": [
      0,
      11138.4825
    ],
    "prk_visab_20": [
      0,
      8146.56
    ],
    "prk_visc1_20": [
      0,
      5221.1475
    ],
    "prk_visc2_20": [
      0,
      1493.045
    ],
    "prk_visde_20": [
      0,
      2041.9725
    ],
    "prk_val_20": [
      0,
      70545.3725
    ],
    "prk_valab_20": [
      0,
      34567.995
    ],
    "prk_valc1_20": [
      0,
      21909.4375
    ],
    "prk_valc2_20": [
      0,
      6193.4925
    ],
    "prk_valde_20": [
      0,
      8478.8325
    ],
    "pth_vis_20": [
      0,
      1680.575
    ],
    "pth_viscar_20": [
      0,
      1233.1125
    ],
    "pth_viswlk_20": [
      0,
      775.16
    ],
    "pth_visab_20": [
      0,
      503.055
    ],
    "pth_visc1_20": [
      0,
      536.1525
    ],
    "pth_visc2_20": [
      0,
      326.5975
    ],
    "pth_visde_20": [
      0,
      314.77
    ],
    "pth_val_20": [
      0,
      6871.2875
    ],
    "pth_valab_20": [
      0,
      2057.3025
    ],
    "pth_valc1_20": [
      0,
      2192.1025
    ],
    "pth_valc2_20": [
      0,
      1335.215
    ],
    "pth_valde_20": [
      0,
      1286.6675
    ],
    "prk_vis_30": [
      0,
      16759.3925
    ],
    "prk_viscar_30": [
      0,
      7504.76
    ],
    "prk_viswlk_30": [
      0,
      11138.47
    ],
    "prk_visab_30": [
      0,
      8146.545
    ],
    "prk_visc1_30": [
      0,
      5221.14
    ],
    "prk_visc2_30": [
      0,
      1493.0625
    ],
    "prk_visde_30": [
      0,
      2041.97
    ],
    "prk_val_30": [
      0,
      70545.2625
    ],
    "prk_valab_30": [
      0,
      34567.935
    ],
    "prk_valc1_30": [
      0,
      21909.405
    ],
    "prk_valc2_30": [
      0,
      6193.575
    ],
    "prk_valde_30": [
      0,
      8478.825
    ],
    "pth_vis_30": [
      0,
      1680.7525
    ],
    "pth_viscar_30": [
      0,
      1233.1775
    ],
    "pth_viswlk_30": [
      0,
      775.0625
    ],
    "pth_visab_30": [
      0,
      503.13
    ],
    "pth_visc1_30": [
      0,
      536.205
    ],
    "pth_visc2_30": [
      0,
      326.6275
    ],
    "pth_visde_30": [
      0,
      314.7875
    ],
    "pth_val_30": [
      0,
      6872.02
    ],
    "pth_valab_30": [
      0,
      2057.61
    ],
    "pth_valc1_30": [
      0,
      2192.325
    ],
    "pth_valc2_30": [
      0,
      1335.34
    ],
    "pth_valde_30": [
      0,
      1286.745
    ],
    "prk_vis_40": [
      0,
      16759.3525
    ],
    "prk_viscar_40": [
      0,
      7504.035
    ],
    "prk_viswlk_40": [
      0,
      11138.455
    ],
    "prk_visab_40": [
      0,
      8146.5275
    ],
    "prk_visc1_40": [
      0,
      5221.1275
    ],
    "prk_visc2_40": [
      0,
      1492.9525
    ],
    "prk_visde_40": [
      0,
      2041.9675
    ],
    "prk_val_40": [
      0,
      70545.09
    ],
    "prk_valab_40": [
      0,
      34567.8525
    ],
    "prk_valc1_40": [
      0,
      21909.35
    ],
    "prk_valc2_40": [
      0,
      6193.115
    ],
    "prk_valde_40": [
      0,
      8478.8075
    ],
    "pth_vis_40": [
      0,
      1680.7075
    ],
    "pth_viscar_40": [
      0,
      1233.1525
    ],
    "pth_viswlk_40": [
      0,
      775.0025
    ],
    "pth_visab_40": [
      0,
      503.11
    ],
    "pth_visc1_40": [
      0,
      536.1925
    ],
    "pth_visc2_40": [
      0,
      326.62
    ],
    "pth_visde_40": [
      0,
      314.7825
    ],
    "pth_val_40": [
      0,
      6871.83
    ],
    "pth_valab_40": [
      0,
      2057.5275
    ],
    "pth_valc1_40": [
      0,
      2192.265
    ],
    "pth_valc2_40": [
      0,
      1335.31
    ],
    "pth_valde_40": [
      0,
      1286.725
    ],
    "prk_vis_50": [
      0,
      16759.41
    ],
    "prk_viscar_50": [
      0,
      7503.96
    ],
    "prk_viswlk_50": [
      0,
      11138.4825
    ],
    "prk_visab_50": [
      0,
      8146.5575
    ],
    "prk_visc1_50": [
      0,
      5221.145
    ],
    "prk_visc2_50": [
      0,
      1492.9475
    ],
    "prk_visde_50": [
      0,
      2041.97
    ],
    "prk_val_50": [
      0,
      70545.3375
    ],
    "prk_valab_50": [
      0,
      34567.99
    ],
    "prk_valc1_50": [
      0,
      21909.425
    ],
    "prk_valc2_50": [
      0,
      6193.0975
    ],
    "prk_valde_50": [
      0,
      8478.825
    ],
    "pth_vis_50": [
      0,
      1680.47
    ],
    "pth_viscar_50": [
      0,
      1233.045
    ],
    "pth_viswlk_50": [
      0,
      774.9925
    ],
    "pth_visab_50": [
      0,
      503.01
    ],
    "pth_visc1_50": [
      0,
      536.12
    ],
    "pth_visc2_50": [
      0,
      326.5825
    ],
    "pth_visde_50": [
      0,
      314.76
    ],
    "pth_val_50": [
      0,
      6870.8625
    ],
    "pth_valab_50": [
      0,
      2057.1125
    ],
    "pth_valc1_50": [
      0,
      2191.975
    ],
    "pth_valc2_50": [
      0,
      1335.15
    ],
    "pth_valde_50": [
      0,
      1286.6275
    ],
    "rec_vis_20": [
      0,
      16759.4175
    ],
    "rec_vis_30": [
      0,
      16759.3925
    ],
    "rec_vis_40": [
      0,
      16759.3525
    ],
    "rec_vis_50": [
      0,
      16759.41
    ],
    "rec_val_20": [
      0,
      70545.3725
    ],
    "rec_val_30": [
      0,
      70545.2625
    ],
    "rec_val_40": [
      0,
      70545.09
    ],
    "rec_val_50": [
      0,
      70545.3375
    ],
    "prk_val_ann": [
      0,
      70545.2825
    ],
    "prk_valab_ann": [
      0,
      34567.95
    ],
    "prk_valc1_ann": [
      0,
      21909.41
    ],
    "prk_valc2_ann": [
      0,
      6193.3875
    ],
    "prk_valde_ann": [
      0,
      8478.825
    ],
    "pth_val_ann": [
      0,
      6871.5375
    ],
    "pth_valab_ann": [
      0,
      2057.405
    ],
    "pth_valc1_ann": [
      0,
      2192.1775
    ],
    "pth_valc2_ann": [
      0,
      1335.26
    ],
    "pth_valde_ann": [
      0,
      1286.695
    ],
    "rec_val_ann": [
      0,
      70545.2825
    ],
    "sr_bird_20": [
      0,
      0.035
    ],
    "sr_herp_20": [
      0,
      0.0025
    ],
    "sr_invert_20": [
      0,
      0.045
    ],
    "sr_lichen_20": [
      0,
      0.0075
    ],
    "sr_mammal_20": [
      0,
      0.035
    ],
    "sr_plant_20": [
      0,
      0.0625
    ],
    "sr_100_20": [
      0,
      0.155
    ],
    "sr_bird_30": [
      0,
      0.0325
    ],
    "sr_herp_30": [
      0,
      0.0025
    ],
    "sr_invert_30": [
      0,
      0.045
    ],
    "sr_lichen_30": [
      0,
      0.01
    ],
    "sr_mammal_30": [
      0,
      0.0325
    ],
    "sr_plant_30": [
      0,
      0.0675
    ],
    "sr_100_30": [
      0,
      0.155
    ],
    "sr_bird_40": [
      0,
      0.0325
    ],
    "sr_herp_40": [
      0,
      0.0025
    ],
    "sr_invert_40": [
      0,
      0.045
    ],
    "sr_lichen_40": [
      0,
      0.01
    ],
    "sr_mammal_40": [
      0,
      0.03
    ],
    "sr_plant_40": [
      0,
      0.0675
    ],
    "sr_100_40": [
      0,
      0.155
    ],
    "sr_bird_50": [
      0,
      0.035
    ],
    "sr_herp_50": [
      0,
      0.0025
    ],
    "sr_invert_50": [
      0,
      0.0475
    ],
    "sr_lichen_50": [
      0,
      0.01
    ],
    "sr_mammal_50": [
      0,
      0.0325
    ],
    "sr_plant_50": [
      0,
      0.065
    ],
    "sr_100_50": [
      0,
      0.1575
    ]
  },
  "subbasins": {
    "tot_area": [
      1,
      1
    ],
    "wood_ha": [
      0,
      0.9439655172413793
    ],
    "sngrass_ha": [
      0,
      0.5714285714285714
    ],
    "urban_ha": [
      0,
      1
    ],
    "water_ha": [
      0,
      0.5238095238095238
    ],
    "farm_ha": [
      0,
      1
    ],
    "arable_ha_20": [
      0,
      1
    ],
    "arable_ha_30": [
      0,
      1
    ],
    "arable_ha_40": [
      0,
      1
    ],
    "arable_ha_50": [
      0,
      1
    ],
    "grass_ha_20": [
      0,
      1
    ],
    "grass_ha_30": [
      0,
      1
    ],
    "grass_ha_40": [
      0,
      1
    ],
    "grass_ha_50": [
      0,
      1
    ],
    "wheat_ha_20": [
      0,
      1
    ],
    "wheat_ha_30": [
      0,
      1
    ],
    "wheat_ha_40": [
      0,
      1
    ],
    "wheat_ha_50": [
      0,
      1
    ],
    "osr_ha_20": [
      0,
      0.3333333333333333
    ],
    "osr_ha_30": [
      0,
      0.3333333333333333
    ],
    "osr_ha_40": [
      0,
      0.3333333333333333
    ],
    "osr_ha_50": [
      0,
      0.3333333333333333
    ],
    "wbar_ha_20": [
      0,
      0.25
    ],
    "wbar_ha_30": [
      0,
      0.25
    ],
    "wbar_ha_40": [
      0,
      0.25
    ],
    "wbar_ha_50": [
      0,
      0.25
    ],
    "sbar_ha_20": [
      0,
      0.3333333333333333
    ],
    "sbar_ha_30": [
      0,
      0.3333333333333333
    ],
    "sbar_ha_40": [
      0,
      0.3333333333333333
    ],
    "sbar_ha_50": [
      0,
      0.3333333333333333
    ],
    "pot_ha_20": [
      0,
      0.2
    ],
    "pot_ha_30": [
      0,
      0.2
    ],
    "pot_ha_40": [
      0,
      0.2
    ],
    "pot_ha_50": [
      0,
      0.2
    ],
    "sb_ha_20": [
      0,
      0.25
    ],
    "sb_ha_30": [
      0,
      0.25
    ],
    "sb_ha_40": [
      0,
      0.25
    ],
    "sb_ha_50": [
      0,
      0.25
    ],
    "other_ha_20": [
      0,
      0.5
    ],
    "other_ha_30": [
      0,
      0.5
    ],
    "other_ha_40": [
      0,
      0.5
    ],
    "other_ha_50": [
      0,
      0.5
    ],
    "pgrass_ha_20": [
      0,
      1
    ],
    "pgrass_ha_30": [
      0,
      1
    ],
    "pgrass_ha_40": [
      0,
      1
    ],
    "pgrass_ha_50": [
      0,
      1
    ],
    "tgrass_ha_20": [
      0,
      0.3333333333333333
    ],
    "tgrass_ha_30": [
      0,
      0.3333333333333333
    ],
    "tgrass_ha_40": [
      0,
      0.3333333333333333
    ],
    "tgrass_ha_50": [
      0,
      0.3333333333333333
    ],
    "rgraz_ha_20": [
      0,
      0.9067357512953368
    ],
    "rgraz_ha_30": [
      0,
      0.9015544041450777
    ],
    "rgraz_ha_40": [
      0,
      0.8963730569948186
    ],
    "rgraz_ha_50": [
      0,
      0.8911917098445595
    ],
    "dairy_20": [
      0,
      0.55
    ],
    "dairy_30": [
      0,
      0.5238095238095238
    ],
    "dairy_40": [
      0,
      0.5119047619047619
    ],
    "dairy_50": [
      0,
      0.5
    ],
    "beef_20": [
      0,
      1
    ],
    "beef_30": [
      0,
      1
    ],
    "beef_40": [
      0,
      0.6
    ],
    "beef_50": [
      0,
      0.6
    ],
    "sheep_20": [
      0,
      6.67008547008547
    ],
    "sheep_30": [
      0,
      6.464957264957265
    ],
    "sheep_40": [
      0,
      6.167521367521368
    ],
    "sheep_50": [
      0,
      5.793162393162393
    ],
    "livestock_20": [
      0,
      6.996884735202492
    ],
    "livestock_30": [
      0,
      6.699145299145299
    ],
    "livestock_40": [
      0,
      6.423931623931624
    ],
    "livestock_50": [
      0,
      6.064957264957265
    ],
    "wheat_food_20": [
      0,
      4.903973509933775
    ],
    "wheat_food_30": [
      0,
      4.870860927152318
    ],
    "wheat_food_40": [
      0,
      4.870860927152318
    ],
    "wheat_food_50": [
      0,
      4.870860927152318
    ],
    "osr_food_20": [
      0,
      0.6432432432432432
    ],
    "osr_food_30": [
      0,
      0.6702702702702703
    ],
    "osr_food_40": [
      0,
      0.6864864864864865
    ],
    "osr_food_50": [
      0,
      0.6648648648648648
    ],
    "wbar_food_20": [
      0,
      1.4
    ],
    "wbar_food_30": [
      0,
      1.4
    ],
    "wbar_food_40": [
      0,
      1.4
    ],
    "wbar_food_50": [
      0,
      1.2346820809248555
    ],
    "sbar_food_20": [
      0,
      1.2836879432624113
    ],
    "sbar_food_30": [
      0,
      1.3478260869565217
    ],
    "sbar_food_40": [
      0,
      1.4782608695652173
    ],
    "sbar_food_50": [
      0,
      1.4782608695652173
    ],
    "pot_food_20": [
      0,
      5.762135922330097
    ],
    "pot_food_30": [
      0,
      6.407766990291262
    ],
    "pot_food_40": [
      0,
      6.475728155339806
    ],
    "pot_food_50": [
      0,
      6.289644012944984
    ],
    "sb_food_20": [
      0,
      11.664334033123396
    ],
    "sb_food_30": [
      0,
      11.188943317004899
    ],
    "sb_food_40": [
      0,
      11.1863774201073
    ],
    "sb_food_50": [
      0,
      11.1863774201073
    ],
    "food_20": [
      0,
      17.4728248192209
    ],
    "food_30": [
      0,
      16.85141124329368
    ],
    "food_40": [
      0,
      16.8481455563331
    ],
    "food_50": [
      0,
      16.8481455563331
    ],
    "arable_profit_ann": [
      0,
      524.0906148867314
    ],
    "livestock_profit_ann": [
      0,
      396.25
    ],
    "farm_profit_ann": [
      0,
      575.0436893203884
    ],
    "arable_profit_flow_20": [
      0,
      495.5744336569579
    ],
    "arable_profit_flow_30": [
      0,
      542.6423948220065
    ],
    "arable_profit_flow_40": [
      0,
      548.957928802589
    ],
    "arable_profit_flow_50": [
      0,
      537.004854368932
    ],
    "livestock_profit_flow_20": [
      0,
      409.4
    ],
    "livestock_profit_flow_30": [
      0,
      400.35714285714283
    ],
    "livestock_profit_flow_40": [
      0,
      387.82142857142856
    ],
    "livestock_profit_flow_50": [
      0,
      369.1309523809524
    ],
    "farm_profit_flow_20": [
      0,
      556.9546925566343
    ],
    "farm_profit_flow_30": [
      0,
      590.6359223300971
    ],
    "farm_profit_flow_40": [
      0,
      590.5323624595469
    ],
    "farm_profit_flow_50": [
      0,
      576.0145631067961
    ],
    "ghg_arable_20": [
      -2.1666666666666665,
      0
    ],
    "ghg_arable_30": [
      -2.015957446808511,
      0
    ],
    "ghg_arable_40": [
      -2.0702702702702704,
      0
    ],
    "ghg_arable_50": [
      -2,
      0
    ],
    "ghg_grass_20": [
      -1.2222222222222223,
      0
    ],
    "ghg_grass_30": [
      -1.2318840579710144,
      0
    ],
    "ghg_grass_40": [
      -1.2318840579710144,
      0
    ],
    "ghg_grass_50": [
      -1.2463768115942029,
      0
    ],
    "ghg_livestock_20": [
      -5,
      0
    ],
    "ghg_livestock_30": [
      -4.8,
      0
    ],
    "ghg_livestock_40": [
      -4.623529411764705,
      0
    ],
    "ghg_livestock_50": [
      -4.3882352941176475,
      0
    ],
    "ghg_farm_20": [
      -6.4,
      0
    ],
    "ghg_farm_30": [
      -6.2,
      0
    ],
    "ghg_farm_40": [
      -5.988235294117647,
      0
    ],
    "ghg_farm_50": [
      -5.741176470588235,
      0
    ],
    "ghg_arable_ann": [
      -17.5,
      0
    ],
    "ghg_grass_ann": [
      -10.26086956521739,
      0
    ],
    "ghg_livestock_ann": [
      -39.285714285714285,
      0
    ],
    "ghg_farm_ann": [
      -50.95,
      0
    ],
    "ghg_arable_flow_20": [
      -13.666666666666666,
      0
    ],
    "ghg_arable_flow_30": [
      -16.5,
      0
    ],
    "ghg_arable_flow_40": [
      -20.724324324324325,
      0
    ],
    "ghg_arable_flow_50": [
      -25.833333333333332,
      0
    ],
    "ghg_grass_flow_20": [
      -7.768115942028985,
      0
    ],
    "ghg_grass_flow_30": [
      -9.81159420289855,
      0
    ],
    "ghg_grass_flow_40": [
      -12.405797101449275,
      0
    ],
    "ghg_grass_flow_50": [
      -15.63768115942029,
      0
    ],
    "ghg_livestock_flow_20": [
      -31.9,
      0
    ],
    "ghg_livestock_flow_30": [
      -38.45,
      0
    ],
    "ghg_livestock_flow_40": [
      -46.29761904761905,
      0
    ],
    "ghg_livestock_flow_50": [
      -55.083333333333336,
      0
    ],
    "ghg_farm_flow_20": [
      -40.8,
      0
    ],
    "ghg_farm_flow_30": [
      -49.8,
      0
    ],
    "ghg_farm_flow_40": [
      -59.92941176470588,
      0
    ],
    "ghg_farm_flow_50": [
      -72.1547619047619,
      0
    ],
    "nfwood_ha": [
      0,
      0.9261538461538461
    ],
    "fwood_ha": [
      0,
      0.27450980392156865
    ],
    "broad_ha": [
      0,
      0.7010309278350515
    ],
    "conif_ha": [
      0,
      0.8933189655172413
    ],
    "wood_mgmt_ha": [
      0,
      0.7933333333333333
    ],
    "wood_nmgmt_ha": [
      0,
      0.8571428571428571
    ],
    "broad_mgmt_ha": [
      0,
      0.6363636363636364
    ],
    "conif_mgmt_ha": [
      0,
      0.7688888888888888
    ],
    "broad_nmgmt_ha": [
      0,
      0.5866666666666667
    ],
    "conif_nmgmt_ha": [
      0,
      0.6390977443609023
    ],
    "broad_yc_20": [
      0.000038639876352395674,
      8
    ],
    "broad_yc_30": [
      0.000038639876352395674,
      8
    ],
    "broad_yc_40": [
      0.000038639876352395674,
      8
    ],
    "broad_yc_50": [
      0.000038639876352395674,
      8
    ],
    "conif_yc_20": [
      0.00015380052072462016,
      18
    ],
    "conif_yc_30": [
      0.00014281476924429015,
      18
    ],
    "conif_yc_40": [
      0.00014281476924429015,
      18
    ],
    "conif_yc_50": [
      0.00013523956723338485,
      18
    ],
    "broad_rp": [
      0.0014489953632148378,
      150
    ],
    "conif_rp": [
      0.0005602782071097372,
      70
    ],
    "timber_broad_yr": [
      0,
      3.64
    ],
    "timber_conif_yr": [
      0,
      12.068888888888889
    ],
    "timber_mixed_yr": [
      0,
      6.097777777777778
    ],
    "timber_current_yr": [
      0,
      11.757777777777777
    ],
    "timber_broad_50": [
      0,
      29.464615384615385
    ],
    "timber_conif_40": [
      0,
      84.28
    ],
    "timber_conif_50": [
      0,
      84.28
    ],
    "timber_mixed_40": [
      0,
      33.71333333333333
    ],
    "timber_mixed_50": [
      0,
      44.1
    ],
    "timber_current_40": [
      0,
      81.72888888888889
    ],
    "timber_current_50": [
      0,
      82.17555555555556
    ],
    "timber_broad_ann": [
      -179.7288888888889,
      0
    ],
    "timber_conif_ann": [
      -65.81818181818181,
      8.572953736654805
    ],
    "timber_mixed_ann": [
      -122.43558282208589,
      0
    ],
    "timber_current_ann": [
      -135.54545454545453,
      4.044668587896253
    ],
    "timber_broad_flow_20": [
      -497.7311111111111,
      0
    ],
    "timber_broad_flow_30": [
      -23.782222222222224,
      0
    ],
    "timber_broad_flow_40": [
      -14.268888888888888,
      0
    ],
    "timber_broad_flow_50": [
      -11.891111111111112,
      0.7794117647058824
    ],
    "timber_conif_flow_20": [
      -209.64666666666668,
      0
    ],
    "timber_conif_flow_30": [
      -23.782222222222224,
      0
    ],
    "timber_conif_flow_40": [
      -13.319018404907975,
      12.282222222222222
    ],
    "timber_conif_flow_50": [
      -10.272727272727273,
      138.46
    ],
    "timber_mixed_flow_20": [
      -382.4977777777778,
      0
    ],
    "timber_mixed_flow_30": [
      -23.782222222222224,
      0
    ],
    "timber_mixed_flow_40": [
      -13.319018404907975,
      0.30526315789473685
    ],
    "timber_mixed_flow_50": [
      -10.272727272727273,
      48.24888888888889
    ],
    "timber_current_flow_20": [
      -390.8181818181818,
      0
    ],
    "timber_current_flow_30": [
      -23.782222222222224,
      0
    ],
    "timber_current_flow_40": [
      -13.319018404907975,
      11.506666666666666
    ],
    "timber_current_flow_50": [
      -10.272727272727273,
      134.07777777777778
    ],
    "ghg_broad_yr": [
      0,
      0.9907692307692307
    ],
    "ghg_conif_yr": [
      0,
      0.9066666666666666
    ],
    "ghg_mixed_yr": [
      0,
      0.75
    ],
    "ghg_current_yr": [
      0,
      0.8955555555555555
    ],
    "ghg_broad_30": [
      0,
      0.09090909090909091
    ],
    "ghg_broad_40": [
      0,
      0.125
    ],
    "ghg_broad_50": [
      0,
      0.09615384615384616
    ],
    "ghg_conif_20": [
      0,
      0.011111111111111112
    ],
    "ghg_conif_30": [
      0,
      0.07777777777777778
    ],
    "ghg_conif_40": [
      0,
      0.13555555555555557
    ],
    "ghg_conif_50": [
      0,
      0.16
    ],
    "ghg_mixed_30": [
      0,
      0.04411764705882353
    ],
    "ghg_mixed_40": [
      0,
      0.09777777777777778
    ],
    "ghg_mixed_50": [
      0,
      0.11538461538461539
    ],
    "ghg_current_30": [
      0,
      0.09090909090909091
    ],
    "ghg_current_40": [
      0,
      0.13333333333333333
    ],
    "ghg_current_50": [
      0,
      0.15555555555555556
    ],
    "ghg_broad_ann": [
      0,
      18.09090909090909
    ],
    "ghg_conif_ann": [
      0,
      11.602222222222222
    ],
    "ghg_mixed_ann": [
      0,
      12.569230769230769
    ],
    "ghg_current_ann": [
      0,
      15.818181818181818
    ],
    "ghg_broad_flow_20": [
      0,
      2.2205882352941178
    ],
    "ghg_broad_flow_30": [
      0,
      14.867647058823529
    ],
    "ghg_broad_flow_40": [
      0,
      28.363636363636363
    ],
    "ghg_broad_flow_50": [
      0,
      31.110769230769233
    ],
    "ghg_conif_flow_20": [
      0,
      2.7666666666666666
    ],
    "ghg_conif_flow_30": [
      0,
      20.5
    ],
    "ghg_conif_flow_40": [
      0,
      34.07555555555555
    ],
    "ghg_conif_flow_50": [
      0,
      47.16888888888889
    ],
    "ghg_mixed_flow_20": [
      0,
      1.4558823529411764
    ],
    "ghg_mixed_flow_30": [
      0,
      10.275555555555556
    ],
    "ghg_mixed_flow_40": [
      0,
      25.026666666666667
    ],
    "ghg_mixed_flow_50": [
      0,
      33.58888888888889
    ],
    "ghg_current_flow_20": [
      0,
      2.6955555555555555
    ],
    "ghg_current_flow_30": [
      0,
      19.973333333333333
    ],
    "ghg_current_flow_40": [
      0,
      33.54
    ],
    "ghg_current_flow_50": [
      0,
      46.373333333333335
    ],
    "fert_nitr_20": [
      0,
      90.82484076433121
    ],
    "fert_nitr_30": [
      0,
      94.32643312101911
    ],
    "fert_nitr_40": [
      0,
      95.1790017211704
    ],
    "fert_nitr_50": [
      0,
      92.69191049913941
    ],
    "fert_phos_20": [
      0,
      57.65094339622642
    ],
    "fert_phos_30": [
      0,
      61.26537216828479
    ],
    "fert_phos_40": [
      0,
      61.728155339805824
    ],
    "fert_phos_50": [
      0,
      60.23462783171521
    ],
    "pest_20": [
      0,
      5.032407407407407
    ],
    "pest_30": [
      0,
      4.942675159235669
    ],
    "pest_40": [
      0,
      4.971698113207547
    ],
    "pest_50": [
      0,
      4.930787589498807
    ],
    "tot_fert_pest_20": [
      0,
      151.83333333333334
    ],
    "tot_fert_pest_30": [
      0,
      152.4398907103825
    ],
    "tot_fert_pest_40": [
      0,
      151.32013769363166
    ],
    "tot_fert_pest_50": [
      0,
      147.40275387263338
    ],
    "prk_area": [
      0,
      209959.30034046693
    ],
    "pth_len": [
      0,
      68.21
    ],
    "prk_vis_20": [
      0,
      5278.375
    ],
    "prk_viscar_20": [
      0,
      1812.8333333333333
    ],
    "prk_viswlk_20": [
      0,
      4435.625
    ],
    "prk_visab_20": [
      0,
      1748.75
    ],
    "prk_visc1_20": [
      0,
      2337
    ],
    "prk_visc2_20": [
      0,
      681.0320197044335
    ],
    "prk_visde_20": [
      0,
      960.2222222222222
    ],
    "prk_val_20": [
      0,
      21629.875
    ],
    "prk_valab_20": [
      0,
      7172.625
    ],
    "prk_valc1_20": [
      0,
      9577.25
    ],
    "prk_valc2_20": [
      0,
      2861.84236453202
    ],
    "prk_valde_20": [
      0,
      3977.0172413793102
    ],
    "pth_vis_20": [
      0,
      503.3852140077821
    ],
    "pth_viscar_20": [
      0,
      428.94844357976655
    ],
    "pth_viswlk_20": [
      0,
      397.25
    ],
    "pth_visab_20": [
      0,
      173.1215953307393
    ],
    "pth_visc1_20": [
      0,
      211.375
    ],
    "pth_visc2_20": [
      0,
      96.38035019455253
    ],
    "pth_visde_20": [
      0,
      76.25
    ],
    "pth_val_20": [
      0,
      2057.84046692607
    ],
    "pth_valab_20": [
      0,
      707.9124513618677
    ],
    "pth_valc1_20": [
      0,
      864.875
    ],
    "pth_valc2_20": [
      0,
      393.9338521400778
    ],
    "pth_valde_20": [
      0,
      312
    ],
    "prk_vis_30": [
      0,
      5278.25
    ],
    "prk_viscar_30": [
      0,
      1812.8484848484848
    ],
    "prk_viswlk_30": [
      0,
      4435.5
    ],
    "prk_visab_30": [
      0,
      1748.75
    ],
    "prk_visc1_30": [
      0,
      2337
    ],
    "prk_visc2_30": [
      0,
      681.039408866995
    ],
    "prk_visde_30": [
      0,
      960.2328042328043
    ],
    "prk_val_30": [
      0,
      21629.5
    ],
    "prk_valab_30": [
      0,
      7172.5
    ],
    "prk_valc1_30": [
      0,
      9577.125
    ],
    "prk_valc2_30": [
      0,
      2861.871921182266
    ],
    "prk_valde_30": [
      0,
      3977.0492610837437
    ],
    "pth_vis_30": [
      0,
      503.36964980544747
    ],
    "pth_viscar_30": [
      0,
      428.94163424124514
    ],
    "pth_viswlk_30": [
      0,
      397.125
    ],
    "pth_visab_30": [
      0,
      173.11381322957197
    ],
    "pth_visc1_30": [
      0,
      211.375
    ],
    "pth_visc2_30": [
      0,
      96.3784046692607
    ],
    "pth_visde_30": [
      0,
      76.25
    ],
    "pth_val_30": [
      0,
      2057.775291828794
    ],
    "pth_valab_30": [
      0,
      707.8793774319066
    ],
    "pth_valc1_30": [
      0,
      864.875
    ],
    "pth_valc2_30": [
      0,
      393.9250972762646
    ],
    "pth_valde_30": [
      0,
      312
    ],
    "prk_vis_40": [
      0,
      5278.75
    ],
    "prk_viscar_40": [
      0,
      1812.8484848484848
    ],
    "prk_viswlk_40": [
      0,
      4435.875
    ],
    "prk_visab_40": [
      0,
      1748.875
    ],
    "prk_visc1_40": [
      0,
      2337.125
    ],
    "prk_visc2_40": [
      0,
      681.0197044334975
    ],
    "prk_visde_40": [
      0,
      960.2169312169312
    ],
    "prk_val_40": [
      0,
      21631.5
    ],
    "prk_valab_40": [
      0,
      7173.375
    ],
    "prk_valc1_40": [
      0,
      9577.875
    ],
    "prk_valc2_40": [
      0,
      2861.785714285714
    ],
    "prk_valde_40": [
      0,
      3976.9532019704434
    ],
    "pth_vis_40": [
      0,
      503.341439688716
    ],
    "pth_viscar_40": [
      0,
      428.9280155642023
    ],
    "pth_viswlk_40": [
      0,
      397.25
    ],
    "pth_visab_40": [
      0,
      173.1001945525292
    ],
    "pth_visc1_40": [
      0,
      211.375
    ],
    "pth_visc2_40": [
      0,
      96.37451361867704
    ],
    "pth_visde_40": [
      0,
      76.25
    ],
    "pth_val_40": [
      0,
      2057.658560311284
    ],
    "pth_valab_40": [
      0,
      707.8229571984435
    ],
    "pth_valc1_40": [
      0,
      865
    ],
    "pth_valc2_40": [
      0,
      393.908560311284
    ],
    "pth_valde_40": [
      0,
      312
    ],
    "prk_vis_50": [
      0,
      5278.875
    ],
    "prk_viscar_50": [
      0,
      1812.8636363636363
    ],
    "prk_viswlk_50": [
      0,
      4436
    ],
    "prk_visab_50": [
      0,
      1749
    ],
    "prk_visc1_50": [
      0,
      2337.125
    ],
    "prk_visc2_50": [
      0,
      681.0320197044335
    ],
    "prk_visde_50": [
      0,
      960.2275132275132
    ],
    "prk_val_50": [
      0,
      21632
    ],
    "prk_valab_50": [
      0,
      7173.5
    ],
    "prk_valc1_50": [
      0,
      9578.125
    ],
    "prk_valc2_50": [
      0,
      2861.844827586207
    ],
    "prk_valde_50": [
      0,
      3977.0172413793102
    ],
    "pth_vis_50": [
      0,
      503.31517509727627
    ],
    "pth_viscar_50": [
      0,
      428.9124513618677
    ],
    "pth_viswlk_50": [
      0,
      397.25
    ],
    "pth_visab_50": [
      0,
      173.0875486381323
    ],
    "pth_visc1_50": [
      0,
      211.375
    ],
    "pth_visc2_50": [
      0,
      96.37062256809338
    ],
    "pth_visde_50": [
      0,
      76.25
    ],
    "pth_val_50": [
      0,
      2057.5515564202333
    ],
    "pth_valab_50": [
      0,
      707.7714007782101
    ],
    "pth_valc1_50": [
      0,
      865
    ],
    "pth_valc2_50": [
      0,
      393.89396887159535
    ],
    "pth_valde_50": [
      0,
      312
    ],
    "rec_vis_20": [
      0,
      5769
    ],
    "rec_vis_30": [
      0,
      5768.875
    ],
    "rec_vis_40": [
      0,
      5769.375
    ],
    "rec_vis_50": [
      0,
      5769.5
    ],
    "rec_val_20": [
      0,
      23637.125
    ],
    "rec_val_30": [
      0,
      23636.875
    ],
    "rec_val_40": [
      0,
      23639
    ],
    "rec_val_50": [
      0,
      23639.5
    ],
    "prk_val_ann": [
      0,
      21630.375
    ],
    "prk_valab_ann": [
      0,
      7172.875
    ],
    "prk_valc1_ann": [
      0,
      9577.5
    ],
    "prk_valc2_ann": [
      0,
      2861.8399014778324
    ],
    "prk_valde_ann": [
      0,
      3977.012315270936
    ],
    "pth_val_ann": [
      0,
      2057.7461089494163
    ],
    "pth_valab_ann": [
      0,
      707.8657587548638
    ],
    "pth_valc1_ann": [
      0,
      865
    ],
    "pth_valc2_ann": [
      0,
      393.9212062256809
    ],
    "pth_valde_ann": [
      0,
      312
    ],
    "rec_val_ann": [
      0,
      23637.75
    ],
    "sr_bird_20": [
      0,
      8
    ],
    "sr_herp_20": [
      0,
      1
    ],
    "sr_invert_20": [
      0,
      12
    ],
    "sr_lichen_20": [
      0,
      1
    ],
    "sr_mammal_20": [
      0,
      7
    ],
    "sr_plant_20": [
      0,
      10
    ],
    "sr_100_20": [
      0,
      30
    ],
    "sr_bird_30": [
      0,
      9
    ],
    "sr_herp_30": [
      0,
      1
    ],
    "sr_invert_30": [
      0,
      11
    ],
    "sr_lichen_30": [
      0,
      1
    ],
    "sr_mammal_30": [
      0,
      9
    ],
    "sr_plant_30": [
      0,
      10
    ],
    "sr_100_30": [
      0,
      33
    ],
    "sr_bird_40": [
      0,
      6
    ],
    "sr_herp_40": [
      0,
      1
    ],
    "sr_invert_40": [
      0,
      12
    ],
    "sr_lichen_40": [
      0,
      1
    ],
    "sr_mammal_40": [
      0,
      10
    ],
    "sr_plant_40": [
      0,
      10
    ],
    "sr_100_40": [
      0,
      36
    ],
    "sr_bird_50": [
      0,
      8
    ],
    "sr_herp_50": [
      0,
      1
    ],
    "sr_invert_50": [
      0,
      13
    ],
    "sr_lichen_50": [
      0,
      1
    ],
    "sr_mammal_50": [
      0,
      9
    ],
    "sr_plant_50": [
      0,
      14
    ],
    "sr_100_50": [
      0,
      41
    ]
  },
  "national_parks": {
    "tot_area": [
      1,
      1
    ],
    "wood_ha": [
      0.04289179787623581,
      0.3710719369320048
    ],
    "sngrass_ha": [
      0.008537785854914434,
      0.2579320761625778
    ],
    "urban_ha": [
      0.011856391127689336,
      0.11029599620424103
    ],
    "water_ha": [
      0.0018269880389376826,
      0.1120513402998637
    ],
    "farm_ha": [
      0.2596810102558488,
      0.7183098591549296
    ],
    "arable_ha_20": [
      0.011406916153481762,
      0.424802681370959
    ],
    "arable_ha_30": [
      0.011596399810516344,
      0.40559339748441275
    ],
    "arable_ha_40": [
      0.011804831833254382,
      0.40350308141420693
    ],
    "arable_ha_50": [
      0.012089057318806253,
      0.40350308141420693
    ],
    "grass_ha_20": [
      0.12192050804773896,
      0.6887683562292752
    ],
    "grass_ha_30": [
      0.10834337019599255,
      0.6885788725722406
    ],
    "grass_ha_40": [
      0.10173728968210519,
      0.6883704405495026
    ],
    "grass_ha_50": [
      0.10140881054053068,
      0.6880862150639507
    ],
    "wheat_ha_20": [
      0.005386839671799087,
      0.12603164306051104
    ],
    "wheat_ha_30": [
      0.005472020705406459,
      0.1246621256352038
    ],
    "wheat_ha_40": [
      0.00527490797835188,
      0.12451796590622409
    ],
    "wheat_ha_50": [
      0.005120645844135254,
      0.12800988483918876
    ],
    "osr_ha_20": [
      0.00036001894836570344,
      0.0423829603200346
    ],
    "osr_ha_30": [
      0.0006963524396020844,
      0.04463394444038663
    ],
    "osr_ha_40": [
      0.001094268119374704,
      0.04985635332213376
    ],
    "osr_ha_50": [
      0.0015300805305542397,
      0.05396489177805371
    ],
    "wbar_ha_20": [
      0.0005400284225485552,
      0.0813421270768011
    ],
    "wbar_ha_30": [
      0.0006631927996210326,
      0.07067430713230259
    ],
    "wbar_ha_40": [
      0.0007910942681193747,
      0.06952102930046491
    ],
    "wbar_ha_50": [
      0.0009332070108953103,
      0.06952102930046491
    ],
    "sbar_ha_20": [
      0.0004210911753936287,
      0.05888924928821134
    ],
    "sbar_ha_30": [
      0.0006631927996210326,
      0.05117670378779688
    ],
    "sbar_ha_40": [
      0.0007910942681193747,
      0.05034778534616355
    ],
    "sbar_ha_50": [
      0.0009332070108953103,
      0.05034778534616355
    ],
    "pot_ha_20": [
      0,
      0.013911413846541968
    ],
    "pot_ha_30": [
      0,
      0.012325656827765165
    ],
    "pot_ha_40": [
      0,
      0.012145457166540526
    ],
    "pot_ha_50": [
      0,
      0.012145457166540526
    ],
    "sb_ha_20": [
      0,
      0.03578765271921289
    ],
    "sb_ha_30": [
      0,
      0.03171514037553609
    ],
    "sb_ha_40": [
      0,
      0.03128266118859697
    ],
    "sb_ha_50": [
      0,
      0.03128266118859697
    ],
    "other_ha_20": [
      0.0023780198957839885,
      0.0664576350596461
    ],
    "other_ha_30": [
      0.0022501184272856467,
      0.07258442354128375
    ],
    "other_ha_40": [
      0.002174324964471814,
      0.07316106245720258
    ],
    "other_ha_50": [
      0.0020937944102321173,
      0.07316106245720258
    ],
    "pgrass_ha_20": [
      0.07443702324902368,
      0.41117673784643344
    ],
    "pgrass_ha_30": [
      0.06348771852987335,
      0.40341511434196575
    ],
    "pgrass_ha_40": [
      0.05662615423920581,
      0.3961646221414509
    ],
    "pgrass_ha_50": [
      0.05489251432534034,
      0.392018779342723
    ],
    "tgrass_ha_20": [
      0.012363808621506395,
      0.07666969559291231
    ],
    "tgrass_ha_30": [
      0.013529133112269066,
      0.07555277903983038
    ],
    "tgrass_ha_40": [
      0.014902889625769777,
      0.07339466908980766
    ],
    "tgrass_ha_50": [
      0.016418758882046424,
      0.07195592912312586
    ],
    "rgraz_ha_20": [
      0.026022847549180626,
      0.46187115111321647
    ],
    "rgraz_ha_30": [
      0.025402386948428776,
      0.45152534343912837
    ],
    "rgraz_ha_40": [
      0.02622358480236505,
      0.44202747513027
    ],
    "rgraz_ha_50": [
      0.027373261797875834,
      0.43365703458076743
    ],
    "dairy_20": [
      0.02202039860165063,
      0.13493866424352566
    ],
    "dairy_30": [
      0.018467827292966896,
      0.12426169922762381
    ],
    "dairy_40": [
      0.014708566006058615,
      0.1123542329244283
    ],
    "dairy_50": [
      0.01341289828095916,
      0.10319173103134939
    ],
    "beef_20": [
      0.0637796999890507,
      0.33397698016053307
    ],
    "beef_30": [
      0.05691813569838315,
      0.31179009541117675
    ],
    "beef_40": [
      0.05447279097777291,
      0.3031753432739245
    ],
    "beef_50": [
      0.05472827475455309,
      0.3050403935636734
    ],
    "sheep_20": [
      0.14077156100587612,
      3.571205297620811
    ],
    "sheep_30": [
      0.125734515858243,
      3.2773661771672193
    ],
    "sheep_40": [
      0.12215774298332056,
      3.068209379441023
    ],
    "sheep_50": [
      0.12365414796160444,
      2.8556702984367597
    ],
    "livestock_20": [
      0.22843899412387314,
      3.8781665728422863
    ],
    "livestock_30": [
      0.20112047884959305,
      3.489111433735297
    ],
    "livestock_40": [
      0.1913390999671521,
      3.2815916627190904
    ],
    "livestock_50": [
      0.1917953209971167,
      3.0754381809568923
    ],
    "wheat_food_20": [
      0.044107501944839936,
      1.0323278192236998
    ],
    "wheat_food_30": [
      0.04480457987136252,
      1.0209752405665478
    ],
    "wheat_food_40": [
      0.043197682639939325,
      1.0198940425992
    ],
    "wheat_food_50": [
      0.041955015447638716,
      1.0484077130961946
    ],
    "osr_food_20": [
      0.001269540502131691,
      0.1496738386131834
    ],
    "osr_food_30": [
      0.00246328754144955,
      0.15757310155089718
    ],
    "osr_food_40": [
      0.003855992420653719,
      0.17598544055705695
    ],
    "osr_food_50": [
      0.005400284225485552,
      0.19050227643464077
    ],
    "wbar_food_20": [
      0.0036522974893415444,
      0.5481673694453455
    ],
    "wbar_food_30": [
      0.004457603031738513,
      0.4762677046167153
    ],
    "wbar_food_40": [
      0.005338702036949313,
      0.46855515911630086
    ],
    "wbar_food_50": [
      0.006305068687825675,
      0.46855515911630086
    ],
    "sbar_food_20": [
      0.002338886854632003,
      0.328035463293329
    ],
    "sbar_food_30": [
      0.003685457129322596,
      0.2850037841928857
    ],
    "sbar_food_40": [
      0.004410232117479867,
      0.28039067286553504
    ],
    "sbar_food_50": [
      0.005210800568450971,
      0.28039067286553504
    ],
    "pot_food_20": [
      0,
      0.5162359894763398
    ],
    "pot_food_30": [
      0,
      0.4576710995783328
    ],
    "pot_food_40": [
      0,
      0.4512559916387357
    ],
    "pot_food_50": [
      0,
      0.4512559916387357
    ],
    "sb_food_20": [
      0,
      2.1719104768083035
    ],
    "sb_food_30": [
      0,
      1.92554149998198
    ],
    "sb_food_40": [
      0,
      1.8984755108660396
    ],
    "sb_food_50": [
      0,
      1.8984755108660396
    ],
    "food_20": [
      0.0649614987423351,
      4.746350956860201
    ],
    "food_30": [
      0.06822242885730324,
      4.315349407143114
    ],
    "food_40": [
      0.0706691977083503,
      4.268677694885934
    ],
    "food_50": [
      0.07171956418758882,
      4.268677694885934
    ],
    "arable_profit_ann": [
      4.612936996684036,
      186.54978916639638
    ],
    "livestock_profit_ann": [
      17.68393007044053,
      122.30798500681509
    ],
    "farm_profit_ann": [
      65.2691757460919,
      211.94435434461383
    ],
    "arable_profit_flow_20": [
      4.59504026527712,
      192.8727069593109
    ],
    "arable_profit_flow_30": [
      4.602510658455708,
      182.80469960716474
    ],
    "arable_profit_flow_40": [
      4.625902415916627,
      181.69391285544384
    ],
    "arable_profit_flow_50": [
      4.6702747513027,
      181.69391285544384
    ],
    "livestock_profit_flow_20": [
      21.093069090112778,
      134.702256550053
    ],
    "livestock_profit_flow_30": [
      16.985638161976713,
      122.83708162956232
    ],
    "livestock_profit_flow_40": [
      14.36815212234023,
      110.46126760563381
    ],
    "livestock_profit_flow_50": [
      13.565568086426511,
      100.9602453430259
    ],
    "farm_profit_flow_20": [
      65.2445239223117,
      219.07528741845965
    ],
    "farm_profit_flow_30": [
      65.28751302700142,
      207.88589757451257
    ],
    "farm_profit_flow_40": [
      65.3881667456182,
      206.35668720942806
    ],
    "farm_profit_flow_50": [
      65.13193747039318,
      206.3566511694958
    ],
    "ghg_arable_20": [
      -1.0156052906620536,
      -0.023098057792515395
    ],
    "ghg_arable_30": [
      -0.9585901178505785,
      -0.023799147323543345
    ],
    "ghg_arable_40": [
      -0.9526795689624104,
      -0.024462340123164377
    ],
    "ghg_arable_50": [
      -0.9526795689624104,
      -0.02529606821411653
    ],
    "ghg_grass_20": [
      -0.7330569438134181,
      -0.1512098981714661
    ],
    "ghg_grass_30": [
      -0.7199000454338936,
      -0.1310449286470309
    ],
    "ghg_grass_40": [
      -0.7057019536574285,
      -0.11967590058031315
    ],
    "ghg_grass_50": [
      -0.6972209601696199,
      -0.11759553268367459
    ],
    "ghg_livestock_20": [
      -2.265239285173406,
      -0.3140990547100259
    ],
    "ghg_livestock_30": [
      -2.048216719672876,
      -0.2648089346326508
    ],
    "ghg_livestock_40": [
      -1.8373655913978495,
      -0.23789189386473958
    ],
    "ghg_livestock_50": [
      -1.790900768949103,
      -0.2318697762692069
    ],
    "ghg_farm_20": [
      -3.1760374072391335,
      -0.7587503193547209
    ],
    "ghg_farm_30": [
      -2.9621573527184615,
      -0.7200445271725245
    ],
    "ghg_farm_40": [
      -2.7557170982886565,
      -0.6971057337859046
    ],
    "ghg_farm_50": [
      -2.5966795396032105,
      -0.6897149531004781
    ],
    "ghg_arable_ann": [
      -8.10891267524417,
      -0.20041212695405022
    ],
    "ghg_grass_ann": [
      -5.965224140542178,
      -1.0971020840176648
    ],
    "ghg_livestock_ann": [
      -16.558893684688776,
      -2.220774480820468
    ],
    "ghg_farm_ann": [
      -24.18887248220506,
      -6.000109493047192
    ],
    "ghg_arable_flow_20": [
      -6.447399718888528,
      -0.14693510184746567
    ],
    "ghg_arable_flow_30": [
      -7.648862940137673,
      -0.19011369019422075
    ],
    "ghg_arable_flow_40": [
      -9.546509532562078,
      -0.24521080056845096
    ],
    "ghg_arable_flow_50": [
      -11.983962230151008,
      -0.31848413074372334
    ],
    "ghg_grass_flow_20": [
      -4.660362713917916,
      -0.959524070221541
    ],
    "ghg_grass_flow_30": [
      -5.743601393306073,
      -1.0428847768166722
    ],
    "ghg_grass_flow_40": [
      -7.070479327578373,
      -1.19858388992299
    ],
    "ghg_grass_flow_50": [
      -8.767946388005452,
      -1.4790685791452243
    ],
    "ghg_livestock_flow_20": [
      -14.380773890655762,
      -1.991277053907077
    ],
    "ghg_livestock_flow_30": [
      -16.314553990610328,
      -2.106609730282127
    ],
    "ghg_livestock_flow_40": [
      -18.378880811752232,
      -2.3820029928099564
    ],
    "ghg_livestock_flow_50": [
      -22.52111863786159,
      -2.9157815978685355
    ],
    "ghg_farm_flow_20": [
      -20.1724784189005,
      -4.8197744443227855
    ],
    "ghg_farm_flow_30": [
      -23.610972285324852,
      -5.7420526296580165
    ],
    "ghg_farm_flow_40": [
      -27.581799939421476,
      -6.983466549874083
    ],
    "ghg_farm_flow_50": [
      -32.63018703619567,
      -8.674878645206029
    ],
    "nfwood_ha": [
      0.03340809227389235,
      0.32762144603817656
    ],
    "fwood_ha": [
      0.009483705602343464,
      0.05254668517030653
    ],
    "broad_ha": [
      0.02083943610399121,
      0.26146939669331
    ],
    "conif_ha": [
      0.006306988142862292,
      0.20027404820584066
    ],
    "wood_mgmt_ha": [
      0,
      0.1724333004854192
    ],
    "wood_nmgmt_ha": [
      0.04289179787623581,
      0.19863863644658564
    ],
    "broad_mgmt_ha": [
      0,
      0.11115369174057448
    ],
    "conif_mgmt_ha": [
      0,
      0.1413061061365864
    ],
    "broad_nmgmt_ha": [
      0.01791780456937321,
      0.1627163830253451
    ],
    "conif_nmgmt_ha": [
      0.006306988142862292,
      0.13434391283751776
    ],
    "broad_yc_20": [
      0.000012855177851385574,
      0.00021623959346956428
    ],
    "broad_yc_30": [
      0.000012855177851385574,
      0.00021623959346956428
    ],
    "broad_yc_40": [
      0.000012855177851385574,
      0.00021623959346956428
    ],
    "broad_yc_50": [
      0.000012855177851385574,
      0.00021623959346956428
    ],
    "conif_yc_20": [
      0.00004869378910719938,
      0.00032182341359987884
    ],
    "conif_yc_30": [
      0.000042607065468799456,
      0.00030289262456459186
    ],
    "conif_yc_40": [
      0.000042607065468799456,
      0.00030289262456459186
    ],
    "conif_yc_50": [
      0.000042607065468799456,
      0.00030289262456459186
    ],
    "broad_rp": [
      0.0006427588925692787,
      0.005405989836739107
    ],
    "conif_rp": [
      0.0002485334384601211,
      0.0025227952571449165
    ],
    "timber_broad_yr": [
      0,
      0.885141793496113
    ],
    "timber_conif_yr": [
      0,
      2.044199788754508
    ],
    "timber_mixed_yr": [
      0,
      1.05850578488266
    ],
    "timber_current_yr": [
      0,
      1.9756782217316422
    ],
    "timber_broad_50": [
      0,
      7.55257491149312
    ],
    "timber_conif_40": [
      0,
      14.152629625752919
    ],
    "timber_conif_50": [
      0,
      14.473456337840538
    ],
    "timber_mixed_40": [
      0,
      5.661055656526249
    ],
    "timber_mixed_50": [
      0,
      8.132815066243294
    ],
    "timber_current_40": [
      0,
      13.602258994585645
    ],
    "timber_current_50": [
      0,
      14.000970587395686
    ],
    "timber_broad_ann": [
      -38.44768057228366,
      0
    ],
    "timber_conif_ann": [
      -14.831088725865907,
      0
    ],
    "timber_mixed_ann": [
      -29.00104018394832,
      0
    ],
    "timber_current_ann": [
      -30.10374466221395,
      0
    ],
    "timber_broad_flow_20": [
      -111.66298040074456,
      0
    ],
    "timber_broad_flow_30": [
      -5.173053761086171,
      0
    ],
    "timber_broad_flow_40": [
      -3.1038359064199423,
      0
    ],
    "timber_broad_flow_50": [
      -2.2096088152172877,
      0
    ],
    "timber_conif_flow_20": [
      -48.9999817511588,
      0
    ],
    "timber_conif_flow_30": [
      -5.173053761086171,
      0
    ],
    "timber_conif_flow_40": [
      -3.1038359064199423,
      1.5725609233902047
    ],
    "timber_conif_flow_50": [
      -0.48884995802766523,
      21.02280880379861
    ],
    "timber_mixed_flow_20": [
      -86.59777729114201,
      0
    ],
    "timber_mixed_flow_30": [
      -5.173053761086171,
      0
    ],
    "timber_mixed_flow_40": [
      -3.1038359064199423,
      0
    ],
    "timber_mixed_flow_50": [
      -1.4968064527902478,
      7.083356329276532
    ],
    "timber_current_flow_20": [
      -89.39408372568342,
      0
    ],
    "timber_current_flow_30": [
      -5.173053761086171,
      0
    ],
    "timber_current_flow_40": [
      -3.1038359064199423,
      1.41586815236319
    ],
    "timber_current_flow_50": [
      -1.6454432643527137,
      20.175210056046666
    ],
    "ghg_broad_yr": [
      0,
      0.2476002773823862
    ],
    "ghg_conif_yr": [
      0,
      0.15393325784320255
    ],
    "ghg_mixed_yr": [
      0,
      0.19051790211321581
    ],
    "ghg_current_yr": [
      0,
      0.19604730099638673
    ],
    "ghg_broad_30": [
      0,
      0.013540640169349246
    ],
    "ghg_broad_40": [
      0,
      0.027464506003868756
    ],
    "ghg_broad_50": [
      0,
      0.02012847184203803
    ],
    "ghg_conif_20": [
      0,
      0.0014844277816368672
    ],
    "ghg_conif_30": [
      0,
      0.012436840452560162
    ],
    "ghg_conif_40": [
      0,
      0.024483542834305507
    ],
    "ghg_conif_50": [
      0,
      0.026881464635411214
    ],
    "ghg_mixed_30": [
      0,
      0.009580641629256542
    ],
    "ghg_mixed_40": [
      0,
      0.023376765575385962
    ],
    "ghg_mixed_50": [
      0,
      0.019143034417314502
    ],
    "ghg_current_30": [
      0,
      0.012037186819042544
    ],
    "ghg_current_40": [
      0,
      0.02388406238402908
    ],
    "ghg_current_50": [
      0,
      0.026262953059729185
    ],
    "ghg_broad_ann": [
      0,
      4.621592028906164
    ],
    "ghg_conif_ann": [
      0,
      1.9487206325946085
    ],
    "ghg_mixed_ann": [
      0,
      3.3220008029490127
    ],
    "ghg_current_ann": [
      0,
      3.4608197379466406
    ],
    "ghg_broad_flow_20": [
      0,
      0.3516004233731158
    ],
    "ghg_broad_flow_30": [
      0,
      3.5661520493448666
    ],
    "ghg_broad_flow_40": [
      0,
      7.09381729260192
    ],
    "ghg_broad_flow_50": [
      0,
      8.009471148582065
    ],
    "ghg_conif_flow_20": [
      0,
      0.3490974488776394
    ],
    "ghg_conif_flow_30": [
      0,
      3.3205888230200493
    ],
    "ghg_conif_flow_40": [
      0,
      6.112255093204936
    ],
    "ghg_conif_flow_50": [
      0,
      8.215984242228163
    ],
    "ghg_mixed_flow_20": [
      0,
      0.2536953903427132
    ],
    "ghg_mixed_flow_30": [
      0,
      2.572593890287967
    ],
    "ghg_mixed_flow_40": [
      0,
      6.084619876637833
    ],
    "ghg_mixed_flow_50": [
      0,
      7.128891565385598
    ],
    "ghg_current_flow_20": [
      0,
      0.33765974250887326
    ],
    "ghg_current_flow_30": [
      0,
      3.2132913379832715
    ],
    "ghg_current_flow_40": [
      0,
      6.174805649841235
    ],
    "ghg_current_flow_50": [
      0,
      8.022466243541311
    ],
    "fert_nitr_20": [
      1.0393411292845236,
      39.70061628284139
    ],
    "fert_nitr_30": [
      1.1149981359992116,
      37.17973114210545
    ],
    "fert_nitr_40": [
      1.1463192799621034,
      36.91343208274768
    ],
    "fert_nitr_50": [
      1.1833301752723828,
      36.91343208274768
    ],
    "fert_phos_20": [
      0.6573377546186642,
      25.265398061051645
    ],
    "fert_phos_30": [
      0.6621601136901942,
      23.407611633690127
    ],
    "fert_phos_40": [
      0.6649455234486026,
      23.207085450679354
    ],
    "fert_phos_50": [
      0.6726954050213169,
      23.207085450679354
    ],
    "pest_20": [
      0.05609142602487906,
      2.0737377013731213
    ],
    "pest_30": [
      0.05951518839263141,
      1.9392727141672974
    ],
    "pest_40": [
      0.06182378019895784,
      1.925036940930551
    ],
    "pest_50": [
      0.06283751776409284,
      1.925036940930551
    ],
    "tot_fert_pest_20": [
      1.7606151631107816,
      67.03975204526616
    ],
    "tot_fert_pest_30": [
      1.8429275225011843,
      62.52661548996288
    ],
    "tot_fert_pest_40": [
      1.8730885836096636,
      62.04555447435759
    ],
    "tot_fert_pest_50": [
      1.9188630980577925,
      62.04555447435759
    ],
    "prk_area": [
      308.01590186278963,
      14145.720263513267
    ],
    "pth_len": [
      5.691844616083598,
      19.89264206722873
    ],
    "prk_vis_20": [
      1.1875517408721965,
      93.94698711631811
    ],
    "prk_viscar_20": [
      0.8960234463464997,
      78.62887565898374
    ],
    "prk_viswlk_20": [
      0.2915282945256968,
      35.12621430136586
    ],
    "prk_visab_20": [
      0.3183526657848912,
      30.724223511807
    ],
    "prk_visc1_20": [
      0.363275637304812,
      30.517318150297456
    ],
    "prk_visc2_20": [
      0.28373504867210325,
      18.584236650972663
    ],
    "prk_visde_20": [
      0.22218838911039004,
      16.220055361589072
    ],
    "prk_val_20": [
      4.865468974507808,
      384.4714953100478
    ],
    "prk_valab_20": [
      1.304488490926911,
      125.80648928793022
    ],
    "prk_valc1_20": [
      1.4885194735990712,
      124.87247709770429
    ],
    "prk_valc2_20": [
      1.1626209665908593,
      76.0335231212818
    ],
    "prk_valde_20": [
      0.9098400433909659,
      66.44536172817182
    ],
    "pth_vis_20": [
      4.315140845070423,
      112.71392107496071
    ],
    "pth_viscar_20": [
      1.7348553687717705,
      97.04195240016135
    ],
    "pth_viswlk_20": [
      1.3351190872672256,
      25.105342926009786
    ],
    "pth_visab_20": [
      0.994263970922308,
      33.668192124188
    ],
    "pth_visc1_20": [
      1.2191806754505528,
      34.72945848576317
    ],
    "pth_visc2_20": [
      1.2545812509465395,
      23.07864684035554
    ],
    "pth_visde_20": [
      0.8471149477510223,
      21.237616669680488
    ],
    "pth_val_20": [
      17.655535362713916,
      460.69590769359166
    ],
    "pth_valab_20": [
      4.069381341814327,
      137.6292025427383
    ],
    "pth_valc1_20": [
      4.98843328789944,
      141.946182415045
    ],
    "pth_valc2_20": [
      5.132458730879903,
      94.32671683520886
    ],
    "pth_valde_20": [
      3.4652809329092835,
      86.79379894562602
    ],
    "prk_vis_30": [
      1.187570771997602,
      93.94645789992336
    ],
    "prk_viscar_30": [
      0.8960710241600137,
      78.62945987675786
    ],
    "prk_viswlk_30": [
      0.29149974783758836,
      35.12821683344289
    ],
    "prk_visab_30": [
      0.31837169691029676,
      30.723876783824227
    ],
    "prk_visc1_30": [
      0.363275637304812,
      30.517172159567867
    ],
    "prk_visc2_30": [
      0.28373504867210325,
      18.584181904449068
    ],
    "prk_visde_30": [
      0.22218838911039004,
      16.22022923592661
    ],
    "prk_val_30": [
      4.865535583446727,
      384.4692507025804
    ],
    "prk_valab_30": [
      1.3045550998658306,
      125.80504762947552
    ],
    "prk_valc1_30": [
      1.4885194735990712,
      124.87189313478594
    ],
    "prk_valc2_30": [
      1.1626304821535622,
      76.03332238402861
    ],
    "prk_valde_30": [
      0.9098305278282631,
      66.4461615501245
    ],
    "pth_vis_30": [
      4.313607451158564,
      112.72072303904523
    ],
    "pth_viscar_30": [
      1.7346660608814175,
      97.04385110792728
    ],
    "pth_viswlk_30": [
      1.3350619938910087,
      25.105312492391594
    ],
    "pth_visab_30": [
      0.9938285627744965,
      33.67117580782017
    ],
    "pth_visc1_30": [
      1.2187641980917765,
      34.731496292999125
    ],
    "pth_visc2_30": [
      1.2541458427987278,
      23.079697041354272
    ],
    "pth_visde_30": [
      0.8468877782825989,
      21.238353896871654
    ],
    "pth_val_30": [
      17.649269271543236,
      460.7238319122004
    ],
    "pth_valab_30": [
      4.06760184764501,
      137.64145025107453
    ],
    "pth_valc1_30": [
      4.986691655308193,
      141.95453533822035
    ],
    "pth_valc2_30": [
      5.130679236710586,
      94.33102891877982
    ],
    "pth_valde_30": [
      3.4642965318794485,
      86.79681740412569
    ],
    "prk_vis_40": [
      1.1876754431873329,
      93.94417679477353
    ],
    "prk_viscar_40": [
      0.8962518198513669,
      78.62698390619131
    ],
    "prk_viswlk_40": [
      0.291423623335966,
      35.127352518686244
    ],
    "prk_visab_40": [
      0.3184192747238108,
      30.722982590605497
    ],
    "prk_visc1_40": [
      0.3633041839929204,
      30.516423957078725
    ],
    "prk_visc2_40": [
      0.28374456423480604,
      18.583816927625097
    ],
    "prk_visde_40": [
      0.22219790467309283,
      16.219978856880555
    ],
    "prk_val_40": [
      4.865963783768353,
      384.4598890470455
    ],
    "prk_valab_40": [
      1.3047834733706978,
      125.80139786123581
    ],
    "prk_valc1_40": [
      1.4886431759142076,
      124.86879083178218
    ],
    "prk_valc2_40": [
      1.1626685444043734,
      76.03178948136794
    ],
    "prk_valde_40": [
      0.9098685900790743,
      66.44509048420525
    ],
    "pth_vis_40": [
      4.298992882023323,
      112.71536770944903
    ],
    "pth_viscar_40": [
      1.733568075117371,
      97.04070745990458
    ],
    "pth_viswlk_40": [
      1.3347574958845192,
      25.103060404645387
    ],
    "pth_visab_40": [
      0.9897395123428745,
      33.66874156709463
    ],
    "pth_visc1_40": [
      1.2148644555505073,
      34.730153983113325
    ],
    "pth_visc2_40": [
      1.2498485536877177,
      23.07856338067352
    ],
    "pth_visde_40": [
      0.8445403604422232,
      21.237908778567554
    ],
    "pth_val_40": [
      17.58925867030138,
      460.7019515655645
    ],
    "pth_valab_40": [
      4.050848099348781,
      137.63151159394081
    ],
    "pth_valc1_40": [
      4.970657276995305,
      141.94905481910115
    ],
    "pth_valc2_40": [
      5.113073602907769,
      94.32639690642779
    ],
    "pth_valde_40": [
      3.454679691049523,
      86.79498824609479
    ],
    "prk_vis_50": [
      1.187713505438144,
      93.93996131245666
    ],
    "prk_viscar_50": [
      0.8962993976648809,
      78.61855447830743
    ],
    "prk_viswlk_50": [
      0.29141410777326315,
      35.124522192194384
    ],
    "prk_visab_50": [
      0.3184383058492164,
      30.72112120880324
    ],
    "prk_visc1_50": [
      0.3633136995556232,
      30.515146538194823
    ],
    "prk_visc2_50": [
      0.28375407979750883,
      18.58314172050075
    ],
    "prk_visde_50": [
      0.22219790467309283,
      16.218900835987814
    ],
    "prk_val_50": [
      4.8661065172088955,
      384.44253439906566
    ],
    "prk_valab_50": [
      1.30485959787232,
      125.79367860140881
    ],
    "prk_valc1_50": [
      1.488681238165019,
      124.8635534143582
    ],
    "prk_valc2_50": [
      1.1626970910924816,
      76.02901565750575
    ],
    "prk_valde_50": [
      0.9098685900790743,
      66.44071580587278
    ],
    "pth_vis_50": [
      4.293824776616689,
      112.69521219624153
    ],
    "pth_viscar_50": [
      1.7332083901257005,
      97.0304836488573
    ],
    "pth_viswlk_50": [
      1.3345100912542462,
      25.100936138095587
    ],
    "pth_visab_50": [
      0.9883007723761926,
      33.6601173999527
    ],
    "pth_visc1_50": [
      1.213463577161896,
      34.72453436452407
    ],
    "pth_visc2_50": [
      1.2483340905648947,
      23.074856379797193
    ],
    "pth_visde_50": [
      0.8437074057246706,
      21.235704051967563
    ],
    "pth_val_50": [
      17.568112978948964,
      460.61943080496866
    ],
    "pth_valab_50": [
      4.044960623958807,
      137.59619423849995
    ],
    "pth_valc1_50": [
      4.964978040284719,
      141.92606167670502
    ],
    "pth_valc2_50": [
      5.10688323489323,
      94.3112281092209
    ],
    "pth_valde_50": [
      3.4512910798122065,
      86.78595373551627
    ],
    "rec_vis_20": [
      7.588775442235777,
      198.81462909126316
    ],
    "rec_vis_30": [
      7.5889847846152385,
      198.82317675369657
    ],
    "rec_vis_40": [
      7.589793607444976,
      198.81405182846254
    ],
    "rec_vis_50": [
      7.589822154133085,
      198.78390201833332
    ],
    "rec_val_20": [
      31.04635030592534,
      814.4638619576859
    ],
    "rec_val_30": [
      31.047216222131297,
      814.500055639788
    ],
    "rec_val_40": [
      31.05048957570106,
      814.4620675745225
    ],
    "rec_val_50": [
      31.05060376245349,
      814.3390827780946
    ],
    "prk_val_ann": [
      4.865668801324566,
      384.46457899923354
    ],
    "prk_valab_ann": [
      1.3046217088047503,
      125.80331398956166
    ],
    "prk_valc1_ann": [
      1.4885670514125853,
      124.87036023212526
    ],
    "prk_valc2_ann": [
      1.162639997716265,
      76.03250118617468
    ],
    "prk_valde_ann": [
      0.9098495589536687,
      66.44488878997372
    ],
    "pth_val_ann": [
      17.628710434650916,
      460.6941898151368
    ],
    "pth_valab_ann": [
      4.061865818567318,
      137.62845836057366
    ],
    "pth_valc1_ann": [
      4.981220657276995,
      141.94625891975352
    ],
    "pth_valc2_ann": [
      5.124621384219294,
      94.32569445410412
    ],
    "pth_valde_ann": [
      3.4609836437982735,
      86.79377808070551
    ],
    "rec_val_ann": [
      31.047986982710224,
      814.4561906219137
    ],
    "sr_bird_20": [
      0.00007284600782451826,
      0.00043247918693912856
    ],
    "sr_herp_20": [
      0.000004285059283795192,
      0.00003603993224492738
    ],
    "sr_invert_20": [
      0.00005034785792749909,
      0.000576638915918838
    ],
    "sr_lichen_20": [
      0,
      0.00003786157807057398
    ],
    "sr_mammal_20": [
      0.00005034785792749909,
      0.00039643925469420117
    ],
    "sr_plant_20": [
      0.00011141154137867497,
      0.0006847587126536202
    ],
    "sr_100_20": [
      0.0002975100695715855,
      0.0021263560024507152
    ],
    "sr_bird_30": [
      0.00006856094854072307,
      0.00043247918693912856
    ],
    "sr_herp_30": [
      0.000004285059283795192,
      0.00003603993224492738
    ],
    "sr_invert_30": [
      0.000054924935920908094,
      0.0005405989836739107
    ],
    "sr_lichen_30": [
      0,
      0.00003786157807057398
    ],
    "sr_mammal_30": [
      0.000051420711405542296,
      0.00039643925469420117
    ],
    "sr_plant_30": [
      0.00008696448187477114,
      0.0006847587126536202
    ],
    "sr_100_30": [
      0.0002883559135847675,
      0.0021263560024507152
    ],
    "sr_bird_40": [
      0.00006427588925692786,
      0.00043247918693912856
    ],
    "sr_herp_40": [
      0.000004285059283795192,
      0.00003603993224492738
    ],
    "sr_invert_40": [
      0.000054924935920908094,
      0.0005045590514289833
    ],
    "sr_lichen_40": [
      0,
      0.00003786157807057398
    ],
    "sr_mammal_40": [
      0.000051420711405542296,
      0.00039643925469420117
    ],
    "sr_plant_40": [
      0.00010984987184181619,
      0.0007928785093884023
    ],
    "sr_100_40": [
      0.0003066642255584035,
      0.00219843586694057
    ],
    "sr_bird_50": [
      0.00006856094854072307,
      0.00043247918693912856
    ],
    "sr_herp_50": [
      0.000004285059283795192,
      0.00003603993224492738
    ],
    "sr_invert_50": [
      0.00006865616990113511,
      0.000576638915918838
    ],
    "sr_lichen_50": [
      0,
      0.00003786157807057398
    ],
    "sr_mammal_50": [
      0.000051420711405542296,
      0.00039643925469420117
    ],
    "sr_plant_50": [
      0.00012426671923006054,
      0.0008289184416333297
    ],
    "sr_100_50": [
      0.00032954961552544853,
      0.002306555663675352
    ]
  },
  "lad": {
    "tot_area": [
      1,
      1
    ],
    "wood_ha": [
      0,
      0.3943800894598004
    ],
    "sngrass_ha": [
      0,
      0.285663259698868
    ],
    "urban_ha": [
      0.03908627389840687,
      0.9919246298788694
    ],
    "water_ha": [
      0,
      0.23718546132339235
    ],
    "farm_ha": [
      0,
      0.8569653756819532
    ],
    "arable_ha_20": [
      0,
      0.7118511316372279
    ],
    "arable_ha_30": [
      0,
      0.6945254685896397
    ],
    "arable_ha_40": [
      0,
      0.692823961540539
    ],
    "arable_ha_50": [
      0,
      0.692823961540539
    ],
    "grass_ha_20": [
      0,
      0.6944162134349366
    ],
    "grass_ha_30": [
      0,
      0.6930979788487135
    ],
    "grass_ha_40": [
      0,
      0.6917325394381139
    ],
    "grass_ha_50": [
      0,
      0.693819936351504
    ],
    "wheat_ha_20": [
      0,
      0.4246880570409982
    ],
    "wheat_ha_30": [
      0,
      0.4206098417328364
    ],
    "wheat_ha_40": [
      0,
      0.4260808779251187
    ],
    "wheat_ha_50": [
      0,
      0.4287843886991565
    ],
    "osr_ha_20": [
      0,
      0.13902808138557254
    ],
    "osr_ha_30": [
      0,
      0.14269379519085254
    ],
    "osr_ha_40": [
      0,
      0.14228108655306226
    ],
    "osr_ha_50": [
      0,
      0.1401720938079973
    ],
    "wbar_ha_20": [
      0,
      0.09257102344659948
    ],
    "wbar_ha_30": [
      0,
      0.09304522037779049
    ],
    "wbar_ha_40": [
      0,
      0.09602175157412708
    ],
    "wbar_ha_50": [
      0,
      0.09605037206639955
    ],
    "sbar_ha_20": [
      0,
      0.13803663423010876
    ],
    "sbar_ha_30": [
      0,
      0.1518317115054379
    ],
    "sbar_ha_40": [
      0,
      0.15663995420721236
    ],
    "sbar_ha_50": [
      0,
      0.1566971951917573
    ],
    "pot_ha_20": [
      0,
      0.06688543185869389
    ],
    "pot_ha_30": [
      0,
      0.06919945725915876
    ],
    "pot_ha_40": [
      0,
      0.07339062264435399
    ],
    "pot_ha_50": [
      0,
      0.07250113071008593
    ],
    "sb_ha_20": [
      0,
      0.11431009195013257
    ],
    "sb_ha_30": [
      0,
      0.11116517177187342
    ],
    "sb_ha_40": [
      0,
      0.11043182715631522
    ],
    "sb_ha_50": [
      0,
      0.11046003271845208
    ],
    "other_ha_20": [
      0,
      0.12170662929035057
    ],
    "other_ha_30": [
      0,
      0.12761342210208407
    ],
    "other_ha_40": [
      0,
      0.12264185636009267
    ],
    "other_ha_50": [
      0,
      0.1222373404920384
    ],
    "pgrass_ha_20": [
      0,
      0.4935172624945251
    ],
    "pgrass_ha_30": [
      0,
      0.495273491152945
    ],
    "pgrass_ha_40": [
      0,
      0.494499559879743
    ],
    "pgrass_ha_50": [
      0,
      0.49110191654299357
    ],
    "tgrass_ha_20": [
      0,
      0.11332427480287402
    ],
    "tgrass_ha_30": [
      0,
      0.11434335947954626
    ],
    "tgrass_ha_40": [
      0,
      0.1130772239721656
    ],
    "tgrass_ha_50": [
      0,
      0.10998908858831037
    ],
    "rgraz_ha_20": [
      0,
      0.3540124299410622
    ],
    "rgraz_ha_30": [
      0,
      0.34627985032680786
    ],
    "rgraz_ha_40": [
      0,
      0.33801329714625256
    ],
    "rgraz_ha_50": [
      0,
      0.3358074965293845
    ],
    "dairy_20": [
      0,
      0.34521048562794293
    ],
    "dairy_30": [
      0,
      0.32588375852132967
    ],
    "dairy_40": [
      0,
      0.3033241970623375
    ],
    "dairy_50": [
      0,
      0.28111603064164736
    ],
    "beef_20": [
      0,
      0.3747173224785165
    ],
    "beef_30": [
      0,
      0.3455326284091298
    ],
    "beef_40": [
      0,
      0.34173425041919037
    ],
    "beef_50": [
      0,
      0.3339321767101256
    ],
    "sheep_20": [
      0,
      3.988312805677297
    ],
    "sheep_30": [
      0,
      3.621549493206815
    ],
    "sheep_40": [
      0,
      3.3317428653583496
    ],
    "sheep_50": [
      0,
      3.0636636474732226
    ],
    "livestock_20": [
      0,
      4.305610892649886
    ],
    "livestock_30": [
      0,
      3.9230554956509236
    ],
    "livestock_40": [
      0,
      3.6313169434260657
    ],
    "livestock_50": [
      0,
      3.3604072316871543
    ],
    "wheat_food_20": [
      0,
      3.4781774968940744
    ],
    "wheat_food_30": [
      0,
      3.4447820450494246
    ],
    "wheat_food_40": [
      0,
      3.4896007478870925
    ],
    "wheat_food_50": [
      0,
      3.511734163196038
    ],
    "osr_food_20": [
      0,
      0.4907348242811502
    ],
    "osr_food_30": [
      0,
      0.5036825290062217
    ],
    "osr_food_40": [
      0,
      0.5022439682807491
    ],
    "osr_food_50": [
      0,
      0.49480344187615993
    ],
    "wbar_food_20": [
      0,
      0.6239428773990986
    ],
    "wbar_food_30": [
      0,
      0.6271608471665713
    ],
    "wbar_food_40": [
      0,
      0.6470807097882083
    ],
    "wbar_food_50": [
      0,
      0.6473382942186605
    ],
    "sbar_food_20": [
      0,
      0.7688036634230109
    ],
    "sbar_food_30": [
      0,
      0.8456210646823126
    ],
    "sbar_food_40": [
      0,
      0.8724957069261591
    ],
    "sbar_food_50": [
      0,
      0.8728391528334287
    ],
    "pot_food_20": [
      0,
      2.481729055258467
    ],
    "pot_food_30": [
      0,
      2.5675410824664557
    ],
    "pot_food_40": [
      0,
      2.7230514096185736
    ],
    "pot_food_50": [
      0,
      2.6899743705713854
    ],
    "sb_food_20": [
      0,
      6.938589439837536
    ],
    "sb_food_30": [
      0,
      6.747553167484628
    ],
    "sb_food_40": [
      0,
      6.7031364585096185
    ],
    "sb_food_50": [
      0,
      6.70518136176454
    ],
    "food_20": [
      0,
      12.634662129314536
    ],
    "food_30": [
      0,
      11.96301247771836
    ],
    "food_40": [
      0,
      11.877437476367957
    ],
    "food_50": [
      0,
      11.877437476367957
    ],
    "arable_profit_ann": [
      0,
      430.38236644520066
    ],
    "livestock_profit_ann": [
      0,
      238.87764424766323
    ],
    "farm_profit_ann": [
      0,
      449.9221493004915
    ],
    "arable_profit_flow_20": [
      0,
      441.75186355533947
    ],
    "arable_profit_flow_30": [
      0,
      423.7994922486901
    ],
    "arable_profit_flow_40": [
      0,
      421.60531788472963
    ],
    "arable_profit_flow_50": [
      0,
      421.60531788472963
    ],
    "livestock_profit_flow_20": [
      0,
      255.46320893948976
    ],
    "livestock_profit_flow_30": [
      0,
      240.5646918265514
    ],
    "livestock_profit_flow_40": [
      0,
      223.6948485487385
    ],
    "livestock_profit_flow_50": [
      0,
      207.3220184131
    ],
    "farm_profit_flow_20": [
      0,
      461.69414735591204
    ],
    "farm_profit_flow_30": [
      0,
      443.42015070491004
    ],
    "farm_profit_flow_40": [
      0,
      440.6011991573489
    ],
    "farm_profit_flow_50": [
      0,
      440.595581483282
    ],
    "ghg_arable_20": [
      -1.625479392859072,
      0
    ],
    "ghg_arable_30": [
      -1.6130164731298946,
      0
    ],
    "ghg_arable_40": [
      -1.6151353372525394,
      0
    ],
    "ghg_arable_50": [
      -1.5884108464322368,
      0
    ],
    "ghg_grass_20": [
      -0.8643748634301213,
      0
    ],
    "ghg_grass_30": [
      -0.8545096980680985,
      0
    ],
    "ghg_grass_40": [
      -0.8478515148009614,
      0
    ],
    "ghg_grass_50": [
      -0.8468939189449736,
      0
    ],
    "ghg_livestock_20": [
      -2.889732236980814,
      0
    ],
    "ghg_livestock_30": [
      -2.7972487424289088,
      0
    ],
    "ghg_livestock_40": [
      -2.69611265099408,
      0
    ],
    "ghg_livestock_50": [
      -2.5541696608835505,
      0
    ],
    "ghg_farm_20": [
      -3.8846222924674016,
      0
    ],
    "ghg_farm_30": [
      -3.7083228564244406,
      0
    ],
    "ghg_farm_40": [
      -3.5733668685624336,
      0
    ],
    "ghg_farm_50": [
      -3.433151969339219,
      0
    ],
    "ghg_arable_ann": [
      -13.334629719656458,
      0
    ],
    "ghg_grass_ann": [
      -7.119211043843751,
      0
    ],
    "ghg_livestock_ann": [
      -22.88254114909489,
      0
    ],
    "ghg_farm_ann": [
      -30.433420740687524,
      0
    ],
    "ghg_arable_flow_20": [
      -10.329336142170368,
      0
    ],
    "ghg_arable_flow_30": [
      -12.884251854006108,
      0
    ],
    "ghg_arable_flow_40": [
      -16.177278298261285,
      0
    ],
    "ghg_arable_flow_50": [
      -19.980743261491924,
      0
    ],
    "ghg_grass_flow_20": [
      -5.4955269347935065,
      0
    ],
    "ghg_grass_flow_30": [
      -6.8191172123035,
      0
    ],
    "ghg_grass_flow_40": [
      -8.496169616576049,
      0
    ],
    "ghg_grass_flow_50": [
      -10.652373423822928,
      0
    ],
    "ghg_livestock_flow_20": [
      -18.35638484784595,
      0
    ],
    "ghg_livestock_flow_30": [
      -22.318858433425728,
      0
    ],
    "ghg_livestock_flow_40": [
      -26.99168463196797,
      0
    ],
    "ghg_livestock_flow_50": [
      -32.09405262977791,
      0
    ],
    "ghg_farm_flow_20": [
      -24.68396853335249,
      0
    ],
    "ghg_farm_flow_30": [
      -29.570961600632206,
      0
    ],
    "ghg_farm_flow_40": [
      -35.78284228176437,
      0
    ],
    "ghg_farm_flow_50": [
      -43.151370495842315,
      0
    ],
    "nfwood_ha": [
      0,
      0.3607065030393394
    ],
    "fwood_ha": [
      0,
      0.08455983179449675
    ],
    "broad_ha": [
      0,
      0.28063618981401006
    ],
    "conif_ha": [
      0,
      0.24778070879688038
    ],
    "wood_mgmt_ha": [
      0,
      0.2025862068965517
    ],
    "wood_nmgmt_ha": [
      0,
      0.3943800894598004
    ],
    "broad_mgmt_ha": [
      0,
      0.09203853955375253
    ],
    "conif_mgmt_ha": [
      0,
      0.1105476673427992
    ],
    "broad_nmgmt_ha": [
      0,
      0.2536068138362593
    ],
    "conif_nmgmt_ha": [
      0,
      0.24778070879688038
    ],
    "broad_yc_20": [
      0.000006012096337831717,
      0.006896551724137931
    ],
    "broad_yc_30": [
      0.000006012096337831717,
      0.006896551724137931
    ],
    "broad_yc_40": [
      0.000006012096337831717,
      0.006896551724137931
    ],
    "broad_yc_50": [
      0.000007699073993875387,
      0.006896551724137931
    ],
    "conif_yc_20": [
      0.000028056449576548014,
      0.020689655172413793
    ],
    "conif_yc_30": [
      0.000028056449576548014,
      0.020689655172413793
    ],
    "conif_yc_40": [
      0.000026052417463937443,
      0.020689655172413793
    ],
    "conif_yc_50": [
      0.000026052417463937443,
      0.020689655172413793
    ],
    "broad_rp": [
      0.000288715274770327,
      0.5172413793103449
    ],
    "conif_rp": [
      0.00011163657291119311,
      0.2413793103448276
    ],
    "timber_broad_yr": [
      0,
      0.8758874239350912
    ],
    "timber_conif_yr": [
      0,
      1.7711713995943206
    ],
    "timber_mixed_yr": [
      0,
      1.234026369168357
    ],
    "timber_current_yr": [
      0,
      1.3677738336713996
    ],
    "timber_broad_50": [
      0,
      6.945867139959432
    ],
    "timber_conif_40": [
      0,
      11.943873228589032
    ],
    "timber_conif_50": [
      0,
      12.242139959432048
    ],
    "timber_mixed_40": [
      0,
      5.730418207024029
    ],
    "timber_mixed_50": [
      0,
      9.064401622718053
    ],
    "timber_current_40": [
      0,
      9.02843988577423
    ],
    "timber_current_50": [
      0,
      9.789680527383368
    ],
    "timber_broad_ann": [
      -46.03803245436105,
      0
    ],
    "timber_conif_ann": [
      -14.956896551724139,
      0.21439894591645564
    ],
    "timber_mixed_ann": [
      -33.605603448275865,
      0
    ],
    "timber_current_ann": [
      -29.02903144016227,
      0
    ],
    "timber_broad_flow_20": [
      -129.96412271805275,
      0
    ],
    "timber_broad_flow_30": [
      -6.077332657200811,
      0
    ],
    "timber_broad_flow_40": [
      -3.646424949290061,
      0
    ],
    "timber_broad_flow_50": [
      -3.0386663286004056,
      0.006601824320919216
    ],
    "timber_conif_flow_20": [
      -56.34685598377282,
      0
    ],
    "timber_conif_flow_30": [
      -6.077332657200811,
      0
    ],
    "timber_conif_flow_40": [
      -2.936866125760649,
      1.1404996406161976
    ],
    "timber_conif_flow_50": [
      -1.783358042994811,
      13.971695933456562
    ],
    "timber_mixed_flow_20": [
      -100.51724137931035,
      0
    ],
    "timber_mixed_flow_30": [
      -6.077332657200811,
      0
    ],
    "timber_mixed_flow_40": [
      -3.362576064908722,
      0
    ],
    "timber_mixed_flow_50": [
      -1.783358042994811,
      4.731472308021058
    ],
    "timber_current_flow_20": [
      -89.78930020283975,
      0
    ],
    "timber_current_flow_30": [
      -6.077332657200811,
      0
    ],
    "timber_current_flow_40": [
      -3.231237322515213,
      1.0331410144336306
    ],
    "timber_current_flow_50": [
      -1.783358042994811,
      13.374341939118441
    ],
    "ghg_broad_yr": [
      0,
      0.25405679513184587
    ],
    "ghg_conif_yr": [
      0,
      0.138184584178499
    ],
    "ghg_mixed_yr": [
      0,
      0.2077839756592292
    ],
    "ghg_current_yr": [
      0,
      0.19003549695740365
    ],
    "ghg_broad_30": [
      0,
      0.010377828328375487
    ],
    "ghg_broad_40": [
      0,
      0.02535496957403651
    ],
    "ghg_broad_50": [
      0,
      0.02434077079107505
    ],
    "ghg_conif_20": [
      0,
      0.0011745224892174984
    ],
    "ghg_conif_30": [
      0,
      0.009396179913739987
    ],
    "ghg_conif_40": [
      0,
      0.02332657200811359
    ],
    "ghg_conif_50": [
      0,
      0.021551724137931036
    ],
    "ghg_mixed_30": [
      0,
      0.007567005545286507
    ],
    "ghg_mixed_40": [
      0,
      0.024467545638945234
    ],
    "ghg_mixed_50": [
      0,
      0.023199797160243407
    ],
    "ghg_current_30": [
      0,
      0.008009858287122612
    ],
    "ghg_current_40": [
      0,
      0.024087221095334687
    ],
    "ghg_current_50": [
      0,
      0.023073022312373227
    ],
    "ghg_broad_ann": [
      0,
      4.359153144016227
    ],
    "ghg_conif_ann": [
      0,
      1.7904411764705883
    ],
    "ghg_mixed_ann": [
      0,
      3.3316430020283976
    ],
    "ghg_current_ann": [
      0,
      2.933950304259635
    ],
    "ghg_broad_flow_20": [
      0,
      0.26940626976969567
    ],
    "ghg_broad_flow_30": [
      0,
      2.730512968920356
    ],
    "ghg_broad_flow_40": [
      0,
      6.660877281947261
    ],
    "ghg_broad_flow_50": [
      0,
      8.406059837728195
    ],
    "ghg_conif_flow_20": [
      0,
      0.2752233518176217
    ],
    "ghg_conif_flow_30": [
      0,
      2.613793900184843
    ],
    "ghg_conif_flow_40": [
      0,
      6.054132860040568
    ],
    "ghg_conif_flow_50": [
      0,
      7.4825050709939145
    ],
    "ghg_mixed_flow_20": [
      0,
      0.202306685150955
    ],
    "ghg_mixed_flow_30": [
      0,
      2.075939617991374
    ],
    "ghg_mixed_flow_40": [
      0,
      6.418103448275862
    ],
    "ghg_mixed_flow_50": [
      0,
      8.036637931034482
    ],
    "ghg_current_flow_20": [
      0,
      0.21751771410967344
    ],
    "ghg_current_flow_30": [
      0,
      2.2035197165742453
    ],
    "ghg_current_flow_40": [
      0,
      6.2910750507099396
    ],
    "ghg_current_flow_50": [
      0,
      7.88881845841785
    ],
    "fert_nitr_20": [
      0,
      78.53455679792579
    ],
    "fert_nitr_30": [
      0,
      76.70805650083724
    ],
    "fert_nitr_40": [
      0,
      76.53679846594285
    ],
    "fert_nitr_50": [
      0,
      76.53679846594285
    ],
    "fert_phos_20": [
      0,
      51.15720034570302
    ],
    "fert_phos_30": [
      0,
      49.44478204504942
    ],
    "fert_phos_40": [
      0,
      49.25733268514017
    ],
    "fert_phos_50": [
      0,
      49.25733268514017
    ],
    "pest_20": [
      0,
      4.409968670663858
    ],
    "pest_30": [
      0,
      4.296359315075892
    ],
    "pest_40": [
      0,
      4.284894398530763
    ],
    "pest_50": [
      0,
      4.284894398530763
    ],
    "tot_fert_pest_20": [
      0,
      134.10172581429265
    ],
    "tot_fert_pest_30": [
      0,
      130.44919786096256
    ],
    "tot_fert_pest_40": [
      0,
      130.0790255496138
    ],
    "tot_fert_pest_50": [
      0,
      130.0790255496138
    ],
    "prk_area": [
      28.75254229576322,
      27427.531693711968
    ],
    "pth_len": [
      0.12405929304446979,
      17.754854234150855
    ],
    "prk_vis_20": [
      2.513623368646156,
      5555.5518845974875
    ],
    "prk_viscar_20": [
      0.9526329776707209,
      1774.0479292694276
    ],
    "prk_viswlk_20": [
      1.4195754877947053,
      3781.5039553280594
    ],
    "prk_visab_20": [
      0.6930293165651114,
      2635.008841321545
    ],
    "prk_visc1_20": [
      0.797524646874971,
      1749.5276872964168
    ],
    "prk_visc2_20": [
      0.5268106984962349,
      462.9548627268497
    ],
    "prk_visde_20": [
      0.42918350787523984,
      708.0604932526757
    ],
    "prk_val_20": [
      10.285548536805466,
      23198.651465798044
    ],
    "prk_valab_20": [
      2.8561716887862514,
      11074.564448580735
    ],
    "prk_valc1_20": [
      3.2782940559991838,
      7288.069799906933
    ],
    "prk_valc2_20": [
      2.1549416466341595,
      1909.7691949744067
    ],
    "prk_valde_20": [
      1.7551812783899172,
      2926.2480223359703
    ],
    "pth_vis_20": [
      1.2187862235868208,
      475.5655172413793
    ],
    "pth_viscar_20": [
      0.4535687831136594,
      143.84827586206896
    ],
    "pth_viswlk_20": [
      0.7652174404731613,
      331.71724137931034
    ],
    "pth_visab_20": [
      0.30462022131374644,
      200.64827586206897
    ],
    "pth_visc1_20": [
      0.4157351020338926,
      153.64827586206897
    ],
    "pth_visc2_20": [
      0.29690194681458615,
      48.324137931034485
    ],
    "pth_visde_20": [
      0.20152895342459556,
      72.9448275862069
    ],
    "pth_val_20": [
      4.982409119438177,
      1943.7620689655173
    ],
    "pth_valab_20": [
      1.2454128570055356,
      820.1724137931035
    ],
    "pth_valc1_20": [
      1.6994961917524725,
      627.9896551724138
    ],
    "pth_valc2_20": [
      1.213685942562467,
      197.48620689655172
    ],
    "pth_valde_20": [
      0.8238141281177023,
      298.1137931034483
    ],
    "prk_vis_30": [
      2.5142603644526007,
      5555.543508608655
    ],
    "prk_viscar_30": [
      0.9526499409113783,
      1774.0437412750116
    ],
    "prk_viswlk_30": [
      1.4200608179329486,
      3781.4997673336434
    ],
    "prk_visab_30": [
      0.6930432282537121,
      2635.004653327129
    ],
    "prk_visc1_30": [
      0.7974921862682359,
      1749.5253606328524
    ],
    "prk_visc2_30": [
      0.526977530731256,
      462.9539320614239
    ],
    "prk_visde_30": [
      0.42925934070934035,
      708.0595625872498
    ],
    "prk_val_30": [
      10.288172352865343,
      23198.615169846442
    ],
    "prk_valab_30": [
      2.856222698311121,
      11074.545369939508
    ],
    "prk_valc1_30": [
      3.2781642135722433,
      7288.058631921824
    ],
    "prk_valc2_30": [
      2.155601392290834,
      1909.7659376454164
    ],
    "prk_valde_30": [
      1.7554921930097294,
      2926.245230339693
    ],
    "pth_vis_30": [
      1.2187975324139257,
      475.5655172413793
    ],
    "pth_viscar_30": [
      0.4535744375272119,
      143.84827586206896
    ],
    "pth_viswlk_30": [
      0.7652230948867138,
      331.71724137931034
    ],
    "pth_visab_30": [
      0.30462587572729893,
      200.64827586206897
    ],
    "pth_visc1_30": [
      0.41574075644744507,
      153.64827586206897
    ],
    "pth_visc2_30": [
      0.29690760122813864,
      48.324137931034485
    ],
    "pth_visde_30": [
      0.20153460783814806,
      72.9448275862069
    ],
    "pth_val_30": [
      4.98246000916015,
      1943.7586206896551
    ],
    "pth_valab_30": [
      1.245429820246193,
      820.1689655172414
    ],
    "pth_valc1_30": [
      1.69951315499313,
      627.9862068965517
    ],
    "pth_valc2_30": [
      1.213697251389572,
      197.48620689655172
    ],
    "pth_valde_30": [
      0.8238254369448073,
      298.1137931034483
    ],
    "prk_vis_40": [
      2.5158983536691717,
      5555.530013959981
    ],
    "prk_viscar_40": [
      0.9526782129791409,
      1774.0358306188925
    ],
    "prk_viswlk_40": [
      1.4213651426794773,
      3781.494183341089
    ],
    "prk_visab_40": [
      0.6931777079101862,
      2634.9981386691484
    ],
    "prk_visc1_40": [
      0.7975988425475085,
      1749.5207073057236
    ],
    "prk_visc2_40": [
      0.5272126125169676,
      462.95253606328527
    ],
    "prk_visde_40": [
      0.4294413395111816,
      708.0581665891112
    ],
    "prk_val_40": [
      10.294906308533468,
      23198.557933922755
    ],
    "prk_valab_40": [
      2.8567698913960844,
      11074.517915309447
    ],
    "prk_valc1_40": [
      3.278604750377934,
      7288.040483946022
    ],
    "prk_valc2_40": [
      2.1565872191341406,
      1909.7603536528618
    ],
    "prk_valde_40": [
      1.7562429380673243,
      2926.239646347138
    ],
    "pth_vis_40": [
      1.2188031868274782,
      475.56206896551726
    ],
    "pth_viscar_40": [
      0.45358574635431687,
      143.8448275862069
    ],
    "pth_viswlk_40": [
      0.7652174404731613,
      331.71724137931034
    ],
    "pth_visab_40": [
      0.30462587572729893,
      200.64827586206897
    ],
    "pth_visc1_40": [
      0.41574075644744507,
      153.64827586206897
    ],
    "pth_visc2_40": [
      0.29690760122813864,
      48.324137931034485
    ],
    "pth_visde_40": [
      0.20153460783814806,
      72.9448275862069
    ],
    "pth_val_40": [
      4.982476972400807,
      1943.7551724137932
    ],
    "pth_valab_40": [
      1.2454354746597456,
      820.1689655172414
    ],
    "pth_valc1_40": [
      1.6995188094066824,
      627.9862068965517
    ],
    "pth_valc2_40": [
      1.213697251389572,
      197.48620689655172
    ],
    "pth_valde_40": [
      0.8238254369448073,
      298.1137931034483
    ],
    "prk_vis_50": [
      2.516512599625386,
      5555.548161935784
    ],
    "prk_viscar_50": [
      0.9527177938740083,
      1774.0451372731502
    ],
    "prk_viswlk_50": [
      1.42176705670021,
      3781.503024662634
    ],
    "prk_visab_50": [
      0.6932426291236564,
      2635.0079106561193
    ],
    "prk_visc1_50": [
      0.7976544893019115,
      1749.5262912982782
    ],
    "prk_visc2_50": [
      0.5273491116183485,
      462.9539320614239
    ],
    "prk_visde_50": [
      0.4295323389121022,
      708.0595625872498
    ],
    "prk_val_50": [
      10.297401208775376,
      23198.635179153094
    ],
    "prk_valab_50": [
      2.857043487938566,
      11074.560725919033
    ],
    "prk_valc1_50": [
      3.2788180629364794,
      7288.063750581666
    ],
    "prk_valc2_50": [
      2.1571332155396643,
      1909.7659376454164
    ],
    "prk_valde_50": [
      1.756614518954417,
      2926.245230339693
    ],
    "pth_vis_50": [
      1.2188258044816882,
      475.5655172413793
    ],
    "pth_viscar_50": [
      0.45360270959497434,
      143.84827586206896
    ],
    "pth_viswlk_50": [
      0.7652287493002663,
      331.71724137931034
    ],
    "pth_visab_50": [
      0.3046315301408514,
      200.64827586206897
    ],
    "pth_visc1_50": [
      0.41574641086099756,
      153.64827586206897
    ],
    "pth_visc2_50": [
      0.29691325564169113,
      48.324137931034485
    ],
    "pth_visde_50": [
      0.20153460783814806,
      72.9448275862069
    ],
    "pth_val_50": [
      4.982578751844753,
      1943.7586206896551
    ],
    "pth_valab_50": [
      1.2454694011410608,
      820.1724137931035
    ],
    "pth_valc1_50": [
      1.6995527358879974,
      627.9896551724138
    ],
    "pth_valc2_50": [
      1.213719869043782,
      197.48620689655172
    ],
    "pth_valde_50": [
      0.8238424001854647,
      298.1137931034483
    ],
    "rec_vis_20": [
      7.506680689612277,
      5662.08701721731
    ],
    "rec_vis_30": [
      7.506691998439382,
      5662.0781758957655
    ],
    "rec_vis_40": [
      7.506686344025829,
      5662.064681247091
    ],
    "rec_vis_50": [
      7.506793777883327,
      5662.082829222894
    ],
    "rec_val_20": [
      30.8611558752184,
      23634.058631921824
    ],
    "rec_val_30": [
      30.86120111052682,
      23634.021405304793
    ],
    "rec_val_40": [
      30.861184147286163,
      23633.96323871568
    ],
    "rec_val_50": [
      30.861613882716153,
      23634.04187994416
    ],
    "prk_val_ann": [
      10.289749675814635,
      23198.620753838994
    ],
    "prk_valab_ann": [
      2.8564220991810654,
      11074.549557933922
    ],
    "prk_valc1_ann": [
      3.2783914378193892,
      7288.0600279199625
    ],
    "prk_valc2_ann": [
      2.155753057959035,
      1909.7659376454164
    ],
    "prk_valde_ann": [
      1.7556741918115706,
      2926.245230339693
    ],
    "pth_val_ann": [
      4.98246000916015,
      1943.7586206896551
    ],
    "pth_valab_ann": [
      1.245429820246193,
      820.1689655172414
    ],
    "pth_valc1_ann": [
      1.69951315499313,
      627.9862068965517
    ],
    "pth_valc2_ann": [
      1.213697251389572,
      197.48620689655172
    ],
    "pth_valde_ann": [
      0.8238254369448073,
      298.1137931034483
    ],
    "rec_val_ann": [
      30.861235037008136,
      23634.02745463006
    ],
    "sr_bird_20": [
      0,
      0.017241379310344827
    ],
    "sr_herp_20": [
      0,
      0.0008250825082508251
    ],
    "sr_invert_20": [
      0,
      0.020689655172413793
    ],
    "sr_lichen_20": [
      0,
      0.0006142506142506142
    ],
    "sr_mammal_20": [
      0,
      0.010344827586206896
    ],
    "sr_plant_20": [
      0,
      0.034482758620689655
    ],
    "sr_100_20": [
      0,
      0.08275862068965517
    ],
    "sr_bird_30": [
      0,
      0.013793103448275862
    ],
    "sr_herp_30": [
      0,
      0.0034482758620689655
    ],
    "sr_invert_30": [
      0,
      0.017241379310344827
    ],
    "sr_lichen_30": [
      0,
      0.00042498937526561835
    ],
    "sr_mammal_30": [
      0,
      0.010344827586206896
    ],
    "sr_plant_30": [
      0,
      0.03103448275862069
    ],
    "sr_100_30": [
      0,
      0.07586206896551724
    ],
    "sr_bird_40": [
      0,
      0.013793103448275862
    ],
    "sr_herp_40": [
      0,
      0.0034482758620689655
    ],
    "sr_invert_40": [
      0,
      0.02413793103448276
    ],
    "sr_lichen_40": [
      0,
      0.0005738880918220947
    ],
    "sr_mammal_40": [
      0,
      0.010344827586206896
    ],
    "sr_plant_40": [
      0,
      0.03793103448275862
    ],
    "sr_100_40": [
      0,
      0.0896551724137931
    ],
    "sr_bird_50": [
      0,
      0.013793103448275862
    ],
    "sr_herp_50": [
      0,
      0.0034482758620689655
    ],
    "sr_invert_50": [
      0,
      0.027586206896551724
    ],
    "sr_lichen_50": [
      0,
      0.00042498937526561835
    ],
    "sr_mammal_50": [
      0,
      0.010344827586206896
    ],
    "sr_plant_50": [
      0,
      0.05172413793103448
    ],
    "sr_100_50": [
      0,
      0.10689655172413794
    ]
  },
  "basins": {
    "tot_area": [
      1,
      1
    ],
    "wood_ha": [
      0.0045351473922902496,
      0.5639132981839484
    ],
    "sngrass_ha": [
      0,
      0.2979089790897909
    ],
    "urban_ha": [
      0.000985869208018403,
      0.8965936739659367
    ],
    "water_ha": [
      0,
      0.07195988299206017
    ],
    "farm_ha": [
      0.02422145328719723,
      0.921443736730361
    ],
    "arable_ha_20": [
      0.002952029520295203,
      0.7800269905533064
    ],
    "arable_ha_30": [
      0.0031980319803198032,
      0.7584345479082322
    ],
    "arable_ha_40": [
      0.0031980319803198032,
      0.7645331295007443
    ],
    "arable_ha_50": [
      0.0031980319803198032,
      0.7632055356639981
    ],
    "grass_ha_20": [
      0.009688581314878892,
      0.8600577081615829
    ],
    "grass_ha_30": [
      0.008304498269896194,
      0.861088211046991
    ],
    "grass_ha_40": [
      0.00795847750865052,
      0.861088211046991
    ],
    "grass_ha_50": [
      0.007612456747404845,
      0.8588211046990931
    ],
    "wheat_ha_20": [
      0,
      0.5155195681511471
    ],
    "wheat_ha_30": [
      0,
      0.5074224021592443
    ],
    "wheat_ha_40": [
      0,
      0.4993252361673414
    ],
    "wheat_ha_50": [
      0,
      0.4925775978407557
    ],
    "osr_ha_20": [
      0,
      0.13765182186234817
    ],
    "osr_ha_30": [
      0,
      0.13090418353576247
    ],
    "osr_ha_40": [
      0,
      0.12955465587044535
    ],
    "osr_ha_50": [
      0,
      0.12955465587044535
    ],
    "wbar_ha_20": [
      0,
      0.12150960693685779
    ],
    "wbar_ha_30": [
      0,
      0.12643722067305857
    ],
    "wbar_ha_40": [
      0,
      0.12853814125826044
    ],
    "wbar_ha_50": [
      0,
      0.12565055762081784
    ],
    "sbar_ha_20": [
      0,
      0.17174721189591077
    ],
    "sbar_ha_30": [
      0,
      0.1962825278810409
    ],
    "sbar_ha_40": [
      0,
      0.20446096654275092
    ],
    "sbar_ha_50": [
      0,
      0.20446096654275092
    ],
    "pot_ha_20": [
      0,
      0.06034671933289445
    ],
    "pot_ha_30": [
      0,
      0.06780776826859776
    ],
    "pot_ha_40": [
      0,
      0.08251042352424841
    ],
    "pot_ha_50": [
      0,
      0.09084924292297564
    ],
    "sb_ha_20": [
      0,
      0.10518407212622088
    ],
    "sb_ha_30": [
      0,
      0.09742048585023792
    ],
    "sb_ha_40": [
      0,
      0.09140996744302529
    ],
    "sb_ha_50": [
      0,
      0.09140996744302529
    ],
    "other_ha_20": [
      0,
      0.1600918145035792
    ],
    "other_ha_30": [
      0,
      0.15542328042328044
    ],
    "other_ha_40": [
      0,
      0.15604085945755547
    ],
    "other_ha_50": [
      0,
      0.17243335224049916
    ],
    "pgrass_ha_20": [
      0.00726643598615917,
      0.6064855390008764
    ],
    "pgrass_ha_30": [
      0.0058823529411764705,
      0.6070698217937481
    ],
    "pgrass_ha_40": [
      0.005190311418685121,
      0.609699094361671
    ],
    "pgrass_ha_50": [
      0.005190311418685121,
      0.6134969325153374
    ],
    "tgrass_ha_20": [
      0,
      0.13481953290870488
    ],
    "tgrass_ha_30": [
      0,
      0.13694267515923567
    ],
    "tgrass_ha_40": [
      0,
      0.13959660297239915
    ],
    "tgrass_ha_50": [
      0,
      0.14171974522292993
    ],
    "rgraz_ha_20": [
      0.0006920415224913495,
      0.5350370981038747
    ],
    "rgraz_ha_30": [
      0.0006920415224913495,
      0.532769991755977
    ],
    "rgraz_ha_40": [
      0.0008875083203905037,
      0.5094806265457543
    ],
    "rgraz_ha_50": [
      0.0008875083203905037,
      0.5035670356703567
    ],
    "dairy_20": [
      0.0012300123001230013,
      0.40037664783427496
    ],
    "dairy_30": [
      0.0014760147601476014,
      0.3770244821092279
    ],
    "dairy_40": [
      0.001384083044982699,
      0.35103578154425613
    ],
    "dairy_50": [
      0.001384083044982699,
      0.3426954732510288
    ],
    "beef_20": [
      0.005190311418685121,
      0.4750530785562633
    ],
    "beef_30": [
      0.004498269896193772,
      0.43842887473460723
    ],
    "beef_40": [
      0.004152249134948097,
      0.42106638787245165
    ],
    "beef_50": [
      0.004152249134948097,
      0.41316872427983536
    ],
    "sheep_20": [
      0.010948905109489052,
      5.3929355097671925
    ],
    "sheep_30": [
      0.010340632603406326,
      4.9527428418517525
    ],
    "sheep_40": [
      0.009428223844282239,
      4.498635268932299
    ],
    "sheep_50": [
      0.009428223844282239,
      4.084131656408884
    ],
    "livestock_20": [
      0.019464720194647202,
      5.843617875301043
    ],
    "livestock_30": [
      0.01730103806228374,
      5.410543216483811
    ],
    "livestock_40": [
      0.015815085158150853,
      4.952796360717153
    ],
    "livestock_50": [
      0.015815085158150853,
      4.531816965480332
    ],
    "wheat_food_20": [
      0,
      4.219973009446694
    ],
    "wheat_food_30": [
      0,
      4.159244264507422
    ],
    "wheat_food_40": [
      0,
      4.091767881241566
    ],
    "wheat_food_50": [
      0,
      4.03778677462888
    ],
    "osr_food_20": [
      0,
      0.48582995951417
    ],
    "osr_food_30": [
      0,
      0.46288798920377866
    ],
    "osr_food_40": [
      0,
      0.45479082321187586
    ],
    "osr_food_50": [
      0,
      0.45614035087719296
    ],
    "wbar_food_20": [
      0,
      0.8190916383360709
    ],
    "wbar_food_30": [
      0,
      0.8522861835822606
    ],
    "wbar_food_40": [
      0,
      0.866419649337255
    ],
    "wbar_food_50": [
      0,
      0.846096654275093
    ],
    "sbar_food_20": [
      0,
      0.9591078066914498
    ],
    "sbar_food_30": [
      0,
      1.0929368029739777
    ],
    "sbar_food_40": [
      0,
      1.1405204460966543
    ],
    "sbar_food_50": [
      0,
      1.1405204460966543
    ],
    "pot_food_20": [
      0,
      2.237875795479482
    ],
    "pot_food_30": [
      0,
      2.5172262453368446
    ],
    "pot_food_40": [
      0,
      3.0621022602589423
    ],
    "pot_food_50": [
      0,
      3.3719552337063856
    ],
    "sb_food_20": [
      0,
      6.3794139744552965
    ],
    "sb_food_30": [
      0,
      5.910843976959679
    ],
    "sb_food_40": [
      0,
      5.549211119459053
    ],
    "sb_food_50": [
      0,
      5.547458051590283
    ],
    "food_20": [
      0.028290282902829027,
      11.134234911094415
    ],
    "food_30": [
      0.03025830258302583,
      10.492872485842609
    ],
    "food_40": [
      0.03148831488314883,
      10.057050032488629
    ],
    "food_50": [
      0.03198031980319803,
      10.011306042884991
    ],
    "arable_profit_ann": [
      1.5357933579335794,
      390.12927162663544
    ],
    "livestock_profit_ann": [
      1.7038062283737023,
      283.57175141242936
    ],
    "farm_profit_ann": [
      7.992041522491349,
      427.4448349931654
    ],
    "arable_profit_flow_20": [
      1.4533825338253383,
      392.6258543253271
    ],
    "arable_profit_flow_30": [
      1.5505535055350554,
      401.2970123022847
    ],
    "arable_profit_flow_40": [
      1.6103321033210332,
      383.48525678578403
    ],
    "arable_profit_flow_50": [
      1.649938499384994,
      370.34407342315956
    ],
    "livestock_profit_flow_20": [
      2.0629757785467127,
      304.48474576271184
    ],
    "livestock_profit_flow_30": [
      1.627681660899654,
      285.6508474576271
    ],
    "livestock_profit_flow_40": [
      1.3695501730103807,
      271.31255144032923
    ],
    "livestock_profit_flow_50": [
      1.2498269896193772,
      268.73991769547325
    ],
    "farm_profit_flow_20": [
      7.927681660899654,
      433.5918765866042
    ],
    "farm_profit_flow_30": [
      8.055363321799309,
      436.40070298769774
    ],
    "farm_profit_flow_40": [
      8.043944636678201,
      418.35871900019526
    ],
    "farm_profit_flow_50": [
      7.986159169550173,
      404.5002929115407
    ],
    "ghg_arable_20": [
      -1.7041435735022434,
      -0.006642066420664207
    ],
    "ghg_arable_30": [
      -1.637635259963051,
      -0.006888068880688807
    ],
    "ghg_arable_40": [
      -1.6244116345496238,
      -0.007134071340713407
    ],
    "ghg_arable_50": [
      -1.5998944312483505,
      -0.007134071340713407
    ],
    "ghg_grass_20": [
      -1.101380042462845,
      -0.01384083044982699
    ],
    "ghg_grass_30": [
      -1.0615711252653928,
      -0.011418685121107266
    ],
    "ghg_grass_40": [
      -1.0429447852760736,
      -0.010380622837370242
    ],
    "ghg_grass_50": [
      -1.0505404615834064,
      -0.010034602076124567
    ],
    "ghg_livestock_20": [
      -3.6199623352165724,
      -0.028719723183391003
    ],
    "ghg_livestock_30": [
      -3.4945473251028805,
      -0.023529411764705882
    ],
    "ghg_livestock_40": [
      -3.432510288065844,
      -0.02110726643598616
    ],
    "ghg_livestock_50": [
      -3.3602880658436214,
      -0.020069204152249134
    ],
    "ghg_farm_20": [
      -4.865180467091295,
      -0.07370242214532872
    ],
    "ghg_farm_30": [
      -4.532716049382716,
      -0.06920415224913495
    ],
    "ghg_farm_40": [
      -4.472530864197531,
      -0.0671280276816609
    ],
    "ghg_farm_50": [
      -4.398353909465021,
      -0.06608996539792387
    ],
    "ghg_arable_ann": [
      -13.680654526260227,
      -0.05830258302583026
    ],
    "ghg_grass_ann": [
      -8.831740976645435,
      -0.0972318339100346
    ],
    "ghg_livestock_ann": [
      -28.785493827160494,
      -0.1986159169550173
    ],
    "ghg_farm_ann": [
      -37.42695473251029,
      -0.5785467128027681
    ],
    "ghg_arable_flow_20": [
      -10.829770387965162,
      -0.04255842558425584
    ],
    "ghg_arable_flow_30": [
      -13.06149379783584,
      -0.055842558425584256
    ],
    "ghg_arable_flow_40": [
      -16.275898137345617,
      -0.07183271832718327
    ],
    "ghg_arable_flow_50": [
      -20.12483504882555,
      -0.0910209102091021
    ],
    "ghg_grass_flow_20": [
      -7.000530785562633,
      -0.08685121107266436
    ],
    "ghg_grass_flow_30": [
      -8.463375796178344,
      -0.09204152249134948
    ],
    "ghg_grass_flow_40": [
      -10.453403447268478,
      -0.10519031141868512
    ],
    "ghg_grass_flow_50": [
      -13.215308209173239,
      -0.127681660899654
    ],
    "ghg_livestock_flow_20": [
      -22.989830508474576,
      -0.18235294117647058
    ],
    "ghg_livestock_flow_30": [
      -27.885699588477365,
      -0.18858131487889274
    ],
    "ghg_livestock_flow_40": [
      -34.385802469135804,
      -0.21038062283737025
    ],
    "ghg_livestock_flow_50": [
      -42.24763374485597,
      -0.2512110726643599
    ],
    "ghg_farm_flow_20": [
      -30.90552016985138,
      -0.4674740484429066
    ],
    "ghg_farm_flow_30": [
      -36.17407407407408,
      -0.5539792387543253
    ],
    "ghg_farm_flow_40": [
      -44.806893004115224,
      -0.6719723183391003
    ],
    "ghg_farm_flow_50": [
      -55.30432098765432,
      -0.8301038062283737
    ],
    "nfwood_ha": [
      0.0022675736961451248,
      0.5496192149970709
    ],
    "fwood_ha": [
      0.0017013479911006412,
      0.12161383285302593
    ],
    "broad_ha": [
      0.0045351473922902496,
      0.38736753750918057
    ],
    "conif_ha": [
      0,
      0.3697715289982425
    ],
    "wood_mgmt_ha": [
      0,
      0.3398384219913965
    ],
    "wood_nmgmt_ha": [
      0.0045351473922902496,
      0.5639132981839484
    ],
    "broad_mgmt_ha": [
      0,
      0.21246458923512748
    ],
    "conif_mgmt_ha": [
      0,
      0.2040045709743131
    ],
    "broad_nmgmt_ha": [
      0.0045351473922902496,
      0.3636887608069164
    ],
    "conif_nmgmt_ha": [
      0,
      0.3697715289982425
    ],
    "broad_yc_20": [
      0.000006097461829888945,
      0.008928571428571428
    ],
    "broad_yc_30": [
      0.000006097461829888945,
      0.010416666666666666
    ],
    "broad_yc_40": [
      0.000006097461829888945,
      0.010416666666666666
    ],
    "broad_yc_50": [
      0.000006097461829888945,
      0.010416666666666666
    ],
    "conif_yc_20": [
      0.000010162436383148242,
      0.019345238095238096
    ],
    "conif_yc_30": [
      0.000010162436383148242,
      0.017857142857142856
    ],
    "conif_yc_40": [
      0.000009146192744833417,
      0.01636904761904762
    ],
    "conif_yc_50": [
      0.000009146192744833417,
      0.01636904761904762
    ],
    "broad_rp": [
      0.00015243654574722363,
      0.22321428571428573
    ],
    "conif_rp": [
      0.00006148599349068283,
      0.0931174089068826
    ],
    "timber_broad_yr": [
      0,
      1.7467212254747666
    ],
    "timber_conif_yr": [
      0,
      4.51969592259848
    ],
    "timber_mixed_yr": [
      0,
      2.5259156876295785
    ],
    "timber_current_yr": [
      0,
      3.0006910850034556
    ],
    "timber_broad_50": [
      0,
      14.596474661630468
    ],
    "timber_conif_40": [
      0,
      31.230822391154113
    ],
    "timber_conif_50": [
      0,
      31.230822391154113
    ],
    "timber_mixed_40": [
      0,
      13.583966827919834
    ],
    "timber_mixed_50": [
      0,
      18.490670352453353
    ],
    "timber_current_40": [
      0,
      21.203458041436875
    ],
    "timber_current_50": [
      0,
      21.515549412577748
    ],
    "timber_broad_ann": [
      -74.78994858881545,
      0
    ],
    "timber_conif_ann": [
      -29.162312454097158,
      1.5918123412520544
    ],
    "timber_mixed_ann": [
      -56.53887315077117,
      0
    ],
    "timber_current_ann": [
      -57.61714405623754,
      0
    ],
    "timber_broad_flow_20": [
      -217.17070611688175,
      0
    ],
    "timber_broad_flow_30": [
      -10.195887105235547,
      0
    ],
    "timber_broad_flow_40": [
      -6.117511278984367,
      0
    ],
    "timber_broad_flow_50": [
      -4.7802349689011745,
      0.13421100749680015
    ],
    "timber_conif_flow_20": [
      -93.66393872626168,
      0
    ],
    "timber_conif_flow_30": [
      -10.195887105235547,
      0
    ],
    "timber_conif_flow_40": [
      -6.117511278984367,
      3.320663441603317
    ],
    "timber_conif_flow_50": [
      -2.920160827110856,
      46.43814789219074
    ],
    "timber_mixed_flow_20": [
      -167.76802014479068,
      0
    ],
    "timber_mixed_flow_30": [
      -10.195887105235547,
      0
    ],
    "timber_mixed_flow_40": [
      -6.117511278984367,
      0.04258180188256387
    ],
    "timber_mixed_flow_50": [
      -3.7158745147413703,
      15.7069799585349
    ],
    "timber_current_flow_20": [
      -170.87566887000315,
      0
    ],
    "timber_current_flow_30": [
      -10.195887105235547,
      0
    ],
    "timber_current_flow_40": [
      -6.117511278984367,
      2.910220102350077
    ],
    "timber_current_flow_50": [
      -3.726051830867695,
      33.4281810503304
    ],
    "ghg_broad_yr": [
      0,
      0.4889308572028119
    ],
    "ghg_conif_yr": [
      0,
      0.33932273669661367
    ],
    "ghg_mixed_yr": [
      0,
      0.3727835484209422
    ],
    "ghg_current_yr": [
      0,
      0.37928863707900534
    ],
    "ghg_broad_30": [
      0,
      0.02675480012590494
    ],
    "ghg_broad_40": [
      0,
      0.05455880809988459
    ],
    "ghg_broad_50": [
      0,
      0.03939184519695923
    ],
    "ghg_conif_20": [
      0,
      0.00414651002073255
    ],
    "ghg_conif_30": [
      0,
      0.029716655148583276
    ],
    "ghg_conif_40": [
      0,
      0.051831375259156875
    ],
    "ghg_conif_50": [
      0,
      0.060124395300621976
    ],
    "ghg_mixed_30": [
      0,
      0.018675899695729723
    ],
    "ghg_mixed_40": [
      0,
      0.04553562060644214
    ],
    "ghg_mixed_50": [
      0,
      0.04768486523842433
    ],
    "ghg_current_30": [
      0,
      0.02073255010366275
    ],
    "ghg_current_40": [
      0,
      0.0463749868849019
    ],
    "ghg_current_50": [
      0,
      0.05044920525224603
    ],
    "ghg_broad_ann": [
      0,
      9.125904941768965
    ],
    "ghg_conif_ann": [
      0,
      4.353144436765723
    ],
    "ghg_mixed_ann": [
      0,
      6.519882488721016
    ],
    "ghg_current_ann": [
      0,
      6.678732556919526
    ],
    "ghg_broad_flow_20": [
      0,
      0.7085300598048473
    ],
    "ghg_broad_flow_30": [
      0,
      7.080474241947329
    ],
    "ghg_broad_flow_40": [
      0,
      14.049627531213934
    ],
    "ghg_broad_flow_50": [
      0,
      15.446123177001365
    ],
    "ghg_conif_flow_20": [
      0,
      0.9184519695922598
    ],
    "ghg_conif_flow_30": [
      0,
      7.924671734623359
    ],
    "ghg_conif_flow_40": [
      0,
      12.436765722183829
    ],
    "ghg_conif_flow_50": [
      0,
      17.473393227366966
    ],
    "ghg_mixed_flow_20": [
      0,
      0.5411195577055978
    ],
    "ghg_mixed_flow_30": [
      0,
      5.032525443290316
    ],
    "ghg_mixed_flow_40": [
      0,
      11.902738432483474
    ],
    "ghg_mixed_flow_50": [
      0,
      14.708362128541811
    ],
    "ghg_current_flow_20": [
      0,
      0.6268140981340705
    ],
    "ghg_current_flow_30": [
      0,
      5.632342778161714
    ],
    "ghg_current_flow_40": [
      0,
      12.072080579162732
    ],
    "ghg_current_flow_50": [
      0,
      15.355908776779543
    ],
    "fert_nitr_20": [
      0.3675276752767528,
      80.7527826596368
    ],
    "fert_nitr_30": [
      0.3854858548585486,
      81.48603788322593
    ],
    "fert_nitr_40": [
      0.39532595325953257,
      83.03306915556986
    ],
    "fert_nitr_50": [
      0.397539975399754,
      81.01790240173794
    ],
    "fert_phos_20": [
      0.22902829028290284,
      49.66373755125952
    ],
    "fert_phos_30": [
      0.24206642066420664,
      50.02753368482718
    ],
    "fert_phos_40": [
      0.24920049200492006,
      47.91974223784417
    ],
    "fert_phos_50": [
      0.25362853628536286,
      46.332747510251906
    ],
    "pest_20": [
      0.021402214022140223,
      4.4141769185705915
    ],
    "pest_30": [
      0.02263222632226322,
      4.471197031829721
    ],
    "pest_40": [
      0.023124231242312422,
      4.399806895441928
    ],
    "pest_50": [
      0.023370233702337023,
      4.311220179426319
    ],
    "tot_fert_pest_20": [
      0.6179581795817958,
      134.8306971294669
    ],
    "tot_fert_pest_30": [
      0.6501845018450184,
      135.98476859988284
    ],
    "tot_fert_pest_40": [
      0.667650676506765,
      133.55014683992437
    ],
    "tot_fert_pest_50": [
      0.6745387453874538,
      130.3312547773263
    ],
    "prk_area": [
      0,
      39808.575677110995
    ],
    "pth_len": [
      0,
      31.068973862536303
    ],
    "prk_vis_20": [
      0,
      1342.5392895586651
    ],
    "prk_viscar_20": [
      0,
      531.2779870828848
    ],
    "prk_viswlk_20": [
      0,
      811.2610333692143
    ],
    "prk_visab_20": [
      0,
      515.5228740581271
    ],
    "prk_visc1_20": [
      0,
      434.29009687836384
    ],
    "prk_visc2_20": [
      0,
      184.92761033369214
    ],
    "prk_visde_20": [
      0,
      244.6979776770914
    ],
    "prk_val_20": [
      0,
      5489.7448869752425
    ],
    "prk_valab_20": [
      0,
      2108.375941872982
    ],
    "prk_valc1_20": [
      0,
      1775.810279870829
    ],
    "prk_valc2_20": [
      0,
      756.0508611410119
    ],
    "prk_valde_20": [
      0,
      1010.1364791689689
    ],
    "pth_vis_20": [
      0,
      115.80868992758394
    ],
    "pth_viscar_20": [
      0,
      90.63554970375247
    ],
    "pth_viswlk_20": [
      0,
      75.40032089851584
    ],
    "pth_visab_20": [
      0,
      38.609422492401215
    ],
    "pth_visc1_20": [
      0,
      37.50599078341014
    ],
    "pth_visc2_20": [
      0,
      25.94391046741277
    ],
    "pth_visde_20": [
      0,
      20.647477360931436
    ],
    "pth_val_20": [
      0,
      474.06635944700463
    ],
    "pth_valab_20": [
      0,
      157.86575481256332
    ],
    "pth_valc1_20": [
      0,
      153.52574061882817
    ],
    "pth_valc2_20": [
      0,
      106.17709019091508
    ],
    "pth_valde_20": [
      0,
      84.45019404915912
    ],
    "prk_vis_30": [
      0,
      1342.5352529601723
    ],
    "prk_viscar_30": [
      0,
      531.2758342303553
    ],
    "prk_viswlk_30": [
      0,
      811.259418729817
    ],
    "prk_visab_30": [
      0,
      515.5209903121636
    ],
    "prk_visc1_30": [
      0,
      434.28875134553283
    ],
    "prk_visc2_30": [
      0,
      184.92707212055973
    ],
    "prk_visde_30": [
      0,
      244.69985633771688
    ],
    "prk_val_30": [
      0,
      5489.729009687836
    ],
    "prk_valab_30": [
      0,
      2108.368137782562
    ],
    "prk_valc1_30": [
      0,
      1775.8054359526373
    ],
    "prk_valc2_30": [
      0,
      756.0489773950485
    ],
    "prk_valde_30": [
      0,
      1010.1443253398165
    ],
    "pth_vis_30": [
      0,
      115.83357472021066
    ],
    "pth_viscar_30": [
      0,
      90.63844634628045
    ],
    "pth_viswlk_30": [
      0,
      75.39891696750902
    ],
    "pth_visab_30": [
      0,
      38.60840932117528
    ],
    "pth_visc1_30": [
      0,
      37.51336405529954
    ],
    "pth_visc2_30": [
      0,
      25.948123765635287
    ],
    "pth_visde_30": [
      0,
      20.647477360931436
    ],
    "pth_val_30": [
      0,
      474.1695852534562
    ],
    "pth_valab_30": [
      0,
      157.86018237082067
    ],
    "pth_valc1_30": [
      0,
      153.55668202764977
    ],
    "pth_valc2_30": [
      0,
      106.19447004608296
    ],
    "pth_valde_30": [
      0,
      84.45084087968952
    ],
    "prk_vis_40": [
      0,
      1342.5258342303553
    ],
    "prk_viscar_40": [
      0,
      531.2699138858989
    ],
    "prk_viswlk_40": [
      0,
      811.2559203444564
    ],
    "prk_visab_40": [
      0,
      515.5169537136707
    ],
    "prk_visc1_40": [
      0,
      434.28579117330463
    ],
    "prk_visc2_40": [
      0,
      184.92572658772875
    ],
    "prk_visde_40": [
      0,
      244.69488341253177
    ],
    "prk_val_40": [
      0,
      5489.689989235737
    ],
    "prk_valab_40": [
      0,
      2108.350914962325
    ],
    "prk_valc1_40": [
      0,
      1775.7927879440258
    ],
    "prk_valc2_40": [
      0,
      756.0438643702906
    ],
    "prk_valde_40": [
      0,
      1010.1237705823849
    ],
    "pth_vis_40": [
      0,
      115.88466096115866
    ],
    "pth_viscar_40": [
      0,
      90.6462146148782
    ],
    "pth_viswlk_40": [
      0,
      75.42699558764541
    ],
    "pth_visab_40": [
      0,
      38.59422492401216
    ],
    "pth_visc1_40": [
      0,
      37.52942725477288
    ],
    "pth_visc2_40": [
      0,
      25.95813034891376
    ],
    "pth_visde_40": [
      0,
      20.647477360931436
    ],
    "pth_val_40": [
      0,
      474.38341013824885
    ],
    "pth_valab_40": [
      0,
      157.80344478216819
    ],
    "pth_valc1_40": [
      0,
      153.62369980250165
    ],
    "pth_valc2_40": [
      0,
      106.23620803159973
    ],
    "pth_valde_40": [
      0,
      84.45019404915912
    ],
    "prk_vis_50": [
      0,
      1342.5247578040903
    ],
    "prk_viscar_50": [
      0,
      531.2693756727664
    ],
    "prk_viswlk_50": [
      0,
      811.255382131324
    ],
    "prk_visab_50": [
      0,
      515.5164155005382
    ],
    "prk_visc1_50": [
      0,
      434.2852529601722
    ],
    "prk_visc2_50": [
      0,
      184.92572658772875
    ],
    "prk_visde_50": [
      0,
      244.69841971488563
    ],
    "prk_val_50": [
      0,
      5489.6854144241115
    ],
    "prk_valab_50": [
      0,
      2108.349300322928
    ],
    "prk_valc1_50": [
      0,
      1775.7911733046287
    ],
    "prk_valc2_50": [
      0,
      756.043057050592
    ],
    "prk_valde_50": [
      0,
      1010.1385788484915
    ],
    "pth_vis_50": [
      0,
      115.97156023699803
    ],
    "pth_viscar_50": [
      0,
      90.67412771560237
    ],
    "pth_viswlk_50": [
      0,
      75.42880064179703
    ],
    "pth_visab_50": [
      0,
      38.58409321175279
    ],
    "pth_visc1_50": [
      0,
      37.556945358788674
    ],
    "pth_visc2_50": [
      0,
      25.975378538512178
    ],
    "pth_visde_50": [
      0,
      20.646830530401036
    ],
    "pth_val_50": [
      0,
      474.74575378538515
    ],
    "pth_valab_50": [
      0,
      157.76089159067882
    ],
    "pth_valc1_50": [
      0,
      153.73851217906517
    ],
    "pth_valc2_50": [
      0,
      106.3083607636603
    ],
    "pth_valde_50": [
      0,
      84.44890038809832
    ],
    "rec_vis_20": [
      0.9807186678352322,
      1343.9868137782562
    ],
    "rec_vis_30": [
      0.9807186678352322,
      1343.9830462863295
    ],
    "rec_vis_40": [
      0.9807186678352322,
      1343.973358449946
    ],
    "rec_vis_50": [
      0.9807186678352322,
      1343.9722820236814
    ],
    "rec_val_20": [
      4.010224948875256,
      5495.66146393972
    ],
    "rec_val_30": [
      4.010224948875256,
      5495.645586652315
    ],
    "rec_val_40": [
      4.010224948875256,
      5495.606566200216
    ],
    "rec_val_50": [
      4.010224948875256,
      5495.601722282024
    ],
    "prk_val_ann": [
      0,
      5489.7214747039825
    ],
    "prk_valab_ann": [
      0,
      2108.365177610334
    ],
    "prk_valc1_ann": [
      0,
      1775.8027448869752
    ],
    "prk_valc2_ann": [
      0,
      756.0479009687837
    ],
    "prk_valde_ann": [
      0,
      1010.1364791689689
    ],
    "pth_val_ann": [
      0,
      474.251086240948
    ],
    "pth_valab_ann": [
      0,
      157.83738601823708
    ],
    "pth_valc1_ann": [
      0,
      153.5830151415405
    ],
    "pth_valc2_ann": [
      0,
      106.21158657011192
    ],
    "pth_valde_ann": [
      0,
      84.45019404915912
    ],
    "rec_val_ann": [
      4.010224948875256,
      5495.63805166846
    ],
    "sr_bird_20": [
      0.00001219492365977789,
      0.011904761904761904
    ],
    "sr_herp_20": [
      0,
      0.001488095238095238
    ],
    "sr_invert_20": [
      0.000013211167298092713,
      0.011904761904761904
    ],
    "sr_lichen_20": [
      0,
      0.0010615711252653928
    ],
    "sr_mammal_20": [
      0.000010162436383148242,
      0.00744047619047619
    ],
    "sr_plant_20": [
      0.000021341116404611307,
      0.019345238095238096
    ],
    "sr_100_20": [
      0.0000589421310222598,
      0.052083333333333336
    ],
    "sr_bird_30": [
      0.000013211167298092713,
      0.011904761904761904
    ],
    "sr_herp_30": [
      0,
      0.001488095238095238
    ],
    "sr_invert_30": [
      0.000018292385489666833,
      0.010566762728146013
    ],
    "sr_lichen_30": [
      0,
      0.0007434944237918215
    ],
    "sr_mammal_30": [
      0.000010162436383148242,
      0.00744047619047619
    ],
    "sr_plant_30": [
      0.000020324872766296483,
      0.019345238095238096
    ],
    "sr_100_30": [
      0.00006402334921383392,
      0.049107142857142856
    ],
    "sr_bird_40": [
      0.000011178680021463065,
      0.010710808179162609
    ],
    "sr_herp_40": [
      0,
      0.001488095238095238
    ],
    "sr_invert_40": [
      0.000018292385489666833,
      0.011904761904761904
    ],
    "sr_lichen_40": [
      0,
      0.000691085003455425
    ],
    "sr_mammal_40": [
      0.000009146192744833417,
      0.007380073800738007
    ],
    "sr_plant_40": [
      0.00002235736004292613,
      0.01636904761904762
    ],
    "sr_100_40": [
      0.0000630071055755191,
      0.043154761904761904
    ],
    "sr_bird_50": [
      0.00001219492365977789,
      0.011904761904761904
    ],
    "sr_herp_50": [
      0,
      0.001488095238095238
    ],
    "sr_invert_50": [
      0.00001727614185135201,
      0.013530135301353014
    ],
    "sr_lichen_50": [
      0,
      0.0010615711252653928
    ],
    "sr_mammal_50": [
      0.000008129949106518593,
      0.010796221322537112
    ],
    "sr_plant_50": [
      0.000025406090957870603,
      0.02040816326530612
    ],
    "sr_100_50": [
      0.00006503959285214875,
      0.050595238095238096
    ]
  },
  "counties_uas": {
    "tot_area": [
      1,
      1
    ],
    "wood_ha": [
      0,
      0.3943800894598004
    ],
    "sngrass_ha": [
      0,
      0.285663259698868
    ],
    "urban_ha": [
      0.03908627389840687,
      0.9919246298788694
    ],
    "water_ha": [
      0,
      0.21787383177570094
    ],
    "farm_ha": [
      0,
      0.8185573695935049
    ],
    "arable_ha_20": [
      0,
      0.660759930769911
    ],
    "arable_ha_30": [
      0,
      0.6639013934450392
    ],
    "arable_ha_40": [
      0,
      0.6572352601813289
    ],
    "arable_ha_50": [
      0,
      0.6498490329264031
    ],
    "grass_ha_20": [
      0,
      0.6944162134349366
    ],
    "grass_ha_30": [
      0,
      0.6930979788487135
    ],
    "grass_ha_40": [
      0,
      0.6892793509182992
    ],
    "grass_ha_50": [
      0,
      0.6849546910015606
    ],
    "wheat_ha_20": [
      0,
      0.40250727463374164
    ],
    "wheat_ha_30": [
      0,
      0.4189009933928218
    ],
    "wheat_ha_40": [
      0,
      0.4260808779251187
    ],
    "wheat_ha_50": [
      0,
      0.4287843886991565
    ],
    "osr_ha_20": [
      0,
      0.1235477322788546
    ],
    "osr_ha_30": [
      0,
      0.1283898244081754
    ],
    "osr_ha_40": [
      0,
      0.12886011680527495
    ],
    "osr_ha_50": [
      0,
      0.12714690878726947
    ],
    "wbar_ha_20": [
      0,
      0.09257102344659948
    ],
    "wbar_ha_30": [
      0,
      0.09304522037779049
    ],
    "wbar_ha_40": [
      0,
      0.09602175157412708
    ],
    "wbar_ha_50": [
      0,
      0.09605037206639955
    ],
    "sbar_ha_20": [
      0,
      0.13803663423010876
    ],
    "sbar_ha_30": [
      0,
      0.1518317115054379
    ],
    "sbar_ha_40": [
      0,
      0.15663995420721236
    ],
    "sbar_ha_50": [
      0,
      0.1566971951917573
    ],
    "pot_ha_20": [
      0,
      0.06479722599125584
    ],
    "pot_ha_30": [
      0,
      0.06919945725915876
    ],
    "pot_ha_40": [
      0,
      0.07339062264435399
    ],
    "pot_ha_50": [
      0,
      0.07250113071008593
    ],
    "sb_ha_20": [
      0,
      0.08297785540116523
    ],
    "sb_ha_30": [
      0,
      0.07914452175449745
    ],
    "sb_ha_40": [
      0,
      0.07798643763171798
    ],
    "sb_ha_50": [
      0,
      0.07800335769195338
    ],
    "other_ha_20": [
      0,
      0.10344573971242599
    ],
    "other_ha_30": [
      0,
      0.11550766741440811
    ],
    "other_ha_40": [
      0,
      0.12264185636009267
    ],
    "other_ha_50": [
      0,
      0.1222373404920384
    ],
    "pgrass_ha_20": [
      0,
      0.4935172624945251
    ],
    "pgrass_ha_30": [
      0,
      0.495273491152945
    ],
    "pgrass_ha_40": [
      0,
      0.494499559879743
    ],
    "pgrass_ha_50": [
      0,
      0.49110191654299357
    ],
    "tgrass_ha_20": [
      0,
      0.11062867480777928
    ],
    "tgrass_ha_30": [
      0,
      0.1087140057289311
    ],
    "tgrass_ha_40": [
      0,
      0.10643750942258405
    ],
    "tgrass_ha_50": [
      0,
      0.10580431177446104
    ],
    "rgraz_ha_20": [
      0,
      0.3540124299410622
    ],
    "rgraz_ha_30": [
      0,
      0.34627985032680786
    ],
    "rgraz_ha_40": [
      0,
      0.33801329714625256
    ],
    "rgraz_ha_50": [
      0,
      0.32918868136632995
    ],
    "dairy_20": [
      0,
      0.25253717662499087
    ],
    "dairy_30": [
      0,
      0.24006569056687627
    ],
    "dairy_40": [
      0,
      0.22497630348208614
    ],
    "dairy_50": [
      0,
      0.2103070304877837
    ],
    "beef_20": [
      0,
      0.3747173224785165
    ],
    "beef_30": [
      0,
      0.34336559595881694
    ],
    "beef_40": [
      0,
      0.31667502152983973
    ],
    "beef_50": [
      0,
      0.29396264733479865
    ],
    "sheep_20": [
      0,
      3.988312805677297
    ],
    "sheep_30": [
      0,
      3.621549493206815
    ],
    "sheep_40": [
      0,
      3.3317428653583496
    ],
    "sheep_50": [
      0,
      3.0636636474732226
    ],
    "livestock_20": [
      0,
      4.305610892649886
    ],
    "livestock_30": [
      0,
      3.9230554956509236
    ],
    "livestock_40": [
      0,
      3.6313169434260657
    ],
    "livestock_50": [
      0,
      3.3604072316871543
    ],
    "wheat_food_20": [
      0,
      3.296531336721846
    ],
    "wheat_food_30": [
      0,
      3.430793071937811
    ],
    "wheat_food_40": [
      0,
      3.4896007478870925
    ],
    "wheat_food_50": [
      0,
      3.511734163196038
    ],
    "osr_food_20": [
      0,
      0.43613381258368084
    ],
    "osr_food_30": [
      0,
      0.4532227026456347
    ],
    "osr_food_40": [
      0,
      0.4548735249374943
    ],
    "osr_food_50": [
      0,
      0.4488221095013461
    ],
    "wbar_food_20": [
      0,
      0.6239428773990986
    ],
    "wbar_food_30": [
      0,
      0.6271608471665713
    ],
    "wbar_food_40": [
      0,
      0.6470807097882083
    ],
    "wbar_food_50": [
      0,
      0.6473382942186605
    ],
    "sbar_food_20": [
      0,
      0.7688036634230109
    ],
    "sbar_food_30": [
      0,
      0.8456210646823126
    ],
    "sbar_food_40": [
      0,
      0.8724957069261591
    ],
    "sbar_food_50": [
      0,
      0.8728391528334287
    ],
    "pot_food_20": [
      0,
      2.4040856324438415
    ],
    "pot_food_30": [
      0,
      2.5675410824664557
    ],
    "pot_food_40": [
      0,
      2.7230514096185736
    ],
    "pot_food_50": [
      0,
      2.6899743705713854
    ],
    "sb_food_20": [
      0,
      5.0367672908915555
    ],
    "sb_food_30": [
      0,
      4.804029982346737
    ],
    "sb_food_40": [
      0,
      4.733721492048511
    ],
    "sb_food_50": [
      0,
      4.7347987358834995
    ],
    "food_20": [
      0,
      9.068702964582554
    ],
    "food_30": [
      0,
      8.735729339196448
    ],
    "food_40": [
      0,
      8.656043375514416
    ],
    "food_50": [
      0,
      8.662659119066463
    ],
    "arable_profit_ann": [
      0,
      329.3686321333909
    ],
    "livestock_profit_ann": [
      0,
      187.03717836099952
    ],
    "farm_profit_ann": [
      0,
      358.31169202889345
    ],
    "arable_profit_flow_20": [
      0,
      336.7605822726926
    ],
    "arable_profit_flow_30": [
      0,
      329.50348635351304
    ],
    "arable_profit_flow_40": [
      0,
      321.7316396954839
    ],
    "arable_profit_flow_50": [
      0,
      317.97875670045477
    ],
    "livestock_profit_flow_20": [
      0,
      198.6425488773232
    ],
    "livestock_profit_flow_30": [
      0,
      188.33379279695296
    ],
    "livestock_profit_flow_40": [
      0,
      176.32535579497045
    ],
    "livestock_profit_flow_50": [
      0,
      164.8767989389515
    ],
    "farm_profit_flow_20": [
      0,
      367.7676582916275
    ],
    "farm_profit_flow_30": [
      0,
      357.99946989135316
    ],
    "farm_profit_flow_40": [
      0,
      348.674288036989
    ],
    "farm_profit_flow_50": [
      0,
      344.47999390290374
    ],
    "ghg_arable_20": [
      -1.5251666116234366,
      0
    ],
    "ghg_arable_30": [
      -1.4899965280424088,
      0
    ],
    "ghg_arable_40": [
      -1.4601749527898449,
      0
    ],
    "ghg_arable_50": [
      -1.4484960263121687,
      0
    ],
    "ghg_grass_20": [
      -0.8643748634301213,
      0
    ],
    "ghg_grass_30": [
      -0.8545096980680985,
      0
    ],
    "ghg_grass_40": [
      -0.8478515148009614,
      0
    ],
    "ghg_grass_50": [
      -0.8468939189449736,
      0
    ],
    "ghg_livestock_20": [
      -2.633922029846142,
      0
    ],
    "ghg_livestock_30": [
      -2.4484741565028583,
      0
    ],
    "ghg_livestock_40": [
      -2.2769362125607144,
      0
    ],
    "ghg_livestock_50": [
      -2.1095768802338664,
      0
    ],
    "ghg_farm_20": [
      -3.7268053671038746,
      0
    ],
    "ghg_farm_30": [
      -3.4264257895345698,
      0
    ],
    "ghg_farm_40": [
      -3.187078240080207,
      0
    ],
    "ghg_farm_50": [
      -2.993673984521747,
      0
    ],
    "ghg_arable_ann": [
      -12.363952612012973,
      0
    ],
    "ghg_grass_ann": [
      -7.119211043843751,
      0
    ],
    "ghg_livestock_ann": [
      -19.85716951366389,
      0
    ],
    "ghg_farm_ann": [
      -27.95900975590946,
      0
    ],
    "ghg_arable_flow_20": [
      -9.693903750561018,
      0
    ],
    "ghg_arable_flow_30": [
      -11.888871952510394,
      0
    ],
    "ghg_arable_flow_40": [
      -14.62714901472618,
      0
    ],
    "ghg_arable_flow_50": [
      -18.22078373048372,
      0
    ],
    "ghg_grass_flow_20": [
      -5.4955269347935065,
      0
    ],
    "ghg_grass_flow_30": [
      -6.8191172123035,
      0
    ],
    "ghg_grass_flow_40": [
      -8.496169616576049,
      0
    ],
    "ghg_grass_flow_50": [
      -10.652373423822928,
      0
    ],
    "ghg_livestock_flow_20": [
      -16.721583824984897,
      0
    ],
    "ghg_livestock_flow_30": [
      -19.51852103159121,
      0
    ],
    "ghg_livestock_flow_40": [
      -22.786415836881478,
      0
    ],
    "ghg_livestock_flow_50": [
      -26.49553018608675,
      0
    ],
    "ghg_farm_flow_20": [
      -23.667541082466457,
      0
    ],
    "ghg_farm_flow_30": [
      -27.312099127238138,
      0
    ],
    "ghg_farm_flow_40": [
      -31.897820023393617,
      0
    ],
    "ghg_farm_flow_50": [
      -37.62630330848526,
      0
    ],
    "nfwood_ha": [
      0,
      0.3607065030393394
    ],
    "fwood_ha": [
      0,
      0.08455983179449675
    ],
    "broad_ha": [
      0,
      0.22369503610933358
    ],
    "conif_ha": [
      0,
      0.24778070879688038
    ],
    "wood_mgmt_ha": [
      0,
      0.08714333238475813
    ],
    "wood_nmgmt_ha": [
      0,
      0.3943800894598004
    ],
    "broad_mgmt_ha": [
      0,
      0.028317449182591922
    ],
    "conif_mgmt_ha": [
      0,
      0.08330360685699628
    ],
    "broad_nmgmt_ha": [
      0,
      0.22369503610933358
    ],
    "conif_nmgmt_ha": [
      0,
      0.24778070879688038
    ],
    "broad_yc_20": [
      0.000004450814053890457,
      0.006896551724137931
    ],
    "broad_yc_30": [
      0.000004450814053890457,
      0.006896551724137931
    ],
    "broad_yc_40": [
      0.000004450814053890457,
      0.006896551724137931
    ],
    "broad_yc_50": [
      0.000004450814053890457,
      0.006896551724137931
    ],
    "conif_yc_20": [
      0.000011280040156942959,
      0.020689655172413793
    ],
    "conif_yc_30": [
      0.000011280040156942959,
      0.020689655172413793
    ],
    "conif_yc_40": [
      0.000011280040156942959,
      0.020689655172413793
    ],
    "conif_yc_50": [
      0.000011280040156942959,
      0.020689655172413793
    ],
    "broad_rp": [
      0.00018690890060184666,
      0.5172413793103449
    ],
    "conif_rp": [
      0.00007600961957808431,
      0.2413793103448276
    ],
    "timber_broad_yr": [
      0,
      0.22166473937753128
    ],
    "timber_conif_yr": [
      0,
      1.219317266339876
    ],
    "timber_mixed_yr": [
      0,
      0.5848066309414542
    ],
    "timber_current_yr": [
      0,
      1.1743207333154306
    ],
    "timber_broad_50": [
      0,
      1.9032592194753024
    ],
    "timber_conif_40": [
      0,
      8.549950500406819
    ],
    "timber_conif_50": [
      0,
      8.668835697423216
    ],
    "timber_mixed_40": [
      0,
      3.41997899774346
    ],
    "timber_mixed_50": [
      0,
      4.261399936672586
    ],
    "timber_current_40": [
      0,
      8.175729567890595
    ],
    "timber_current_50": [
      0,
      8.360326977879494
    ],
    "timber_broad_ann": [
      -20.09537389227125,
      0
    ],
    "timber_conif_ann": [
      -3.716507642477818,
      0
    ],
    "timber_mixed_ann": [
      -12.506737555962596,
      0
    ],
    "timber_current_ann": [
      -7.607008390558293,
      0
    ],
    "timber_broad_flow_20": [
      -55.31938660585097,
      0
    ],
    "timber_broad_flow_30": [
      -2.614287947350068,
      0
    ],
    "timber_broad_flow_40": [
      -1.568571966797196,
      0
    ],
    "timber_broad_flow_50": [
      -1.307143973675034,
      0.006601824320919216
    ],
    "timber_conif_flow_20": [
      -23.65164510996124,
      0
    ],
    "timber_conif_flow_30": [
      -2.614287947350068,
      0
    ],
    "timber_conif_flow_40": [
      -0.7622090569801663,
      1.0180102365960313
    ],
    "timber_conif_flow_50": [
      -0.3806017149421052,
      12.881946476310336
    ],
    "timber_mixed_flow_20": [
      -42.6522904083015,
      0
    ],
    "timber_mixed_flow_30": [
      -2.614287947350068,
      0
    ],
    "timber_mixed_flow_40": [
      -0.7684677229307217,
      0
    ],
    "timber_mixed_flow_50": [
      -0.3805547147747846,
      4.368491404706269
    ],
    "timber_current_flow_20": [
      -25.046932428045228,
      0
    ],
    "timber_current_flow_30": [
      -2.614287947350068,
      0
    ],
    "timber_current_flow_40": [
      -0.7706544197032889,
      0.9069868575574055
    ],
    "timber_current_flow_50": [
      -0.3805565947814774,
      12.28600744698333
    ],
    "ghg_broad_yr": [
      0,
      0.06157825798637562
    ],
    "ghg_conif_yr": [
      0,
      0.09175461027587506
    ],
    "ghg_mixed_yr": [
      0,
      0.0660789508491084
    ],
    "ghg_current_yr": [
      0,
      0.09016541281057487
    ],
    "ghg_broad_30": [
      0,
      0.003480081329774699
    ],
    "ghg_broad_40": [
      0,
      0.006606674083532913
    ],
    "ghg_broad_50": [
      0,
      0.006178431003178395
    ],
    "ghg_conif_20": [
      0,
      0.0008557217120847145
    ],
    "ghg_conif_30": [
      0,
      0.007374838174406906
    ],
    "ghg_conif_40": [
      0,
      0.014575325555016694
    ],
    "ghg_conif_50": [
      0,
      0.01607033351102418
    ],
    "ghg_mixed_30": [
      0,
      0.0034890199080550065
    ],
    "ghg_mixed_40": [
      0,
      0.00910030982336461
    ],
    "ghg_mixed_50": [
      0,
      0.010134390393471665
    ],
    "ghg_current_30": [
      0,
      0.007100285774979258
    ],
    "ghg_current_40": [
      0,
      0.01420858767840896
    ],
    "ghg_current_50": [
      0,
      0.0156755391848399
    ],
    "ghg_broad_ann": [
      0,
      1.1499175193322628
    ],
    "ghg_conif_ann": [
      0,
      1.1583906820522891
    ],
    "ghg_mixed_ann": [
      0,
      1.0051022657587065
    ],
    "ghg_current_ann": [
      0,
      1.15197377122771
    ],
    "ghg_broad_flow_20": [
      0,
      0.09291543128346495
    ],
    "ghg_broad_flow_30": [
      0,
      0.8898348742512344
    ],
    "ghg_broad_flow_40": [
      0,
      1.7202836677316995
    ],
    "ghg_broad_flow_50": [
      0,
      2.0504666597247723
    ],
    "ghg_conif_flow_20": [
      0,
      0.20184811841424946
    ],
    "ghg_conif_flow_30": [
      0,
      1.9724185060341406
    ],
    "ghg_conif_flow_40": [
      0,
      3.646420598243666
    ],
    "ghg_conif_flow_50": [
      0,
      4.91355407079043
    ],
    "ghg_mixed_flow_20": [
      0,
      0.0942275859028365
    ],
    "ghg_mixed_flow_30": [
      0,
      0.947829032012409
    ],
    "ghg_mixed_flow_40": [
      0,
      2.3288536535509445
    ],
    "ghg_mixed_flow_50": [
      0,
      3.0906103079395746
    ],
    "ghg_current_flow_20": [
      0,
      0.1938760786702846
    ],
    "ghg_current_flow_30": [
      0,
      1.8991410718365351
    ],
    "ghg_current_flow_40": [
      0,
      3.5609806931546273
    ],
    "ghg_current_flow_50": [
      0,
      4.793580684336886
    ],
    "fert_nitr_20": [
      0,
      70.05543784772502
    ],
    "fert_nitr_30": [
      0,
      68.34930772552904
    ],
    "fert_nitr_40": [
      0,
      67.38127081850683
    ],
    "fert_nitr_50": [
      0,
      66.9051623580341
    ],
    "fert_phos_20": [
      0,
      42.38338371905935
    ],
    "fert_phos_30": [
      0,
      40.932515306252064
    ],
    "fert_phos_40": [
      0,
      39.748338964679185
    ],
    "fert_phos_50": [
      0,
      39.13193100119401
    ],
    "pest_20": [
      0,
      3.827990752737342
    ],
    "pest_30": [
      0,
      3.735982182929824
    ],
    "pest_40": [
      0,
      3.655248160285886
    ],
    "pest_50": [
      0,
      3.608203981742584
    ],
    "tot_fert_pest_20": [
      0,
      116.26681231952172
    ],
    "tot_fert_pest_30": [
      0,
      113.01780521471093
    ],
    "tot_fert_pest_40": [
      0,
      110.30266493915606
    ],
    "tot_fert_pest_50": [
      0,
      108.7811955389579
    ],
    "prk_area": [
      210.5608491111711,
      13592.069545935594
    ],
    "pth_len": [
      0.12405929304446979,
      15.37169433314253
    ],
    "prk_vis_20": [
      2.9568228981131224,
      5555.551419264774
    ],
    "prk_viscar_20": [
      0.9526329776707209,
      1774.0479292694276
    ],
    "prk_viswlk_20": [
      1.6657042824174322,
      3781.5039553280594
    ],
    "prk_visab_20": [
      0.7209603455977563,
      2635.008841321545
    ],
    "prk_visc1_20": [
      1.1031817385059908,
      1749.5276872964168
    ],
    "prk_visc2_20": [
      0.66361893776187,
      462.9548627268497
    ],
    "prk_visde_20": [
      0.4690675306610575,
      708.0604932526757
    ],
    "prk_val_20": [
      12.108728718200991,
      23198.649604467195
    ],
    "prk_valab_20": [
      2.9541935958112107,
      11074.563517915309
    ],
    "prk_valc1_20": [
      4.517486273911102,
      7288.06933457422
    ],
    "prk_valc2_20": [
      2.7171153443820573,
      1909.7691949744067
    ],
    "prk_valde_20": [
      1.9199335040966226,
      2926.2475570032575
    ],
    "pth_vis_20": [
      1.2187862235868208,
      475.5655172413793
    ],
    "pth_viscar_20": [
      0.4535687831136594,
      143.84827586206896
    ],
    "pth_viswlk_20": [
      0.7652174404731613,
      331.71724137931034
    ],
    "pth_visab_20": [
      0.30462022131374644,
      200.64827586206897
    ],
    "pth_visc1_20": [
      0.4157351020338926,
      153.64827586206897
    ],
    "pth_visc2_20": [
      0.29690194681458615,
      48.324137931034485
    ],
    "pth_visde_20": [
      0.20152895342459556,
      72.9448275862069
    ],
    "pth_val_20": [
      4.982409119438177,
      1943.7620689655173
    ],
    "pth_valab_20": [
      1.2454128570055356,
      820.1724137931035
    ],
    "pth_valc1_20": [
      1.6994961917524725,
      627.9896551724138
    ],
    "pth_valc2_20": [
      1.213685942562467,
      197.48620689655172
    ],
    "pth_valde_20": [
      0.8238141281177023,
      298.1137931034483
    ],
    "prk_vis_30": [
      2.9568455157673323,
      5555.543043275942
    ],
    "prk_viscar_30": [
      0.9526499409113783,
      1774.0437412750116
    ],
    "prk_viswlk_30": [
      1.6657601007038878,
      3781.4993020009306
    ],
    "prk_visab_30": [
      0.7209660000113088,
      2635.004187994416
    ],
    "prk_visc1_30": [
      1.1031873929195433,
      1749.5248953001396
    ],
    "prk_visc2_30": [
      0.6636245921754226,
      462.9539320614239
    ],
    "prk_visde_30": [
      0.4690675306610575,
      708.0595625872498
    ],
    "prk_val_30": [
      12.108830497644936,
      23198.61330851559
    ],
    "prk_valab_30": [
      2.9542275222925256,
      11074.544439274081
    ],
    "prk_valc1_30": [
      4.517514545978864,
      7288.058166589111
    ],
    "prk_valc2_30": [
      2.7171436164498197,
      1909.7659376454164
    ],
    "prk_valde_30": [
      1.9199448129237275,
      2926.24476500698
    ],
    "pth_vis_30": [
      1.2187975324139257,
      475.5655172413793
    ],
    "pth_viscar_30": [
      0.4535744375272119,
      143.84827586206896
    ],
    "pth_viswlk_30": [
      0.7652230948867138,
      331.71724137931034
    ],
    "pth_visab_30": [
      0.30462587572729893,
      200.64827586206897
    ],
    "pth_visc1_30": [
      0.41574075644744507,
      153.64827586206897
    ],
    "pth_visc2_30": [
      0.29690760122813864,
      48.324137931034485
    ],
    "pth_visde_30": [
      0.20153460783814806,
      72.9448275862069
    ],
    "pth_val_30": [
      4.98246000916015,
      1943.7586206896551
    ],
    "pth_valab_30": [
      1.245429820246193,
      820.1689655172414
    ],
    "pth_valc1_30": [
      1.69951315499313,
      627.9862068965517
    ],
    "pth_valc2_30": [
      1.213697251389572,
      197.48620689655172
    ],
    "pth_valde_30": [
      0.8238254369448073,
      298.1137931034483
    ],
    "prk_vis_40": [
      2.9568681334215423,
      5555.529548627269
    ],
    "prk_viscar_40": [
      0.9526782129791409,
      1774.0358306188925
    ],
    "prk_viswlk_40": [
      1.665665787047463,
      3781.493718008376
    ],
    "prk_visab_40": [
      0.7209716544248613,
      2634.9976733364356
    ],
    "prk_visc1_40": [
      1.1031930473330958,
      1749.5207073057236
    ],
    "prk_visc2_40": [
      0.6636302465889751,
      462.95253606328527
    ],
    "prk_visde_40": [
      0.46907318507461,
      708.0581665891112
    ],
    "prk_val_40": [
      12.108926622675328,
      23198.556072591902
    ],
    "prk_valab_40": [
      2.954255794360288,
      11074.51698464402
    ],
    "prk_valc1_40": [
      4.517542818046627,
      7288.040018613308
    ],
    "prk_valc2_40": [
      2.717160579690477,
      1909.759888320149
    ],
    "prk_valde_40": [
      1.9199674305779375,
      2926.2391810144254
    ],
    "pth_vis_40": [
      1.2188031868274782,
      475.56206896551726
    ],
    "pth_viscar_40": [
      0.45358574635431687,
      143.8448275862069
    ],
    "pth_viswlk_40": [
      0.7652174404731613,
      331.71724137931034
    ],
    "pth_visab_40": [
      0.30462587572729893,
      200.64827586206897
    ],
    "pth_visc1_40": [
      0.41574075644744507,
      153.64827586206897
    ],
    "pth_visc2_40": [
      0.29690760122813864,
      48.324137931034485
    ],
    "pth_visde_40": [
      0.20153460783814806,
      72.9448275862069
    ],
    "pth_val_40": [
      4.982476972400807,
      1943.7551724137932
    ],
    "pth_valab_40": [
      1.2454354746597456,
      820.1689655172414
    ],
    "pth_valc1_40": [
      1.6995188094066824,
      627.9862068965517
    ],
    "pth_valc2_40": [
      1.213697251389572,
      197.48620689655172
    ],
    "pth_valde_40": [
      0.8238254369448073,
      298.1137931034483
    ],
    "prk_vis_50": [
      2.9569303319706197,
      5555.547696603071
    ],
    "prk_viscar_50": [
      0.9527177938740083,
      1774.0451372731502
    ],
    "prk_viswlk_50": [
      1.665900608804276,
      3781.502559329921
    ],
    "prk_visab_50": [
      0.7209942720790713,
      2635.0079106561193
    ],
    "prk_visc1_50": [
      1.103215664987306,
      1749.5262912982782
    ],
    "prk_visc2_50": [
      0.66364155541608,
      462.9539320614239
    ],
    "prk_visde_50": [
      0.46908449390171497,
      708.0595625872498
    ],
    "prk_val_50": [
      12.109181071285192,
      23198.63331782224
    ],
    "prk_valab_50": [
      2.954334956150023,
      11074.559329920894
    ],
    "prk_valc1_50": [
      4.517627634249914,
      7288.063285248953
    ],
    "prk_valc2_50": [
      2.71721146941245,
      1909.7659376454164
    ],
    "prk_valde_50": [
      1.9200013570592527,
      2926.24476500698
    ],
    "pth_vis_50": [
      1.2188258044816882,
      475.5655172413793
    ],
    "pth_viscar_50": [
      0.45360270959497434,
      143.84827586206896
    ],
    "pth_viswlk_50": [
      0.7652287493002663,
      331.71724137931034
    ],
    "pth_visab_50": [
      0.3046315301408514,
      200.64827586206897
    ],
    "pth_visc1_50": [
      0.41574641086099756,
      153.64827586206897
    ],
    "pth_visc2_50": [
      0.29691325564169113,
      48.324137931034485
    ],
    "pth_visde_50": [
      0.20153460783814806,
      72.9448275862069
    ],
    "pth_val_50": [
      4.982578751844753,
      1943.7586206896551
    ],
    "pth_valab_50": [
      1.2454694011410608,
      820.1724137931035
    ],
    "pth_valc1_50": [
      1.6995527358879974,
      627.9896551724138
    ],
    "pth_valc2_50": [
      1.213719869043782,
      197.48620689655172
    ],
    "pth_valde_50": [
      0.8238424001854647,
      298.1137931034483
    ],
    "rec_vis_20": [
      7.506680689612277,
      5662.086551884598
    ],
    "rec_vis_30": [
      7.506691998439382,
      5662.077710563052
    ],
    "rec_vis_40": [
      7.506686344025829,
      5662.064215914379
    ],
    "rec_vis_50": [
      7.506793777883327,
      5662.082363890181
    ],
    "rec_val_20": [
      30.8611558752184,
      23634.05630525826
    ],
    "rec_val_30": [
      30.86120111052682,
      23634.01954397394
    ],
    "rec_val_40": [
      30.861184147286163,
      23633.96137738483
    ],
    "rec_val_50": [
      30.861613882716153,
      23634.039553280596
    ],
    "prk_val_ann": [
      12.108858769712699,
      23198.618892508144
    ],
    "prk_valab_ann": [
      2.9542388311196306,
      11074.548627268498
    ],
    "prk_valc1_ann": [
      4.517525854805969,
      7288.05956258725
    ],
    "prk_valc2_ann": [
      2.7171436164498197,
      1909.7659376454164
    ],
    "prk_valde_ann": [
      1.91995046733728,
      2926.24476500698
    ],
    "pth_val_ann": [
      4.98246000916015,
      1943.7586206896551
    ],
    "pth_valab_ann": [
      1.245429820246193,
      820.1689655172414
    ],
    "pth_valc1_ann": [
      1.69951315499313,
      627.9862068965517
    ],
    "pth_valc2_ann": [
      1.213697251389572,
      197.48620689655172
    ],
    "pth_valde_ann": [
      0.8238254369448073,
      298.1137931034483
    ],
    "rec_val_ann": [
      30.861235037008136,
      23634.025127966495
    ],
    "sr_bird_20": [
      0.0000200178929165916,
      0.017241379310344827
    ],
    "sr_herp_20": [
      0,
      0.0008250825082508251
    ],
    "sr_invert_20": [
      0.000022429068072221598,
      0.020689655172413793
    ],
    "sr_lichen_20": [
      0,
      0.00027693159789531985
    ],
    "sr_mammal_20": [
      0.000016198771385493377,
      0.010344827586206896
    ],
    "sr_plant_20": [
      0.000034889661445678046,
      0.034482758620689655
    ],
    "sr_100_20": [
      0.00009843868765030591,
      0.08275862068965517
    ],
    "sr_bird_30": [
      0.000021183008734875955,
      0.013793103448275862
    ],
    "sr_herp_30": [
      0,
      0.0034482758620689655
    ],
    "sr_invert_30": [
      0.000022429068072221598,
      0.017241379310344827
    ],
    "sr_lichen_30": [
      0,
      0.00028694404591104734
    ],
    "sr_mammal_30": [
      0.000016198771385493377,
      0.010344827586206896
    ],
    "sr_plant_30": [
      0.0000336436021083324,
      0.03103448275862069
    ],
    "sr_100_30": [
      0.00009719262831296027,
      0.07586206896551724
    ],
    "sr_bird_40": [
      0.000018478054999930708,
      0.013793103448275862
    ],
    "sr_herp_40": [
      0,
      0.0034482758620689655
    ],
    "sr_invert_40": [
      0.000024921186746912887,
      0.02413793103448276
    ],
    "sr_lichen_40": [
      0,
      0.0005738880918220947
    ],
    "sr_mammal_40": [
      0.000016198771385493377,
      0.010344827586206896
    ],
    "sr_plant_40": [
      0.000034889661445678046,
      0.03793103448275862
    ],
    "sr_100_40": [
      0.00009968474698765155,
      0.0896551724137931
    ],
    "sr_bird_50": [
      0.000019936949397530312,
      0.013793103448275862
    ],
    "sr_herp_50": [
      0,
      0.0034482758620689655
    ],
    "sr_invert_50": [
      0.000024921186746912887,
      0.027586206896551724
    ],
    "sr_lichen_50": [
      0,
      0.00028694404591104734
    ],
    "sr_mammal_50": [
      0.000016198771385493377,
      0.010344827586206896
    ],
    "sr_plant_50": [
      0.000036135720783023686,
      0.05172413793103448
    ],
    "sr_100_50": [
      0.00010093080632499719,
      0.10689655172413794
    ]
  },
  "regions": {
    "tot_area": [
      1,
      1
    ],
    "wood_ha": [
      0.04645492338152626,
      0.15380183478472495
    ],
    "sngrass_ha": [
      0.03191806778263785,
      0.09017246031301202
    ],
    "urban_ha": [
      0.0927017335268097,
      0.7740152918632263
    ],
    "water_ha": [
      0.0045394004269481815,
      0.025077318760188774
    ],
    "farm_ha": [
      0.08786136735486418,
      0.7485429678741873
    ],
    "arable_ha_20": [
      0.05273209954353597,
      0.5224758976330034
    ],
    "arable_ha_30": [
      0.05574336153606193,
      0.5229954197495276
    ],
    "arable_ha_40": [
      0.05811799308619339,
      0.518525992120688
    ],
    "arable_ha_50": [
      0.059505847450613394,
      0.5151742723489983
    ],
    "grass_ha_20": [
      0.035129267811328205,
      0.5968174991665971
    ],
    "grass_ha_30": [
      0.032118005818802246,
      0.5893673898602567
    ],
    "grass_ha_40": [
      0.02974337426867078,
      0.580462303100942
    ],
    "grass_ha_50": [
      0.02835551990425078,
      0.5748996133889163
    ],
    "wheat_ha_20": [
      0.03810566914076285,
      0.31461452227667275
    ],
    "wheat_ha_30": [
      0.04281079582532266,
      0.3275385157426091
    ],
    "wheat_ha_40": [
      0.04863412222298689,
      0.3327881874379424
    ],
    "wheat_ha_50": [
      0.049937291901424145,
      0.3322302296531181
    ],
    "osr_ha_20": [
      0.0042526913551952225,
      0.08919573364081868
    ],
    "osr_ha_30": [
      0.004469145705609351,
      0.0912552448672368
    ],
    "osr_ha_40": [
      0.004691966360447424,
      0.09240575253835559
    ],
    "osr_ha_50": [
      0.004895688102013662,
      0.09373404327310535
    ],
    "wbar_ha_20": [
      0.00008276195751128428,
      0.05070218615400654
    ],
    "wbar_ha_30": [
      0.00005093043539155955,
      0.05273453743801914
    ],
    "wbar_ha_40": [
      0.00003183152211972472,
      0.05351233643086316
    ],
    "wbar_ha_50": [
      0.000025465217695779776,
      0.05127967847851272
    ],
    "sbar_ha_20": [
      0.00013369239290284384,
      0.021027514639371858
    ],
    "sbar_ha_30": [
      0.00007639565308733932,
      0.02186622560153498
    ],
    "sbar_ha_40": [
      0.00005093043539155955,
      0.022187184824485673
    ],
    "sbar_ha_50": [
      0.00003819782654366966,
      0.021267648364572192
    ],
    "pot_ha_20": [
      0,
      0.018307957619833663
    ],
    "pot_ha_30": [
      0,
      0.01757120933249656
    ],
    "pot_ha_40": [
      0,
      0.017437255098435266
    ],
    "pot_ha_50": [
      0,
      0.017439364613932296
    ],
    "sb_ha_20": [
      0,
      0.04704905150909465
    ],
    "sb_ha_30": [
      0,
      0.045155761350511824
    ],
    "sb_ha_40": [
      0,
      0.04481243770337048
    ],
    "sb_ha_50": [
      0,
      0.04481718411323879
    ],
    "other_ha_20": [
      0.004793827231230543,
      0.06688598514909351
    ],
    "other_ha_30": [
      0.0046537685339037545,
      0.06688425698424512
    ],
    "other_ha_40": [
      0.00460920440293614,
      0.06770441918265002
    ],
    "other_ha_50": [
      0.00460920440293614,
      0.07111446438823933
    ],
    "pgrass_ha_20": [
      0.024873151384352896,
      0.35692827463883026
    ],
    "pgrass_ha_30": [
      0.022243867657263636,
      0.3515608183991929
    ],
    "pgrass_ha_40": [
      0.02013662089293786,
      0.34466663640547845
    ],
    "pgrass_ha_50": [
      0.0188251621816052,
      0.34012794625612974
    ],
    "tgrass_ha_20": [
      0.006608223992054852,
      0.07383494719225042
    ],
    "tgrass_ha_30": [
      0.006041622898323752,
      0.06970987881948615
    ],
    "tgrass_ha_40": [
      0.0056087141974954955,
      0.06487106031782673
    ],
    "tgrass_ha_50": [
      0.005398626151505313,
      0.06171434972992493
    ],
    "rgraz_ha_20": [
      0.003647892434920453,
      0.1832842077108436
    ],
    "rgraz_ha_30": [
      0.0038325152632148565,
      0.1799257039020826
    ],
    "rgraz_ha_40": [
      0.003998039178237425,
      0.17715729326361546
    ],
    "rgraz_ha_50": [
      0.004131731571140268,
      0.1755798068067174
    ],
    "dairy_20": [
      0.007830554441452281,
      0.17004633774832076
    ],
    "dairy_30": [
      0.006334472901825219,
      0.16178901520691463
    ],
    "dairy_40": [
      0.005226735932058799,
      0.15167532898374433
    ],
    "dairy_50": [
      0.004577372880816415,
      0.1433209789785719
    ],
    "beef_20": [
      0.01765376216759933,
      0.2558998335146564
    ],
    "beef_30": [
      0.016087651279308873,
      0.2466760281116677
    ],
    "beef_40": [
      0.015049943658205849,
      0.2352480368054142
    ],
    "beef_50": [
      0.014540639304290252,
      0.22463221674429637
    ],
    "sheep_20": [
      0.03486188302552252,
      3.0133446959214263
    ],
    "sheep_30": [
      0.031385880810048575,
      2.6790425164813656
    ],
    "sheep_40": [
      0.029227703610331238,
      2.376324720120615
    ],
    "sheep_50": [
      0.028240926424619773,
      2.122063383522978
    ],
    "livestock_20": [
      0.060346199634574126,
      3.3772096158342158
    ],
    "livestock_30": [
      0.05380800499118267,
      3.02816584497779
    ],
    "livestock_40": [
      0.049504383200595886,
      2.707233253726885
    ],
    "livestock_50": [
      0.04735893860972644,
      2.4366411252476414
    ],
    "wheat_food_20": [
      0.3120846102822637,
      2.5766926107427692
    ],
    "wheat_food_30": [
      0.3506197930622809,
      2.682538675891227
    ],
    "wheat_food_40": [
      0.39831435419939876,
      2.7255379392075847
    ],
    "wheat_food_50": [
      0.408996861411919,
      2.720966016463278
    ],
    "osr_food_20": [
      0.015024478440510068,
      0.31485986995932225
    ],
    "osr_food_30": [
      0.01577570236253557,
      0.3221318984017168
    ],
    "osr_food_40": [
      0.01654602519783291,
      0.32619134556868773
    ],
    "osr_food_50": [
      0.017271783902162635,
      0.3308817648832045
    ],
    "wbar_food_20": [
      0.000572967398155045,
      0.34173137587253466
    ],
    "wbar_food_30": [
      0.0003310478300451371,
      0.355426026513106
    ],
    "wbar_food_40": [
      0.0002164543504141281,
      0.36067148417870165
    ],
    "wbar_food_50": [
      0.00016552391502256856,
      0.3456227136048055
    ],
    "sbar_food_20": [
      0.0007384913131776135,
      0.1171255173124702
    ],
    "sbar_food_30": [
      0.00042654239640431125,
      0.12179348265355966
    ],
    "sbar_food_40": [
      0.00028011739465357753,
      0.1235833574443212
    ],
    "sbar_food_50": [
      0.00021008804599018316,
      0.1184620664854145
    ],
    "pot_food_20": [
      0,
      0.6792260187641403
    ],
    "pot_food_30": [
      0,
      0.6518798419972893
    ],
    "pot_food_40": [
      0,
      0.6469240627158958
    ],
    "pot_food_50": [
      0.000006366304423944944,
      0.6469952588639204
    ],
    "sb_food_20": [
      0,
      2.855877901243032
    ],
    "sb_food_30": [
      0,
      2.7409551886170544
    ],
    "sb_food_40": [
      0,
      2.7201131755064156
    ],
    "sb_food_50": [
      0,
      2.720413781464742
    ],
    "food_20": [
      0.3723205816255722,
      6.448225106398688
    ],
    "food_30": [
      0.397321059098404,
      6.283815269727925
    ],
    "food_40": [
      0.41619078541097676,
      6.265134455243992
    ],
    "food_50": [
      0.42665062357951833,
      6.268962698492224
    ],
    "arable_profit_ann": [
      22.2850958447131,
      251.67625054715558
    ],
    "livestock_profit_ann": [
      5.6040222311350485,
      132.2956141446066
    ],
    "farm_profit_ann": [
      27.889118075848153,
      282.89888856859164
    ],
    "arable_profit_flow_20": [
      21.16820412918505,
      253.51780536555268
    ],
    "arable_profit_flow_30": [
      22.3914704253328,
      250.20101942336393
    ],
    "arable_profit_flow_40": [
      23.34905810526048,
      250.44718986166853
    ],
    "arable_profit_flow_50": [
      23.90546037930442,
      250.66720230780996
    ],
    "livestock_profit_flow_20": [
      6.58617747983473,
      140.09559488180128
    ],
    "livestock_profit_flow_30": [
      5.483240703603965,
      133.05593490598682
    ],
    "livestock_profit_flow_40": [
      4.67662993309014,
      124.84712395615215
    ],
    "livestock_profit_flow_50": [
      4.215034664527589,
      118.03152251072831
    ],
    "farm_profit_flow_20": [
      27.75438160901978,
      290.08869350757504
    ],
    "farm_profit_flow_30": [
      27.874711128936763,
      283.47184523237564
    ],
    "farm_profit_flow_40": [
      28.02568803835062,
      275.6194932897729
    ],
    "farm_profit_flow_50": [
      28.120495043832005,
      275.2542667587822
    ],
    "ghg_arable_20": [
      -1.2374606835143012,
      -0.12182560145661045
    ],
    "ghg_arable_30": [
      -1.2435136606771084,
      -0.12943333524322467
    ],
    "ghg_arable_40": [
      -1.2384510425675026,
      -0.13508661357168777
    ],
    "ghg_arable_50": [
      -1.2272675442810927,
      -0.1382633994792363
    ],
    "ghg_grass_20": [
      -0.625081448964262,
      -0.04863219949451543
    ],
    "ghg_grass_30": [
      -0.619271300825984,
      -0.04373014508807782
    ],
    "ghg_grass_40": [
      -0.6103832969955033,
      -0.039884897216015076
    ],
    "ghg_grass_50": [
      -0.6046317188989417,
      -0.03761212653666673
    ],
    "ghg_livestock_20": [
      -2.041393888899464,
      -0.09212679131890729
    ],
    "ghg_livestock_30": [
      -1.8933771437245372,
      -0.07961700312585547
    ],
    "ghg_livestock_40": [
      -1.7438156136993375,
      -0.07065961280136493
    ],
    "ghg_livestock_50": [
      -1.6163022877946378,
      -0.06570662795953577
    ],
    "ghg_farm_20": [
      -2.844078251528068,
      -0.26258459227003317
    ],
    "ghg_farm_30": [
      -2.707987343013985,
      -0.252780483457158
    ],
    "ghg_farm_40": [
      -2.5700436688469366,
      -0.24563112358906777
    ],
    "ghg_farm_50": [
      -2.4502781832939693,
      -0.2415821539754388
    ],
    "ghg_arable_ann": [
      -10.309370615931584,
      -1.0857286553728427
    ],
    "ghg_grass_ann": [
      -5.132421983484225,
      -0.3586712249406342
    ],
    "ghg_livestock_ann": [
      -15.380801911726161,
      -0.6533801893338935
    ],
    "ghg_farm_ann": [
      -22.1949738118701,
      -2.0977800696473703
    ],
    "ghg_arable_flow_20": [
      -7.869173953428782,
      -0.7754477103586139
    ],
    "ghg_arable_flow_30": [
      -9.927506486019025,
      -1.0344162417158465
    ],
    "ghg_arable_flow_40": [
      -12.407423849332181,
      -1.354303940105808
    ],
    "ghg_arable_flow_50": [
      -15.436217289644791,
      -1.739942830586273
    ],
    "ghg_grass_flow_20": [
      -3.974695789643743,
      -0.30875939825690585
    ],
    "ghg_grass_flow_30": [
      -4.941563205128393,
      -0.34829414872960396
    ],
    "ghg_grass_flow_40": [
      -6.115423493127049,
      -0.39921821781673955
    ],
    "ghg_grass_flow_50": [
      -7.6043447256945305,
      -0.4726471730425206
    ],
    "ghg_livestock_flow_20": [
      -12.965195240793644,
      -0.5843821819871783
    ],
    "ghg_livestock_flow_30": [
      -15.089150924747747,
      -0.6336637445329361
    ],
    "ghg_livestock_flow_40": [
      -17.449783754525146,
      -0.7069590073658142
    ],
    "ghg_livestock_flow_50": [
      -20.302533788813026,
      -0.8254932294352452
    ],
    "ghg_farm_flow_20": [
      -18.070540293992323,
      -1.668589290602698
    ],
    "ghg_farm_flow_30": [
      -21.59397441172494,
      -2.0163741349783866
    ],
    "ghg_farm_flow_40": [
      -25.73053436865644,
      -2.460481165288362
    ],
    "ghg_farm_flow_50": [
      -30.79512101790828,
      -3.0380832330640386
    ],
    "nfwood_ha": [
      0.039547483081545994,
      0.11759875645871867
    ],
    "fwood_ha": [
      0.0069074402999802645,
      0.04019437713608516
    ],
    "broad_ha": [
      0.039421757989717594,
      0.12808839556858223
    ],
    "conif_ha": [
      0.004048969613628985,
      0.09585435479582191
    ],
    "wood_mgmt_ha": [
      0.0001932811376644903,
      0.05442133043454833
    ],
    "wood_nmgmt_ha": [
      0.045630184811505076,
      0.14595800820859134
    ],
    "broad_mgmt_ha": [
      0.00010835457717554759,
      0.012195921995196124
    ],
    "conif_mgmt_ha": [
      0.00003819782654366966,
      0.05118479637245795
    ],
    "broad_nmgmt_ha": [
      0.036186395311652575,
      0.1158924735733861
    ],
    "conif_nmgmt_ha": [
      0.00400440548266137,
      0.08416807844871388
    ],
    "broad_yc_20": [
      0.0000019523347238837406,
      0.000025465217695779776
    ],
    "broad_yc_30": [
      0.0000019523347238837406,
      0.000025465217695779776
    ],
    "broad_yc_40": [
      0.0000019523347238837406,
      0.00003183152211972472
    ],
    "broad_yc_50": [
      0.0000019523347238837406,
      0.00003183152211972472
    ],
    "conif_yc_20": [
      0.000003691652119799385,
      0.00004456413096761461
    ],
    "conif_yc_30": [
      0.00000316427324554233,
      0.00003819782654366966
    ],
    "conif_yc_40": [
      0.00000316427324554233,
      0.00003819782654366966
    ],
    "conif_yc_50": [
      0.00000316427324554233,
      0.00003819782654366966
    ],
    "broad_rp": [
      0.00006365191399183643,
      0.0009549456635917417
    ],
    "conif_rp": [
      0.000025460765596734572,
      0.00043927500525220116
    ],
    "timber_broad_yr": [
      0.000872693621576032,
      0.104167667223855
    ],
    "timber_conif_yr": [
      0.001266894580365044,
      0.7595418014246372
    ],
    "timber_mixed_yr": [
      0.0012605282759410989,
      0.366317555180973
    ],
    "timber_current_yr": [
      0.0012350630582453192,
      0.7227216873552609
    ],
    "timber_broad_50": [
      0.00728123235272441,
      0.8526785452816066
    ],
    "timber_conif_40": [
      0,
      5.335088457064676
    ],
    "timber_conif_50": [
      0.009173844674904664,
      5.3898729165470876
    ],
    "timber_mixed_40": [
      0.005347695716113753,
      2.1401338423387384
    ],
    "timber_mixed_50": [
      0.010211552296007691,
      2.6675565280646043
    ],
    "timber_current_40": [
      0.006659154427446412,
      5.025243325746669
    ],
    "timber_current_50": [
      0.01035161099333448,
      5.140803874001248
    ],
    "timber_broad_ann": [
      -12.56883813932676,
      -0.04500082730183925
    ],
    "timber_conif_ann": [
      -1.552936290433513,
      -0.006993262980951558
    ],
    "timber_mixed_ann": [
      -7.840621489508499,
      -0.02979799680695656
    ],
    "timber_current_ann": [
      -3.1882178039721927,
      -0.028066763990552652
    ],
    "timber_broad_flow_20": [
      -34.623225499624574,
      -0.1286456800445523
    ],
    "timber_broad_flow_30": [
      -1.6326328847322977,
      -0.005799410297296651
    ],
    "timber_broad_flow_40": [
      -0.9795792622857685,
      -0.0034795485616417963
    ],
    "timber_broad_flow_50": [
      -0.8163164423661489,
      -0.0011968652317016495
    ],
    "timber_conif_flow_20": [
      -14.84660374772605,
      -0.05839530775872462
    ],
    "timber_conif_flow_30": [
      -1.6326328847322977,
      -0.005799410297296651
    ],
    "timber_conif_flow_40": [
      -0.3002058048610156,
      0.6326375702683992
    ],
    "timber_conif_flow_50": [
      -0.18933587178364808,
      7.960630954291424
    ],
    "timber_mixed_flow_20": [
      -26.712577501695577,
      -0.1005457263636936
    ],
    "timber_mixed_flow_30": [
      -1.6326328847322977,
      -0.005799410297296651
    ],
    "timber_mixed_flow_40": [
      -0.3346925292641014,
      -0.0014647391265937763
    ],
    "timber_mixed_flow_50": [
      -0.18653865423458868,
      2.6944632191272957
    ],
    "timber_current_flow_20": [
      -16.022695565491496,
      -0.09774705453700626
    ],
    "timber_current_flow_30": [
      -1.6326328847322977,
      -0.005799410297296651
    ],
    "timber_current_flow_40": [
      -0.3042245547948829,
      0.5397831299615434
    ],
    "timber_current_flow_50": [
      -0.18481623483126514,
      7.477186710413956
    ],
    "ghg_broad_yr": [
      0.0002518511793810025,
      0.031477431529675255
    ],
    "ghg_conif_yr": [
      0.00010822717520706405,
      0.05715768351780679
    ],
    "ghg_mixed_yr": [
      0.0002264708279705139,
      0.0417492980481228
    ],
    "ghg_current_yr": [
      0.00022500657692760108,
      0.05604721146175841
    ],
    "ghg_broad_30": [
      0.000011225924662331507,
      0.0013729141756695271
    ],
    "ghg_broad_40": [
      0.000028308853496314237,
      0.0035047810038995376
    ],
    "ghg_broad_50": [
      0.000022451849324663014,
      0.00393819309328551
    ],
    "ghg_conif_20": [
      0,
      0.000535322499592944
    ],
    "ghg_conif_30": [
      0,
      0.004603539219694246
    ],
    "ghg_conif_40": [
      0.000012732608847889888,
      0.009094625572953211
    ],
    "ghg_conif_50": [
      0.00001909891327183483,
      0.00999190573638471
    ],
    "ghg_mixed_30": [
      0.000012202092024273377,
      0.0022010305836655183
    ],
    "ghg_mixed_40": [
      0.000025465217695779776,
      0.005739781724300713
    ],
    "ghg_mixed_50": [
      0.000025465217695779776,
      0.0063594438737201164
    ],
    "ghg_current_30": [
      0.000012690175705244313,
      0.004383319022925157
    ],
    "ghg_current_40": [
      0.000029285020858256106,
      0.008807636486738176
    ],
    "ghg_current_50": [
      0.000025465217695779776,
      0.009682660353687693
    ],
    "ghg_broad_ann": [
      0.0046743774126586455,
      0.5799463740393187
    ],
    "ghg_conif_ann": [
      0.001368755451148163,
      0.7221617657911352
    ],
    "ghg_mixed_ann": [
      0.003767029849733677,
      0.6368334678472656
    ],
    "ghg_current_ann": [
      0.003692841130226095,
      0.7205218281556207
    ],
    "ghg_broad_flow_20": [
      0.0002972429617112995,
      0.036444919423958014
    ],
    "ghg_broad_flow_30": [
      0.003060772763368734,
      0.35031902398764114
    ],
    "ghg_broad_flow_40": [
      0.007318814796159172,
      0.9320409843842795
    ],
    "ghg_broad_flow_50": [
      0.008273994559819291,
      1.2007845930201912
    ],
    "ghg_conif_flow_20": [
      0.00003819782654366966,
      0.12620491489309363
    ],
    "ghg_conif_flow_30": [
      0.000452007614100091,
      1.231559194134646
    ],
    "ghg_conif_flow_40": [
      0.00400440548266137,
      2.274527902953176
    ],
    "ghg_conif_flow_50": [
      0.006595491383206962,
      3.0561456077198894
    ],
    "ghg_mixed_flow_20": [
      0.0003489798318942186,
      0.05926734614749365
    ],
    "ghg_mixed_flow_30": [
      0.0033750986539140162,
      0.5980758845999313
    ],
    "ghg_mixed_flow_40": [
      0.0070156674751873285,
      1.469035048981423
    ],
    "ghg_mixed_flow_50": [
      0.008960728298945397,
      1.9429289989000704
    ],
    "ghg_current_flow_20": [
      0.0003655746770472304,
      0.11970256216827868
    ],
    "ghg_current_flow_30": [
      0.003445870787654802,
      1.1731914709186344
    ],
    "ghg_current_flow_40": [
      0.007404229440329086,
      2.207784783955787
    ],
    "ghg_current_flow_50": [
      0.009069082876120946,
      2.963292338797059
    ],
    "fert_nitr_20": [
      5.765637235241314,
      55.62466224656481
    ],
    "fert_nitr_30": [
      6.144050370200603,
      56.09571186060664
    ],
    "fert_nitr_40": [
      6.434213793235165,
      56.00397104512988
    ],
    "fert_nitr_50": [
      6.601100097404458,
      55.581522052464685
    ],
    "fert_phos_20": [
      3.2264048842287543,
      32.06810201616943
    ],
    "fert_phos_30": [
      3.4379380813231726,
      31.710237340251755
    ],
    "fert_phos_40": [
      3.598617238679119,
      31.50594250515513
    ],
    "fert_phos_50": [
      3.688509457145222,
      31.53334089243053
    ],
    "pest_20": [
      0.3177740853212119,
      2.9805688478908428
    ],
    "pest_30": [
      0.33887201818216545,
      3.007447551327632
    ],
    "pest_40": [
      0.3549151053305067,
      3.001904487364274
    ],
    "pest_50": [
      0.36397435652578036,
      2.9790173280804586
    ],
    "tot_fert_pest_20": [
      9.30981620479128,
      90.3791928509657
    ],
    "tot_fert_pest_30": [
      9.920860469705941,
      90.81339675218602
    ],
    "tot_fert_pest_40": [
      10.387746137244791,
      90.41027065116428
    ],
    "tot_fert_pest_50": [
      10.65358391107546,
      89.62833733704878
    ],
    "prk_area": [
      1117.4323013356395,
      8498.158350035317
    ],
    "pth_len": [
      2.390623706844414,
      10.476979483001259
    ],
    "prk_vis_20": [
      26.10523377011942,
      1194.9641131419621
    ],
    "prk_viscar_20": [
      9.048784451996726,
      472.60605308224626
    ],
    "prk_viswlk_20": [
      17.056449318122695,
      722.358060059716
    ],
    "prk_visab_20": [
      6.609696075172696,
      452.2862163142917
    ],
    "prk_visc1_20": [
      8.537558771376235,
      388.92238201646325
    ],
    "prk_visc2_20": [
      5.307509801940523,
      167.29329564481114
    ],
    "prk_visde_20": [
      5.650469121629965,
      186.46221280009166
    ],
    "prk_val_20": [
      107.19630188756602,
      4899.694283695258
    ],
    "prk_valab_20": [
      27.17353473618345,
      1857.636426720653
    ],
    "prk_valc1_20": [
      35.069240039066216,
      1594.1553696594665
    ],
    "prk_valc2_20": [
      21.77772473935111,
      684.6810608809692
    ],
    "prk_valde_20": [
      23.175802861048922,
      763.2214200678648
    ],
    "pth_vis_20": [
      6.924413408830117,
      46.218478525400236
    ],
    "pth_viscar_20": [
      3.3344237122766223,
      26.376468938808767
    ],
    "pth_viswlk_20": [
      3.589989208469814,
      19.84200958659147
    ],
    "pth_visab_20": [
      1.6841488479516835,
      17.05996963187912
    ],
    "pth_visc1_20": [
      2.1021749496907747,
      14.774846307680912
    ],
    "pth_visc2_20": [
      1.6069574376387683,
      8.307498386362916
    ],
    "pth_visde_20": [
      1.5311321735488905,
      6.311830627241004
    ],
    "pth_val_20": [
      28.310843901565235,
      188.93432814500514
    ],
    "pth_valab_20": [
      6.886482961730823,
      69.74490672648587
    ],
    "pth_valc1_20": [
      8.594926662986516,
      60.39650554985345
    ],
    "pth_valc2_20": [
      6.569975825215281,
      33.95753542065667
    ],
    "pth_valde_20": [
      6.259458939716296,
      25.80984805977807
    ],
    "prk_vis_30": [
      26.10703382273484,
      1194.9613883636687
    ],
    "prk_viscar_30": [
      9.04934916481561,
      472.6047989202748
    ],
    "prk_viswlk_30": [
      17.05768514600291,
      722.356589443394
    ],
    "prk_visab_30": [
      6.610421367522619,
      452.28505128058214
    ],
    "prk_visc1_30": [
      8.538146912211804,
      388.9214780012351
    ],
    "prk_visc2_30": [
      5.307782152634505,
      167.29292003285013
    ],
    "prk_visde_30": [
      5.650683390365911,
      186.46194541530588
    ],
    "prk_val_30": [
      107.20372466418623,
      4899.68310446469
    ],
    "prk_valab_30": [
      27.176533522319335,
      1857.6316137945084
    ],
    "prk_valc1_30": [
      35.07166483879328,
      1594.151639005074
    ],
    "prk_valc2_30": [
      21.778843427147898,
      684.679526601603
    ],
    "prk_valde_30": [
      23.17668287592571,
      763.2203250635039
    ],
    "pth_vis_30": [
      6.92475653165784,
      46.218293882992796
    ],
    "pth_viscar_30": [
      3.3346043032385815,
      26.376394870221255
    ],
    "pth_viswlk_30": [
      3.590152228419258,
      19.841898483710203
    ],
    "pth_visab_30": [
      1.684261107198307,
      17.05991249325447
    ],
    "pth_visc1_30": [
      2.1022833042679503,
      14.774769064725364
    ],
    "pth_visc2_30": [
      1.6070238170193802,
      8.307453416149068
    ],
    "pth_visde_30": [
      1.5311883031722022,
      6.311795485720243
    ],
    "pth_val_30": [
      28.312250558733794,
      188.93357158728983
    ],
    "pth_valab_30": [
      6.886943224641978,
      69.74467341043521
    ],
    "pth_valc1_30": [
      8.59537130721988,
      60.396190758356525
    ],
    "pth_valc2_30": [
      6.570247199741901,
      33.95735130731057
    ],
    "pth_valde_30": [
      6.2596888271300335,
      25.809702808158924
    ],
    "prk_vis_40": [
      26.107976800406476,
      1194.9573457603597
    ],
    "prk_viscar_40": [
      9.049619075091186,
      472.60231606154946
    ],
    "prk_viswlk_40": [
      17.05835821339897,
      722.3550296988101
    ],
    "prk_visab_40": [
      6.610649790685313,
      452.28343423925844
    ],
    "prk_visc1_40": [
      8.538468559357565,
      388.92009651317505
    ],
    "prk_visc2_40": [
      5.307959327010697,
      167.29234069914756
    ],
    "prk_visde_40": [
      5.6508991233529,
      186.46148067508292
    ],
    "prk_val_40": [
      107.20766349949166,
      4899.666520241665
    ],
    "prk_valab_40": [
      27.17749699950557,
      1857.6249737389942
    ],
    "prk_valc1_40": [
      35.07300853316699,
      1594.1459857267455
    ],
    "prk_valc2_40": [
      21.77958433817561,
      684.6771392374441
    ],
    "prk_valde_40": [
      23.177573628643483,
      763.2184279047856
    ],
    "pth_vis_40": [
      6.924401694821774,
      46.21737596156898
    ],
    "pth_viscar_40": [
      3.3346208980837346,
      26.375995957971366
    ],
    "pth_viswlk_40": [
      3.5897807967380393,
      19.841380003597617
    ],
    "pth_visab_40": [
      1.684142502863831,
      17.059545324684944
    ],
    "pth_visc1_40": [
      2.102195449205375,
      14.774464325393886
    ],
    "pth_visc2_40": [
      1.606912045856438,
      8.307295226808597
    ],
    "pth_visde_40": [
      1.5311516968961294,
      6.312604912081772
    ],
    "pth_val_40": [
      28.310789236192967,
      188.92981313553494
    ],
    "pth_valab_40": [
      6.886456117128369,
      69.74316875998603
    ],
    "pth_valc1_40": [
      8.59500963721228,
      60.394941115472925
    ],
    "pth_valc2_40": [
      6.569786448747065,
      33.9567026781085
    ],
    "pth_valde_40": [
      6.259537033105252,
      25.813015482182664
    ],
    "prk_vis_50": [
      26.106327565648474,
      1194.9635019767375
    ],
    "prk_viscar_50": [
      9.049271559510334,
      472.6053909865862
    ],
    "prk_viswlk_50": [
      17.05705600613814,
      722.3581109901513
    ],
    "prk_visab_50": [
      6.610118267556736,
      452.28641366972886
    ],
    "prk_visc1_50": [
      8.537886763609848,
      388.9220891664598
    ],
    "prk_visc2_50": [
      5.307698690325059,
      167.2930409926342
    ],
    "prk_visde_50": [
      5.650623844156833,
      186.46195814791471
    ],
    "prk_val_50": [
      107.20094600379046,
      4899.691813569141
    ],
    "prk_valab_50": [
      27.175328443711017,
      1857.637222508706
    ],
    "prk_valc1_50": [
      35.070639374979564,
      1594.1541664279302
    ],
    "prk_valc2_50": [
      21.778525684671585,
      684.6800231733481
    ],
    "prk_valde_50": [
      23.176452500428294,
      763.2204078254614
    ],
    "pth_vis_50": [
      6.9242391629560105,
      46.21644005205964
    ],
    "pth_viscar_50": [
      3.3346082079080293,
      26.375536203667455
    ],
    "pth_viswlk_50": [
      3.5896309550479812,
      19.840904377453523
    ],
    "pth_visab_50": [
      1.684075147315857,
      17.05918662109685
    ],
    "pth_visc1_50": [
      2.1021378553310206,
      14.774170696350534
    ],
    "pth_visc2_50": [
      1.6069003318480948,
      8.307119578443924
    ],
    "pth_visde_50": [
      1.531125828461038,
      6.313184747174329
    ],
    "pth_val_50": [
      28.31012739472157,
      188.92598061519251
    ],
    "pth_valab_50": [
      6.886180349848621,
      69.74169849852392
    ],
    "pth_valc1_50": [
      8.594774380878052,
      60.39374014623255
    ],
    "pth_valc2_50": [
      6.569740080797373,
      33.95598421280963
    ],
    "pth_valde_50": [
      6.259432583197524,
      25.815389877602083
    ],
    "rec_vis_20": [
      35.001053284583534,
      1230.7351362707461
    ],
    "rec_vis_30": [
      35.00318132943257,
      1230.7323223641908
    ],
    "rec_vis_40": [
      35.00317644859576,
      1230.7281460684887
    ],
    "rec_vis_50": [
      35.00111380695998,
      1230.7345060066082
    ],
    "rec_val_20": [
      143.6601200002538,
      5045.886622484514
    ],
    "rec_val_30": [
      143.66887280490465,
      5045.875048543071
    ],
    "rec_val_40": [
      143.66877518816847,
      5045.857942283084
    ],
    "rec_val_50": [
      143.66031279330778,
      5045.88406959644
    ],
    "prk_val_ann": [
      107.2012193306518,
      4899.6854217995
    ],
    "prk_valab_ann": [
      27.175387013752733,
      1857.6329698173506
    ],
    "prk_valc1_ann": [
      35.0708409535398,
      1594.1523392985605
    ],
    "prk_valc2_ann": [
      21.77850860174275,
      684.6797239570402
    ],
    "prk_valde_ann": [
      23.176482761616512,
      763.2203950928525
    ],
    "pth_val_ann": [
      28.31112210926339,
      188.93207751806744
    ],
    "pth_valab_ann": [
      6.886562519370821,
      69.74405705397484
    ],
    "pth_valc1_ann": [
      8.595044291153629,
      60.39572888780725
    ],
    "pth_valc2_ann": [
      6.569980706052092,
      33.95710635191044
    ],
    "pth_valde_ann": [
      6.259534104603166,
      25.811196322791268
    ],
    "rec_val_ann": [
      143.66425699753373,
      5045.877461372448
    ],
    "sr_bird_20": [
      0.000006789537492462553,
      0.00007639565308733932
    ],
    "sr_herp_20": [
      4.2434609327890955e-7,
      0.000006366304423944944
    ],
    "sr_invert_20": [
      0.000010608652331972738,
      0.00007639565308733932
    ],
    "sr_lichen_20": [
      6.405944716697095e-7,
      0.000012732608847889888
    ],
    "sr_mammal_20": [
      0.000005940845305904733,
      0.00004456413096761461
    ],
    "sr_plant_20": [
      0.000015276459358040742,
      0.00014005869732678877
    ],
    "sr_100_20": [
      0.000040312878861496406,
      0.0003565130477409169
    ],
    "sr_bird_30": [
      0.000006789537492462553,
      0.00007639565308733932
    ],
    "sr_herp_30": [
      4.2434609327890955e-7,
      0.000006366304423944944
    ],
    "sr_invert_30": [
      0.000010184306238693828,
      0.00007002934866339438
    ],
    "sr_lichen_30": [
      6.405944716697095e-7,
      0.000006366304423944944
    ],
    "sr_mammal_30": [
      0.000005940845305904733,
      0.0000572967398155045
    ],
    "sr_plant_30": [
      0.000015276459358040742,
      0.00014005869732678877
    ],
    "sr_100_30": [
      0.0000398885327682175,
      0.0003565130477409169
    ],
    "sr_bird_40": [
      0.000006365191399183643,
      0.00006366304423944944
    ],
    "sr_herp_40": [
      4.2434609327890955e-7,
      0.000006366304423944944
    ],
    "sr_invert_40": [
      0.000010184306238693828,
      0.00009549456635917416
    ],
    "sr_lichen_40": [
      7.689988864896124e-7,
      0.000012732608847889888
    ],
    "sr_mammal_40": [
      0.000005940845305904733,
      0.0000572967398155045
    ],
    "sr_plant_40": [
      0.000015276459358040742,
      0.00014642500175073372
    ],
    "sr_100_40": [
      0.0000398885327682175,
      0.00038197826543669665
    ],
    "sr_bird_50": [
      0.000006789537492462553,
      0.00007002934866339438
    ],
    "sr_herp_50": [
      4.2434609327890955e-7,
      0.000006366304423944944
    ],
    "sr_invert_50": [
      0.000010608652331972738,
      0.000114593479631009
    ],
    "sr_lichen_50": [
      6.405944716697095e-7,
      0.000012732608847889888
    ],
    "sr_mammal_50": [
      0.000005940845305904733,
      0.0000572967398155045
    ],
    "sr_plant_50": [
      0.000015276459358040742,
      0.00016552391502256856
    ],
    "sr_100_50": [
      0.000040737224954775314,
      0.00042654239640431125
    ]
  },
  "countries": {
    "tot_area": [
      1,
      1
    ],
    "wood_ha": [
      0.09608230505802734,
      0.14615128934625585
    ],
    "sngrass_ha": [
      0.046222500755309495,
      0.05751271548688856
    ],
    "urban_ha": [
      0.0927017335268097,
      0.16339555078411655
    ],
    "water_ha": [
      0.015400270678958201,
      0.021721188054249524
    ],
    "farm_ha": [
      0.6676091579920094,
      0.6932032883173754
    ],
    "arable_ha_20": [
      0.09638578915077832,
      0.35512104884081214
    ],
    "arable_ha_30": [
      0.10383589845711867,
      0.36610263377668184
    ],
    "arable_ha_40": [
      0.11274098521643339,
      0.37724320090531055
    ],
    "arable_ha_50": [
      0.11830367492845914,
      0.38287544814601593
    ],
    "grass_ha_20": [
      0.31248810915119724,
      0.5968174991665971
    ],
    "grass_ha_30": [
      0.30150652421532753,
      0.5893673898602567
    ],
    "grass_ha_40": [
      0.2903659570866988,
      0.580462303100942
    ],
    "grass_ha_50": [
      0.28473370984599344,
      0.5748996133889163
    ],
    "wheat_ha_20": [
      0.03810566914076285,
      0.1989673338307929
    ],
    "wheat_ha_30": [
      0.04281079582532266,
      0.21300888200077583
    ],
    "wheat_ha_40": [
      0.04863412222298689,
      0.22472669578946589
    ],
    "wheat_ha_50": [
      0.053027363435406275,
      0.23055259399638764
    ],
    "osr_ha_20": [
      0.009568392481754211,
      0.056059329467314685
    ],
    "osr_ha_30": [
      0.012205508610040175,
      0.05908323408850004
    ],
    "osr_ha_40": [
      0.014896802026913911,
      0.0614871930925596
    ],
    "osr_ha_50": [
      0.016962860248463878,
      0.06264423445171141
    ],
    "wbar_ha_20": [
      0.007523321858485994,
      0.015743097748336515
    ],
    "wbar_ha_30": [
      0.007785910878848357,
      0.012955620263735939
    ],
    "wbar_ha_40": [
      0.008028976551971883,
      0.011539759909864278
    ],
    "wbar_ha_50": [
      0.00789719395810973,
      0.010683155516241973
    ],
    "sbar_ha_20": [
      0.007508679348056865,
      0.012738882519649242
    ],
    "sbar_ha_30": [
      0.007774196870505054,
      0.010503094091514443
    ],
    "sbar_ha_40": [
      0.008018726794671492,
      0.009483183560113954
    ],
    "sbar_ha_50": [
      0.007887920368171283,
      0.009003534516199969
    ],
    "pot_ha_20": [
      0.0068665791170751354,
      0.006991310646227674
    ],
    "pot_ha_30": [
      0.00680141108857169,
      0.007311493540944608
    ],
    "pot_ha_40": [
      0.006735470927029104,
      0.007567737473454348
    ],
    "pot_ha_50": [
      0.006724892704392881,
      0.007498429590756476
    ],
    "sb_ha_20": [
      0.000003904669447767481,
      0.0102167871606012
    ],
    "sb_ha_30": [
      0.000004392753128738416,
      0.009770803117193735
    ],
    "sb_ha_40": [
      0.000004392753128738416,
      0.00951599921427742
    ],
    "sb_ha_50": [
      0.000004392753128738416,
      0.009433998685520714
    ],
    "other_ha_20": [
      0.026684511006042966,
      0.05452903899704242
    ],
    "other_ha_30": [
      0.025943599978329086,
      0.05397958912639015
    ],
    "other_ha_40": [
      0.025590227393306127,
      0.053754898412000304
    ],
    "other_ha_50": [
      0.025025514574422755,
      0.05383303827556131
    ],
    "pgrass_ha_20": [
      0.1912130333586181,
      0.35692827463883026
    ],
    "pgrass_ha_30": [
      0.18209182576725316,
      0.3515608183991929
    ],
    "pgrass_ha_40": [
      0.17227145170894662,
      0.34466663640547845
    ],
    "pgrass_ha_50": [
      0.16664244742700562,
      0.34012794625612974
    ],
    "tgrass_ha_20": [
      0.048652334436145216,
      0.056605016816923225
    ],
    "tgrass_ha_30": [
      0.046793732997630476,
      0.05788086755898125
    ],
    "tgrass_ha_40": [
      0.04517155869570052,
      0.05863837343184814
    ],
    "tgrass_ha_50": [
      0.044463358272200985,
      0.059191860326069184
    ],
    "rgraz_ha_20": [
      0.0726227413564339,
      0.1832842077108436
    ],
    "rgraz_ha_30": [
      0.07262096545044389,
      0.1799257039020826
    ],
    "rgraz_ha_40": [
      0.07292294668205168,
      0.17715729326361546
    ],
    "rgraz_ha_50": [
      0.07362790414678681,
      0.1755798068067174
    ],
    "dairy_20": [
      0.08202106749554634,
      0.10796508639813279
    ],
    "dairy_30": [
      0.07239202800433878,
      0.10244730038475637
    ],
    "dairy_40": [
      0.06340764238750948,
      0.09566049680085552
    ],
    "dairy_50": [
      0.058011204576957576,
      0.08994552498036683
    ],
    "beef_20": [
      0.17142612045769576,
      0.2558998335146564
    ],
    "beef_30": [
      0.15674385629183415,
      0.2466760281116677
    ],
    "beef_40": [
      0.14575686642469046,
      0.2352480368054142
    ],
    "beef_50": [
      0.13979051721794908,
      0.22463221674429637
    ],
    "sheep_20": [
      0.7459790399853727,
      3.0133446959214263
    ],
    "sheep_30": [
      0.6520170894661287,
      2.6790425164813656
    ],
    "sheep_40": [
      0.5823011973621465,
      2.376324720120615
    ],
    "sheep_50": [
      0.5367251181672403,
      2.122063383522978
    ],
    "livestock_20": [
      0.9994262279386148,
      3.3772096158342158
    ],
    "livestock_30": [
      0.8811529737623016,
      3.02816584497779
    ],
    "livestock_40": [
      0.7914657061743464,
      2.707233253726885
    ],
    "livestock_50": [
      0.734526839962147,
      2.4366411252476414
    ],
    "wheat_food_20": [
      0.3120846102822637,
      1.6295424586692626
    ],
    "wheat_food_30": [
      0.3506197930622809,
      1.7445427953192678
    ],
    "wheat_food_40": [
      0.39831435419939876,
      1.8405115196072375
    ],
    "wheat_food_50": [
      0.43429344274217124,
      1.8882256351875233
    ],
    "osr_food_20": [
      0.03377734305791259,
      0.197889436108153
    ],
    "osr_food_30": [
      0.04308509885402832,
      0.20856386652105266
    ],
    "osr_food_40": [
      0.05258662387148952,
      0.21704976304781295
    ],
    "osr_food_50": [
      0.05987908214887626,
      0.2211342696115615
    ],
    "wbar_food_20": [
      0.05070750169975142,
      0.10610845257126479
    ],
    "wbar_food_30": [
      0.05247826929431397,
      0.08732106588950962
    ],
    "wbar_food_40": [
      0.054115790043971455,
      0.07777835087207793
    ],
    "wbar_food_50": [
      0.05322747774460436,
      0.07200472607190597
    ],
    "sbar_food_20": [
      0.0418243787060804,
      0.07095555169832206
    ],
    "sbar_food_30": [
      0.043300831841017476,
      0.05850235840315475
    ],
    "sbar_food_40": [
      0.04466307339460736,
      0.05282131235437571
    ],
    "sbar_food_50": [
      0.043936804877322606,
      0.050149654825646185
    ],
    "pot_food_20": [
      0.25474985360357577,
      0.25936913231899783
    ],
    "pot_food_30": [
      0.25233130128507647,
      0.2712612912058547
    ],
    "pot_food_40": [
      0.24988742300289335,
      0.2807681851438065
    ],
    "pot_food_50": [
      0.249494330072667,
      0.2781847582204274
    ],
    "sb_food_20": [
      0.0002293993300563395,
      0.620161351096923
    ],
    "sb_food_30": [
      0.00025282734674294437,
      0.593088899691888
    ],
    "sb_food_40": [
      0.0002542915977858572,
      0.5776201408123581
    ],
    "sb_food_50": [
      0.0002533154304239153,
      0.5726427396021476
    ],
    "food_20": [
      0.6979923653950623,
      2.8794071037475013
    ],
    "food_30": [
      0.7609981116042384,
      2.944350287109949
    ],
    "food_40": [
      0.8307023182510596,
      3.0156685096967557
    ],
    "food_50": [
      0.8697748811638257,
      3.0536513553714517
    ],
    "arable_profit_ann": [
      52.65294224164145,
      158.73967372437446
    ],
    "livestock_profit_ann": [
      63.722007629292136,
      106.68338792549305
    ],
    "farm_profit_ann": [
      159.3363301671345,
      222.4616813536666
    ],
    "arable_profit_flow_20": [
      49.07219733808922,
      154.2215255866358
    ],
    "arable_profit_flow_30": [
      52.47405615597983,
      158.81509899980975
    ],
    "arable_profit_flow_40": [
      56.35655879529234,
      163.28326657985832
    ],
    "arable_profit_flow_50": [
      58.43143376045536,
      165.61100786834453
    ],
    "livestock_profit_flow_20": [
      71.45317522725419,
      114.45474463705854
    ],
    "livestock_profit_flow_30": [
      63.38829767520008,
      107.252431022794
    ],
    "livestock_profit_flow_40": [
      56.214786718323396,
      99.36406796272408
    ],
    "livestock_profit_flow_50": [
      51.91709059344292,
      92.65790019567275
    ],
    "farm_profit_flow_20": [
      163.52694197514776,
      225.67470081388998
    ],
    "farm_profit_flow_30": [
      159.72648717877382,
      222.20339667500983
    ],
    "farm_profit_flow_40": [
      155.7206267580164,
      219.49805329818173
    ],
    "farm_profit_flow_50": [
      151.08933395612812,
      217.52809846178744
    ],
    "ghg_arable_20": [
      -0.7959212226634019,
      -0.17760291366434192
    ],
    "ghg_arable_30": [
      -0.8237128387810922,
      -0.19533889846346375
    ],
    "ghg_arable_40": [
      -0.8508591061046691,
      -0.21584475815209567
    ],
    "ghg_arable_50": [
      -0.8641045851112984,
      -0.22934417660038978
    ],
    "ghg_grass_20": [
      -0.625081448964262,
      -0.3730926769667155
    ],
    "ghg_grass_30": [
      -0.619271300825984,
      -0.35637630552254257
    ],
    "ghg_grass_40": [
      -0.6103832969955033,
      -0.33908315069813183
    ],
    "ghg_grass_50": [
      -0.6046317188989417,
      -0.32960830617484055
    ],
    "ghg_livestock_20": [
      -2.041393888899464,
      -1.0362778987109702
    ],
    "ghg_livestock_30": [
      -1.8933771437245372,
      -0.9275546176026567
    ],
    "ghg_livestock_40": [
      -1.7438156136993375,
      -0.836461990670162
    ],
    "ghg_livestock_50": [
      -1.6163022877946378,
      -0.7819035334043284
    ],
    "ghg_farm_20": [
      -2.844078251528068,
      -2.205291798341088
    ],
    "ghg_farm_30": [
      -2.707987343013985,
      -2.1076437619062913
    ],
    "ghg_farm_40": [
      -2.5700436688469366,
      -2.026404247472963
    ],
    "ghg_farm_50": [
      -2.4502781832939693,
      -1.9756164246904673
    ],
    "ghg_arable_ann": [
      -6.9168438197236135,
      -1.6817499166597114
    ],
    "ghg_grass_ann": [
      -5.132421983484225,
      -2.9317571833080898
    ],
    "ghg_livestock_ann": [
      -15.380801911726161,
      -7.573482357068909
    ],
    "ghg_farm_ann": [
      -22.1949738118701,
      -17.42208336010061
    ],
    "ghg_arable_flow_20": [
      -5.062992620878972,
      -1.1306492635549379
    ],
    "ghg_arable_flow_30": [
      -6.581310782312841,
      -1.5632602818488024
    ],
    "ghg_arable_flow_40": [
      -8.52882117831208,
      -2.1653271210042417
    ],
    "ghg_arable_flow_50": [
      -10.872531413460564,
      -2.888242503400723
    ],
    "ghg_grass_flow_20": [
      -3.974695789643743,
      -2.371386571803431
    ],
    "ghg_grass_flow_30": [
      -4.941563205128393,
      -2.8410396586060096
    ],
    "ghg_grass_flow_40": [
      -6.115423493127049,
      -3.395966500544817
    ],
    "ghg_grass_flow_50": [
      -7.6043447256945305,
      -4.144044043703966
    ],
    "ghg_livestock_flow_20": [
      -12.965195240793644,
      -6.578294599022048
    ],
    "ghg_livestock_flow_30": [
      -15.089150924747747,
      -7.385854337411019
    ],
    "ghg_livestock_flow_40": [
      -17.449783754525146,
      -8.370526415597828
    ],
    "ghg_livestock_flow_50": [
      -20.302533788813026,
      -9.824095662341898
    ],
    "ghg_farm_flow_20": [
      -18.070540293992323,
      -14.012673791704449
    ],
    "ghg_farm_flow_30": [
      -21.59397441172494,
      -16.80820477832987
    ],
    "ghg_farm_flow_40": [
      -25.73053436865644,
      -20.295314094454724
    ],
    "ghg_farm_flow_50": [
      -30.79512101790828,
      -24.84067111950643
    ],
    "nfwood_ha": [
      0.07350505778025959,
      0.11305335877225478
    ],
    "fwood_ha": [
      0.02257724727776776,
      0.03309793057400105
    ],
    "broad_ha": [
      0.06189828433705302,
      0.06634360105553674
    ],
    "conif_ha": [
      0.029738704002490592,
      0.08425300500920281
    ],
    "wood_mgmt_ha": [
      0.0001932811376644903,
      0.016624255972603485
    ],
    "wood_nmgmt_ha": [
      0.07945804908542385,
      0.14595800820859134
    ],
    "broad_mgmt_ha": [
      0.00010835457717554759,
      0.0065468388255671165
    ],
    "conif_mgmt_ha": [
      0.00008492656048894271,
      0.010077417147036367
    ],
    "broad_nmgmt_ha": [
      0.05979676222996964,
      0.061789929759877474
    ],
    "conif_nmgmt_ha": [
      0.019661286855454225,
      0.08416807844871388
    ],
    "broad_yc_20": [
      3.8606651957017513e-7,
      0.0000019523347238837406
    ],
    "broad_yc_30": [
      3.8606651957017513e-7,
      0.0000019523347238837406
    ],
    "broad_yc_40": [
      4.632798234842102e-7,
      0.0000019523347238837406
    ],
    "broad_yc_50": [
      4.632798234842102e-7,
      0.0000019523347238837406
    ],
    "conif_yc_20": [
      8.493463430543854e-7,
      0.000007809338895534962
    ],
    "conif_yc_30": [
      8.493463430543854e-7,
      0.000007321255214564027
    ],
    "conif_yc_40": [
      7.721330391403503e-7,
      0.000007321255214564027
    ],
    "conif_yc_50": [
      7.721330391403503e-7,
      0.000007321255214564027
    ],
    "broad_rp": [
      0.000011581995587105254,
      0.00007321255214564026
    ],
    "conif_rp": [
      0.000004864438146584207,
      0.000028308853496314237
    ],
    "timber_broad_yr": [
      0.000872693621576032,
      0.06089156966616674
    ],
    "timber_conif_yr": [
      0.0024945956934424494,
      0.18603896986333862
    ],
    "timber_mixed_yr": [
      0.0015218449172673756,
      0.11095049885971393
    ],
    "timber_current_yr": [
      0.0016048191430324346,
      0.14717110529917993
    ],
    "timber_broad_50": [
      0.00728123235272441,
      0.5173590177726495
    ],
    "timber_conif_40": [
      0.017829696865868258,
      1.093501990867828
    ],
    "timber_conif_50": [
      0.017262543628580033,
      1.3043675087652542
    ],
    "timber_mixed_40": [
      0.008814303194654117,
      0.5409171828633411
    ],
    "timber_mixed_50": [
      0.01127375686306666,
      0.832162367841709
    ],
    "timber_current_40": [
      0.009495668013289542,
      0.8364165892474607
    ],
    "timber_current_50": [
      0.011783316226000316,
      1.0799682745976877
    ],
    "timber_broad_ann": [
      -3.832503496218401,
      -0.04500082730183925
    ],
    "timber_conif_ann": [
      -0.8109426848733579,
      -0.006993262980951558
    ],
    "timber_mixed_ann": [
      -2.6238791716803838,
      -0.02979799680695656
    ],
    "timber_current_ann": [
      -1.920444198871821,
      -0.028066763990552652
    ],
    "timber_broad_flow_20": [
      -10.824841234004491,
      -0.1286456800445523
    ],
    "timber_broad_flow_30": [
      -0.4987269070450654,
      -0.005799410297296651
    ],
    "timber_broad_flow_40": [
      -0.29923614422703926,
      -0.0034795485616417963
    ],
    "timber_broad_flow_50": [
      -0.23206736459257318,
      -0.0028997051486483257
    ],
    "timber_conif_flow_20": [
      -4.783596203452732,
      -0.05839530775872462
    ],
    "timber_conif_flow_30": [
      -0.4987269070450654,
      -0.005799410297296651
    ],
    "timber_conif_flow_40": [
      -0.006088886720052975,
      0.001556986942297283
    ],
    "timber_conif_flow_50": [
      0.021423457008857255,
      1.339126004081804
    ],
    "timber_mixed_flow_20": [
      -8.408343175455805,
      -0.1005457263636936
    ],
    "timber_mixed_flow_30": [
      -0.4987269070450654,
      -0.005799410297296651
    ],
    "timber_mixed_flow_40": [
      -0.18197724122424472,
      -0.0014647391265937763
    ],
    "timber_mixed_flow_50": [
      0.006829754947826295,
      0.3964100137624993
    ],
    "timber_current_flow_20": [
      -7.1627183901087905,
      -0.09774705453700626
    ],
    "timber_current_flow_30": [
      -0.4987269070450654,
      -0.005799410297296651
    ],
    "timber_current_flow_40": [
      -0.09340910326321954,
      -0.0012158164492985994
    ],
    "timber_current_flow_50": [
      0.008332564601535804,
      0.8718980327285576
    ],
    "ghg_broad_yr": [
      0.0002518511793810025,
      0.01760200804006691
    ],
    "ghg_conif_yr": [
      0.00018840030085478095,
      0.014250410157070391
    ],
    "ghg_mixed_yr": [
      0.0002264708279705139,
      0.01626135344420752
    ],
    "ghg_current_yr": [
      0.00022500657692760108,
      0.017237715672200494
    ],
    "ghg_broad_30": [
      0.000011225924662331507,
      0.0006814846203452732
    ],
    "ghg_broad_40": [
      0.000028308853496314237,
      0.0019436132861240898
    ],
    "ghg_broad_50": [
      0.000022451849324663014,
      0.0017393068839675532
    ],
    "ghg_conif_20": [
      0.0000019523347238837406,
      0.00011597438247888062
    ],
    "ghg_conif_30": [
      0.000013666343067186183,
      0.0009559007024557537
    ],
    "ghg_conif_40": [
      0.00003074927190116891,
      0.0022692217887295757
    ],
    "ghg_conif_50": [
      0.00003123735558213985,
      0.0024607107824363822
    ],
    "ghg_mixed_30": [
      0.000012202092024273377,
      0.000791281938511031
    ],
    "ghg_mixed_40": [
      0.000029285020858256106,
      0.002073872129827067
    ],
    "ghg_mixed_50": [
      0.000025868435091459562,
      0.002027853000694302
    ],
    "ghg_current_30": [
      0.000012690175705244313,
      0.0010064754165194467
    ],
    "ghg_current_40": [
      0.000029285020858256106,
      0.00233168735159603
    ],
    "ghg_current_50": [
      0.000026844602453401432,
      0.002330220298821663
    ],
    "ghg_broad_ann": [
      0.0046743774126586455,
      0.3234886113465259
    ],
    "ghg_conif_ann": [
      0.002406740630867681,
      0.18209113084751793
    ],
    "ghg_mixed_ann": [
      0.003767029849733677,
      0.2669296345895835
    ],
    "ghg_current_ann": [
      0.003692841130226095,
      0.2665561538385513
    ],
    "ghg_broad_flow_20": [
      0.0002972429617112995,
      0.01669397958603786
    ],
    "ghg_broad_flow_30": [
      0.003060772763368734,
      0.1818642009473146
    ],
    "ghg_broad_flow_40": [
      0.007318814796159172,
      0.508830113435609
    ],
    "ghg_broad_flow_50": [
      0.008273994559819291,
      0.6127610736231941
    ],
    "ghg_conif_flow_20": [
      0.0004270732208495682,
      0.027344165021508538
    ],
    "ghg_conif_flow_30": [
      0.0038465874897319397,
      0.2605011637589166
    ],
    "ghg_conif_flow_40": [
      0.007560416218239785,
      0.5781022606819973
    ],
    "ghg_conif_flow_50": [
      0.009991561033156012,
      0.7708974718511179
    ],
    "ghg_mixed_flow_20": [
      0.0003489798318942186,
      0.020954069202886914
    ],
    "ghg_mixed_flow_30": [
      0.0033750986539140162,
      0.2133189706292946
    ],
    "ghg_mixed_flow_40": [
      0.007415455364991417,
      0.5365389568915035
    ],
    "ghg_mixed_flow_50": [
      0.008960728298945397,
      0.6760156020290421
    ],
    "ghg_current_flow_20": [
      0.0003655746770472304,
      0.027305095089728035
    ],
    "ghg_current_flow_30": [
      0.003445870787654802,
      0.26959550112051944
    ],
    "ghg_current_flow_40": [
      0.007404229440329086,
      0.5985414715743854
    ],
    "ghg_current_flow_50": [
      0.009069082876120946,
      0.76817415862207
    ],
    "fert_nitr_20": [
      8.754332840856899,
      36.07567451998033
    ],
    "fert_nitr_30": [
      9.721960690716502,
      37.555078180014476
    ],
    "fert_nitr_40": [
      10.825849302211166,
      38.96822556723981
    ],
    "fert_nitr_50": [
      11.558858743213806,
      39.662934046866624
    ],
    "fert_phos_20": [
      5.995012272864158,
      20.647035132670986
    ],
    "fert_phos_30": [
      6.501574801996653,
      21.32540025832483
    ],
    "fert_phos_40": [
      7.082967880677207,
      22.024658223031555
    ],
    "fert_phos_50": [
      7.4242677158513475,
      22.37165589180748
    ],
    "pest_20": [
      0.49561920492144534,
      1.9148759614600603
    ],
    "pest_30": [
      0.5469431563102631,
      1.9961322311803382
    ],
    "pest_40": [
      0.605333583232178,
      2.0729114418997683
    ],
    "pest_50": [
      0.6425533804919786,
      2.110801168329944
    ],
    "tot_fert_pest_20": [
      15.244964318642502,
      58.63758561411138
    ],
    "tot_fert_pest_30": [
      16.770478649023417,
      60.87661066951965
    ],
    "tot_fert_pest_40": [
      18.51415076612055,
      63.06579523217114
    ],
    "tot_fert_pest_50": [
      19.625679839557133,
      64.14539110700404
    ],
    "prk_area": [
      2118.4095608292587,
      3612.6710272062724
    ],
    "pth_len": [
      5.7010555785768355,
      8.005060868791741
    ],
    "prk_vis_20": [
      26.10523377011942,
      102.94637165419311
    ],
    "prk_viscar_20": [
      9.048784451996726,
      37.59080199605656
    ],
    "prk_viswlk_20": [
      17.056449318122695,
      65.35556965813656
    ],
    "prk_visab_20": [
      6.609696075172696,
      30.54038811730492
    ],
    "prk_visc1_20": [
      8.537558771376235,
      33.22363381868587
    ],
    "prk_visc2_20": [
      5.307509801940523,
      19.41441746886142
    ],
    "prk_visde_20": [
      5.650469121629965,
      19.76793224934091
    ],
    "prk_val_20": [
      107.19630188756602,
      422.6291096781008
    ],
    "prk_valab_20": [
      27.17353473618345,
      125.5723259334162
    ],
    "prk_valc1_20": [
      35.069240039066216,
      136.3817707574069
    ],
    "prk_valc2_20": [
      21.77772473935111,
      79.63906996266583
    ],
    "prk_valde_20": [
      23.175802861048922,
      81.0359430246119
    ],
    "pth_vis_20": [
      6.924413408830117,
      33.61788355863146
    ],
    "pth_viscar_20": [
      3.3344237122766223,
      18.736711049903267
    ],
    "pth_viswlk_20": [
      3.589989208469814,
      14.881172431514887
    ],
    "pth_visab_20": [
      1.6841488479516835,
      10.529797849393288
    ],
    "pth_visc1_20": [
      2.1021749496907747,
      10.5384820296845
    ],
    "pth_visc2_20": [
      1.6069574376387683,
      6.847632362134101
    ],
    "pth_visde_20": [
      1.5311321735488905,
      5.701971240206264
    ],
    "pth_val_20": [
      28.310843901565235,
      137.44152582445278
    ],
    "pth_valab_20": [
      6.886482961730823,
      43.054430978101074
    ],
    "pth_valc1_20": [
      8.594926662986516,
      43.08465350066589
    ],
    "pth_valc2_20": [
      6.569975825215281,
      27.994272471542264
    ],
    "pth_valde_20": [
      6.259458939716296,
      23.308168951356855
    ],
    "prk_vis_30": [
      26.10703382273484,
      102.94622023890413
    ],
    "prk_viscar_30": [
      9.04934916481561,
      37.59071304633045
    ],
    "prk_viswlk_30": [
      17.05768514600291,
      65.35550719257368
    ],
    "prk_visab_30": [
      6.610421367522619,
      30.540281794585432
    ],
    "prk_visc1_30": [
      8.538146912211804,
      33.22360818386897
    ],
    "prk_visc2_30": [
      5.307782152634505,
      19.414403184400193
    ],
    "prk_visde_30": [
      5.650683390365911,
      19.767927076049546
    ],
    "prk_val_30": [
      107.20372466418623,
      422.6284975310274
    ],
    "prk_valab_30": [
      27.176533522319335,
      125.57189253514132
    ],
    "prk_valc1_30": [
      35.07166483879328,
      136.38166760043288
    ],
    "prk_valc2_30": [
      21.778843427147898,
      79.63901328810076
    ],
    "prk_valde_30": [
      23.17668287592571,
      81.03592410735244
    ],
    "pth_vis_30": [
      6.92475653165784,
      33.61710393590184
    ],
    "pth_viscar_30": [
      3.3346043032385815,
      18.736502419556093
    ],
    "pth_viswlk_30": [
      3.590152228419258,
      14.880601516345747
    ],
    "pth_visab_30": [
      1.684261107198307,
      10.529451316085323
    ],
    "pth_visc1_30": [
      2.1022833042679503,
      10.53818529895756
    ],
    "pth_visc2_30": [
      1.6070238170193802,
      6.847538470756542
    ],
    "pth_visde_30": [
      1.5311883031722022,
      5.701928850102416
    ],
    "pth_val_30": [
      28.312250558733794,
      137.4383344441754
    ],
    "pth_valab_30": [
      6.886943224641978,
      43.05301434561416
    ],
    "pth_valc1_30": [
      8.59537130721988,
      43.08343576964986
    ],
    "pth_valc2_30": [
      6.570247199741901,
      27.993888644208507
    ],
    "pth_valde_30": [
      6.2596888271300335,
      23.307995607489566
    ],
    "prk_vis_40": [
      26.107976800406476,
      102.94609384072564
    ],
    "prk_viscar_40": [
      9.049619075091186,
      37.590633979907246
    ],
    "prk_viswlk_40": [
      17.05835821339897,
      65.35545986081839
    ],
    "prk_visab_40": [
      6.610649790685313,
      30.54007910966266
    ],
    "prk_visc1_40": [
      8.538468559357565,
      33.22357691248088
    ],
    "prk_visc2_40": [
      5.307959327010697,
      19.4144604766717
    ],
    "prk_visde_40": [
      5.6508991233529,
      19.76797734191039
    ],
    "prk_val_40": [
      107.20766349949166,
      422.627944838198
    ],
    "prk_valab_40": [
      27.17749699950557,
      125.57103762944038
    ],
    "prk_valc1_40": [
      35.07300853316699,
      136.38153139616477
    ],
    "prk_valc2_40": [
      21.77958433817561,
      79.63924608621205
    ],
    "prk_valde_40": [
      23.177573628643483,
      81.03612972638076
    ],
    "pth_vis_40": [
      6.924401694821774,
      33.6185197190424
    ],
    "pth_viscar_40": [
      3.3346208980837346,
      18.736794054204974
    ],
    "pth_viswlk_40": [
      3.5897807967380393,
      14.881725742050737
    ],
    "pth_visab_40": [
      1.684142502863831,
      10.52989513815622
    ],
    "pth_visc1_40": [
      2.102195449205375,
      10.5386989990685
    ],
    "pth_visc2_40": [
      1.606912045856438,
      6.847820299315829
    ],
    "pth_visde_40": [
      1.5311516968961294,
      5.70210528250186
    ],
    "pth_val_40": [
      28.310789236192967,
      137.44415926139607
    ],
    "pth_valab_40": [
      6.886456117128369,
      43.0548439148504
    ],
    "pth_valc1_40": [
      8.59500963721228,
      43.08555064204406
    ],
    "pth_valc2_40": [
      6.569786448747065,
      27.995045531141052
    ],
    "pth_valde_40": [
      6.259537033105252,
      23.308719173360544
    ],
    "prk_vis_50": [
      26.106327565648474,
      102.94563241402145
    ],
    "prk_viscar_50": [
      9.049271559510334,
      37.59024412993578
    ],
    "prk_viswlk_50": [
      17.05705600613814,
      65.35538828408566
    ],
    "prk_visab_50": [
      6.610118267556736,
      30.539885304269834
    ],
    "prk_visc1_50": [
      8.537886763609848,
      33.22342379849922
    ],
    "prk_visc2_50": [
      5.307698690325059,
      19.414394768150068
    ],
    "prk_visde_50": [
      5.650623844156833,
      19.767928543102318
    ],
    "prk_val_50": [
      107.20094600379046,
      422.6260673967133
    ],
    "prk_valab_50": [
      27.175328443711017,
      125.57024086535729
    ],
    "prk_valc1_50": [
      35.070639374979564,
      136.38090905693522
    ],
    "prk_valc2_50": [
      21.778525684671585,
      79.63898479639161
    ],
    "prk_valde_50": [
      23.176452500428294,
      81.03593267802917
    ],
    "pth_vis_50": [
      6.9242391629560105,
      33.61862689110824
    ],
    "pth_viscar_50": [
      3.3346082079080293,
      18.736722863538766
    ],
    "pth_viswlk_50": [
      3.5896309550479812,
      14.881904027569474
    ],
    "pth_visab_50": [
      1.684075147315857,
      10.529888729451995
    ],
    "pth_visc1_50": [
      2.1021378553310206,
      10.538737991786975
    ],
    "pth_visc2_50": [
      1.6069003318480948,
      6.847870951243196
    ],
    "pth_visde_50": [
      1.531125828461038,
      5.702129218626073
    ],
    "pth_val_50": [
      28.31012739472157,
      137.4446529632613
    ],
    "pth_valab_50": [
      6.886180349848621,
      43.05483696565305
    ],
    "pth_valc1_50": [
      8.594774380878052,
      43.08572823264306
    ],
    "pth_valc2_50": [
      6.569740080797373,
      27.99526443085765
    ],
    "pth_valde_50": [
      6.259432583197524,
      23.30882325689422
    ],
    "rec_vis_20": [
      35.001053284583534,
      138.814024885539
    ],
    "rec_vis_30": [
      35.00318132943257,
      138.81273897517562
    ],
    "rec_vis_40": [
      35.00317644859576,
      138.8143582925853
    ],
    "rec_vis_50": [
      35.00111380695998,
      138.81420718614953
    ],
    "rec_val_20": [
      143.6601200002538,
      569.3639061469203
    ],
    "rec_val_30": [
      143.66887280490465,
      569.3585907830789
    ],
    "rec_val_40": [
      143.66877518816847,
      569.3652593872846
    ],
    "rec_val_50": [
      143.66031279330778,
      569.3647446834008
    ],
    "prk_val_ann": [
      107.2012193306518,
      422.6282905221596
    ],
    "prk_valab_ann": [
      27.175387013752733,
      125.57166483310807
    ],
    "prk_valc1_ann": [
      35.0708409535398,
      136.38157587102785
    ],
    "prk_valc2_ann": [
      21.77850860174275,
      79.63907691186317
    ],
    "prk_valde_ann": [
      23.176482761616512,
      81.03597290616051
    ],
    "pth_val_ann": [
      28.31112210926339,
      137.44159408101342
    ],
    "pth_valab_ann": [
      6.886562519370821,
      43.0541770235445
    ],
    "pth_valc1_ann": [
      8.595044291153629,
      43.0846419958836
    ],
    "pth_valc2_ann": [
      6.569980706052092,
      27.99445546707254
    ],
    "pth_valde_ann": [
      6.259534104603166,
      23.308319594512792
    ],
    "rec_val_ann": [
      143.66425699753373,
      569.3628198329475
    ],
    "sr_bird_20": [
      0.0000013126261665385956,
      0.000008297422576505897
    ],
    "sr_herp_20": [
      7.721330391403503e-8,
      4.880836809709351e-7
    ],
    "sr_invert_20": [
      0.000001930332597850876,
      0.000012202092024273377
    ],
    "sr_lichen_20": [
      3.8606651957017513e-7,
      0.0000014642510429128052
    ],
    "sr_mammal_20": [
      0.0000010809862547964905,
      0.000006833171533593092
    ],
    "sr_plant_20": [
      0.0000029341055487333313,
      0.000016594845153011795
    ],
    "sr_100_20": [
      0.000007721330391403504,
      0.0000458798660112679
    ],
    "sr_bird_30": [
      0.0000013126261665385956,
      0.000008297422576505897
    ],
    "sr_herp_30": [
      7.721330391403503e-8,
      4.880836809709351e-7
    ],
    "sr_invert_30": [
      0.000001930332597850876,
      0.000012202092024273377
    ],
    "sr_lichen_30": [
      3.0885321565614013e-7,
      0.0000019523347238837406
    ],
    "sr_mammal_30": [
      0.0000010809862547964905,
      0.000006833171533593092
    ],
    "sr_plant_30": [
      0.0000029341055487333313,
      0.00001708292883398273
    ],
    "sr_100_30": [
      0.000007644117087489467,
      0.00004685603337320977
    ],
    "sr_bird_40": [
      0.0000013126261665385956,
      0.000008297422576505897
    ],
    "sr_herp_40": [
      7.721330391403503e-8,
      4.880836809709351e-7
    ],
    "sr_invert_40": [
      0.000001930332597850876,
      0.000012202092024273377
    ],
    "sr_lichen_40": [
      3.8606651957017513e-7,
      0.0000019523347238837406
    ],
    "sr_mammal_40": [
      0.0000010809862547964905,
      0.000006833171533593092
    ],
    "sr_plant_40": [
      0.0000029341055487333313,
      0.000017571012514953665
    ],
    "sr_100_40": [
      0.000007721330391403504,
      0.000047344117054180706
    ],
    "sr_bird_50": [
      0.0000013126261665385956,
      0.000008297422576505897
    ],
    "sr_herp_50": [
      7.721330391403503e-8,
      4.880836809709351e-7
    ],
    "sr_invert_50": [
      0.000001930332597850876,
      0.000012202092024273377
    ],
    "sr_lichen_50": [
      3.8606651957017513e-7,
      0.0000019523347238837406
    ],
    "sr_mammal_50": [
      0.0000010809862547964905,
      0.000006833171533593092
    ],
    "sr_plant_50": [
      0.0000029341055487333313,
      0.000017571012514953665
    ],
    "sr_100_50": [
      0.000007721330391403504,
      0.000047344117054180706
    ]
  }
}
