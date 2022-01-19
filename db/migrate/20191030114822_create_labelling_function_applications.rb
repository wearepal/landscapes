class CreateLabellingFunctionApplications < ActiveRecord::Migration[6.0]
  def change
    create_table :labelling_function_applications do |t|
      t.references :region, null: false, foreign_key: true
      t.references :labelling_function, null: false, foreign_key: true
      t.references :labelling_group, foreign_key: true
      t.jsonb :bindings, null: false, default: {}
      t.string :message
      t.integer :percent_complete, null: false, default: 0
      t.boolean :status_flag

      t.timestamps
    end
  end
end
