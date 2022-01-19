class IndexMapTilesByYear < ActiveRecord::Migration[6.0]
  def change
    add_index :map_tiles, [:region_id, :year]
  end
end
