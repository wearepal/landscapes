class AddMappedToLabellingFunctionInputs < ActiveRecord::Migration[6.0]
  def change
    add_column :labelling_function_inputs, :mapped, :boolean
    add_index :labelling_function_inputs, [:labelling_function_id, :mapped], unique: true, name: "index_labelling_function_inputs_on_function_id_and_mapped"
  end
end
