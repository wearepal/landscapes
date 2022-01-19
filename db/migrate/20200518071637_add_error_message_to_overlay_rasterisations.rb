class AddErrorMessageToOverlayRasterisations < ActiveRecord::Migration[6.0]
  def change
    add_column :overlay_rasterisations, :error_message, :string
  end
end
