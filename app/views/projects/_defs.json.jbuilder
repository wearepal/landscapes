json.key_format! camelize: :lower

json.map_tile_layers @team.map_tile_layers.order(:name), :id, :name, :min_zoom, :max_zoom, :south_west_extent, :north_east_extent
