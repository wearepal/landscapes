class ReindexTileCoordinates < ActiveRecord::Migration[6.0]
  def change
    remove_index :map_tiles, :x
    remove_index :map_tiles, :y
    remove_index :map_tiles, :zoom
    remove_index :map_tiles, :year

    add_index :map_tiles, [:region_id, :zoom, :x]
    add_index :map_tiles, [:region_id, :zoom, :y]
  end
end
