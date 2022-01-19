class IndexTileCoordinatesByLayer < ActiveRecord::Migration[6.0]
  def change
    add_index :map_tiles, [:map_tile_layer_id, :zoom, :x]
    add_index :map_tiles, [:map_tile_layer_id, :zoom, :y]
  end
end
