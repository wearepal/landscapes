class IndexTileCoordinates < ActiveRecord::Migration[6.0]
  def change
    add_index :map_tiles, :x
    add_index :map_tiles, :y
    add_index :map_tiles, :zoom
    add_index :map_tiles, :year
  end
end
