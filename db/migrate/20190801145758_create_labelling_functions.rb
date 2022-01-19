class CreateLabellingFunctions < ActiveRecord::Migration[6.0]
  def change
    create_table :labelling_functions do |t|
      t.references :label_schema, null: false, foreign_key: true
      t.string :name, null: false

      t.timestamps
    end
  end
end
