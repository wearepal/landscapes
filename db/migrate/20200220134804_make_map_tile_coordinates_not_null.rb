class MakeMapTileCoordinatesNotNull < ActiveRecord::Migration[6.0]
  def change
    change_column_null :map_tiles, :x, false
    change_column_null :map_tiles, :y, false
    change_column_null :map_tiles, :zoom, false
  end
end
