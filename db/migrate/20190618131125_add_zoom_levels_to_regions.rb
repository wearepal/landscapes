class AddZoomLevelsToRegions < ActiveRecord::Migration[6.0]
  def change
    add_column :regions, :min_zoom, :integer
    add_column :regions, :max_zoom, :integer
  end
end
