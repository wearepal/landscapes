class RemoveProgressFromMapTileUploads < ActiveRecord::Migration[6.0]
  def change
    remove_column :map_tile_uploads, :percent_complete, :integer, default: 0, null: false
    remove_column :map_tile_uploads, :status_flag, :boolean
  end
end
