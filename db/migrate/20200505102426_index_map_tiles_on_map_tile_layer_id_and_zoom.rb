class IndexMapTilesOnMapTileLayerIdAndZoom < ActiveRecord::Migration[6.0]
  def change
    add_index :map_tiles, [:map_tile_layer_id, :zoom]
  end
end
