class RemoveUniqueIndexFromLabellingFunctionRulePosition < ActiveRecord::Migration[6.0]
  def change
    remove_index :labelling_function_rules, column: ["labelling_function_id", "position"], name: "idx_labelling_function_rules_on_labelling_function_and_position", unique: true
  end
end
