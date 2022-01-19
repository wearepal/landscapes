class CreateMetrics < ActiveRecord::Migration[6.0]
  def change
    create_table :metrics do |t|
      t.references :region, null: false, foreign_key: true
      t.string :name, null: false
      t.string :formula, null: false

      t.timestamps
    end
    add_index :metrics, [:region_id, :name], unique: true
  end
end
