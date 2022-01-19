class CreateLandUseCategories < ActiveRecord::Migration[6.0]
  def change
    create_table :land_use_categories do |t|
      t.references :region, null: false, foreign_key: true
      t.integer :index, null: false
      t.string :name, null: false
      t.string :colour, null: false

      t.timestamps
    end
    add_index :land_use_categories, [:region_id, :index], unique: true
  end
end
