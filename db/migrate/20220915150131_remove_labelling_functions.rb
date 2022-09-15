class RemoveLabellingFunctions < ActiveRecord::Migration[6.1]
  def change
    remove_foreign_key "labelling_function_applications", "labelling_functions"
    remove_foreign_key "labelling_function_applications", "labelling_groups"
    remove_foreign_key "labelling_function_applications", "regions"
    remove_foreign_key "labelling_function_inputs", "label_schemas"
    remove_foreign_key "labelling_function_inputs", "labelling_functions"
    remove_foreign_key "labelling_function_rules", "labelling_functions"
    remove_foreign_key "labelling_function_rules", "labels"
    remove_foreign_key "labelling_functions", "label_schemas"
    
    drop_table "labelling_function_applications", force: :cascade do |t|
      t.bigint "region_id", null: false
      t.bigint "labelling_function_id", null: false
      t.bigint "labelling_group_id"
      t.jsonb "bindings", default: {}, null: false
      t.string "message"
      t.integer "percent_complete", default: 0, null: false
      t.boolean "status_flag"
      t.datetime "created_at", precision: 6, null: false
      t.datetime "updated_at", precision: 6, null: false
      t.index ["labelling_function_id"], name: "index_labelling_function_applications_on_labelling_function_id"
      t.index ["labelling_group_id"], name: "index_labelling_function_applications_on_labelling_group_id"
      t.index ["region_id"], name: "index_labelling_function_applications_on_region_id"
    end
  
    drop_table "labelling_function_inputs", force: :cascade do |t|
      t.bigint "labelling_function_id", null: false
      t.bigint "label_schema_id", null: false
      t.string "name", null: false
      t.datetime "created_at", precision: 6, null: false
      t.datetime "updated_at", precision: 6, null: false
      t.boolean "mapped"
      t.index ["label_schema_id"], name: "index_labelling_function_inputs_on_label_schema_id"
      t.index ["labelling_function_id", "mapped"], name: "index_labelling_function_inputs_on_function_id_and_mapped", unique: true
      t.index ["labelling_function_id", "name"], name: "idx_labelling_function_inputs_on_labelling_function_id_and_name", unique: true
      t.index ["labelling_function_id"], name: "index_labelling_function_inputs_on_labelling_function_id"
    end
  
    drop_table "labelling_function_rules", force: :cascade do |t|
      t.bigint "labelling_function_id", null: false
      t.bigint "label_id", null: false
      t.integer "position", null: false
      t.string "expression", null: false
      t.datetime "created_at", precision: 6, null: false
      t.datetime "updated_at", precision: 6, null: false
      t.index ["label_id"], name: "index_labelling_function_rules_on_label_id"
      t.index ["labelling_function_id"], name: "index_labelling_function_rules_on_labelling_function_id"
    end
  
    drop_table "labelling_functions", force: :cascade do |t|
      t.bigint "label_schema_id", null: false
      t.string "name", null: false
      t.datetime "created_at", precision: 6, null: false
      t.datetime "updated_at", precision: 6, null: false
      t.index ["label_schema_id"], name: "index_labelling_functions_on_label_schema_id"
    end
  end
end
