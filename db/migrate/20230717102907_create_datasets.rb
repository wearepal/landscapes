class CreateDatasets < ActiveRecord::Migration[6.1]

  def change
    create_table :datasets do |t|
      t.references :team, null: false, foreign_key: true
      t.string :name
      t.string :gridtype

      t.timestamps
    end
    add_index :datasets, :name, unique: true
  end
end
