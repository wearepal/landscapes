class CreateLabellingFunctionRules < ActiveRecord::Migration[6.0]
  def change
    create_table :labelling_function_rules do |t|
      t.references :labelling_function, null: false, foreign_key: true
      t.references :label, null: false, foreign_key: true
      t.integer :position, null: false
      t.string :expression, null: false

      t.timestamps
    end
    add_index :labelling_function_rules, [:labelling_function_id, :position], unique: true, name: "idx_labelling_function_rules_on_labelling_function_and_position"
  end
end
