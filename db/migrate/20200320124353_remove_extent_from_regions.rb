class RemoveExtentFromRegions < ActiveRecord::Migration[6.0]
  def change
    remove_column :regions, :south_west_lat, :float, default: -90.0, null: false
    remove_column :regions, :south_west_lng, :float, default: -180.0, null: false
    remove_column :regions, :north_east_lat, :float, default: 90.0, null: false
    remove_column :regions, :north_east_lng, :float, default: 180.0, null: false
    remove_column :regions, :min_zoom, :integer
    remove_column :regions, :max_zoom, :integer
  end
end
