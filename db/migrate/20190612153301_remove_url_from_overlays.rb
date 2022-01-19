class RemoveUrlFromOverlays < ActiveRecord::Migration[6.0]
  def change
    remove_column :overlays, :url
  end
end
