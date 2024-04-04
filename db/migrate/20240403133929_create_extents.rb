class CreateExtents < ActiveRecord::Migration[6.1]
  def change
    create_table :extents do |t|
      t.references :team, null: false, foreign_key: true
      t.string :name
      t.float :value, array: true, default: [], null: false

      t.timestamps
    end
    add_index :extents, :name, unique: true
  end
end
