json.key_format! camelize: :lower

json.labels Label.order(:index), :label_schema_id, :id, :index, :label, :colour
json.labelling_groups LabellingGroup.order(:name), :label_schema_id, :region_id, :id, :name, :extent
json.labellings Labelling.includes(:map_tile_layer).order("map_tile_layers.name"), :labelling_group_id, :map_tile_layer_id, :id
json.label_schemas LabelSchema.order(:name), :id, :name
json.map_tile_layers MapTileLayer.order(:name), :region_id, :id, :name, :min_zoom, :max_zoom, :south_west_extent, :north_east_extent
json.overlays Overlay.order(:name), :region_id, :id, :name, :colour
json.regions Region.order(:name), :id, :name, :south_west_extent, :north_east_extent
