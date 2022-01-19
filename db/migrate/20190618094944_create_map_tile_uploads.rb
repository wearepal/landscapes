class CreateMapTileUploads < ActiveRecord::Migration[6.0]
  def change
    create_table :map_tile_uploads do |t|
      t.references :region, null: false, foreign_key: true
      t.string :message
      t.integer :percent_complete, null: false, default: 0
      t.boolean :status_flag

      t.timestamps
    end
  end
end
