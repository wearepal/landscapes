class ChangeMapTileYearToString < ActiveRecord::Migration[6.0]
  def up
    change_column :map_tiles, :year, :string
  end

  def down
    # TODO: can't automatically cast back to integer
    change_column :map_tiles, :year, :integer
  end
end
