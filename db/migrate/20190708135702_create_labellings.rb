class CreateLabellings < ActiveRecord::Migration[6.0]
  def change
    create_table :labellings do |t|
      t.references :land_use_classification, null: false, foreign_key: true
      t.integer :year, null: false
      t.integer :zoom, null: false
      t.integer :x, null: false
      t.integer :y, null: false
      t.integer :width, null: false
      t.integer :height, null: false
      t.integer :data, null: false, array: true

      t.timestamps
    end
    add_index :labellings, [:land_use_classification_id, :year], unique: true
  end
end
