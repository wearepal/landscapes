class RemoveUnusedIndexes < ActiveRecord::Migration[6.0]
  def change
    remove_index :map_tiles, column: [:map_tile_layer_id, :zoom, :x], name: "index_map_tiles_on_map_tile_layer_id_and_zoom_and_x"
    remove_index :map_tiles, column: [:map_tile_layer_id, :zoom, :y], name: "index_map_tiles_on_map_tile_layer_id_and_zoom_and_y"
    remove_index :map_tiles, column: [:map_tile_layer_id, :zoom], name: "index_map_tiles_on_map_tile_layer_id_and_zoom"
    remove_index :map_tiles, column: [:x], name: "index_map_tiles_on_x"
    remove_index :map_tiles, column: [:y], name: "index_map_tiles_on_y"
  end
end
