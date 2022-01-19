class DeleteOverlayRasterisations < ActiveRecord::Migration[6.1]
  def change
    drop_table :overlay_rasterisations do |t|
      # Attributes used to perform the rasterisation
      t.references :overlay, null: false, foreign_key: true
      t.references :hit_label, foreign_key: { to_table: :labels }
      t.references :miss_label, foreign_key: { to_table: :labels }

      # Attributes for the generated labelling
      t.references :label_schema, null: false, foreign_key: true
      t.references :map_tile_layer, null: false, foreign_key: true
      t.string :name, null: false
      t.integer :zoom, null: false

      # The generated labelling
      t.references :labelling_group, foreign_key: true

      t.timestamps

      t.string :error_message
    end
  end
end
