class IndexMapTilesByXAndY < ActiveRecord::Migration[6.0]
  def change
    add_index :map_tiles, :x
    add_index :map_tiles, :y
  end
end
