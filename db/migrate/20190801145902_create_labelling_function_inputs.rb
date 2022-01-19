class CreateLabellingFunctionInputs < ActiveRecord::Migration[6.0]
  def change
    create_table :labelling_function_inputs do |t|
      t.references :labelling_function, null: false, foreign_key: true
      t.references :label_schema, null: false, foreign_key: true
      t.string :name, null: false

      t.timestamps
    end
    add_index :labelling_function_inputs, [:labelling_function_id, :name], unique: true, name: "idx_labelling_function_inputs_on_labelling_function_id_and_name"
  end
end
