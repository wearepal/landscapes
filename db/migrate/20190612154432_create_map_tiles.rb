class CreateMapTiles < ActiveRecord::Migration[6.0]
  def change
    create_table :map_tiles do |t|
      t.references :region, null: false, foreign_key: true
      t.string :key, null: false

      t.index [:region_id, :key], unique: true

      t.timestamps
    end
  end
end
