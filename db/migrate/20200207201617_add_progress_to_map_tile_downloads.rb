class AddProgressToMapTileDownloads < ActiveRecord::Migration[6.0]
  def change
    remove_column :map_tile_downloads, :message, :string
    add_column :map_tile_downloads, :progress, :float, null: false, default: 0
    add_column :map_tile_downloads, :status, :boolean
  end
end
