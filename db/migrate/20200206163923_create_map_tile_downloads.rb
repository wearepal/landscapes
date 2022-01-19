class CreateMapTileDownloads < ActiveRecord::Migration[6.0]
  def change
    create_table :map_tile_downloads do |t|
      t.references :region, null: false, foreign_key: true
      t.string :year
      t.integer :zoom
      t.string :message

      t.timestamps
    end
  end
end
