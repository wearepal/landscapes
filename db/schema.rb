# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2022_09_15_150131) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.string "service_name", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "label_schemas", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "team_id", null: false
    t.index ["team_id"], name: "index_label_schemas_on_team_id"
  end

  create_table "labelling_group_uploads", force: :cascade do |t|
    t.bigint "region_id", null: false
    t.bigint "label_schema_id", null: false
    t.string "name", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "labelling_group_id"
    t.string "error_message"
    t.index ["label_schema_id"], name: "index_labelling_group_uploads_on_label_schema_id"
    t.index ["labelling_group_id"], name: "index_labelling_group_uploads_on_labelling_group_id"
    t.index ["region_id"], name: "index_labelling_group_uploads_on_region_id"
  end

  create_table "labelling_groups", force: :cascade do |t|
    t.bigint "region_id", null: false
    t.bigint "label_schema_id", null: false
    t.string "name", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "zoom"
    t.integer "x"
    t.integer "y"
    t.integer "width"
    t.integer "height"
    t.boolean "locked", default: false, null: false
    t.index ["label_schema_id"], name: "index_labelling_groups_on_label_schema_id"
    t.index ["region_id"], name: "index_labelling_groups_on_region_id"
  end

  create_table "labellings", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "labelling_group_id"
    t.bigint "map_tile_layer_id", null: false
    t.binary "data", null: false
    t.index ["labelling_group_id", "map_tile_layer_id"], name: "index_labellings_on_labelling_group_id_and_map_tile_layer_id", unique: true
    t.index ["labelling_group_id"], name: "index_labellings_on_labelling_group_id"
    t.index ["map_tile_layer_id"], name: "index_labellings_on_map_tile_layer_id"
  end

  create_table "labels", force: :cascade do |t|
    t.bigint "label_schema_id", null: false
    t.integer "index", null: false
    t.string "label", null: false
    t.string "colour", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "name", null: false
    t.index ["label_schema_id", "index"], name: "index_labels_on_label_schema_id_and_index", unique: true
    t.index ["label_schema_id", "name"], name: "index_labels_on_label_schema_id_and_name", unique: true
    t.index ["label_schema_id"], name: "index_labels_on_label_schema_id"
  end

  create_table "map_tile_downloads", force: :cascade do |t|
    t.bigint "region_id", null: false
    t.string "year"
    t.integer "zoom"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.float "progress", default: 0.0, null: false
    t.boolean "status"
    t.index ["region_id"], name: "index_map_tile_downloads_on_region_id"
  end

  create_table "map_tile_layers", force: :cascade do |t|
    t.bigint "region_id", null: false
    t.string "name", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["region_id", "name"], name: "index_map_tile_layers_on_region_id_and_name", unique: true
    t.index ["region_id"], name: "index_map_tile_layers_on_region_id"
  end

  create_table "map_tile_uploads", force: :cascade do |t|
    t.bigint "region_id", null: false
    t.string "message"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["region_id"], name: "index_map_tile_uploads_on_region_id"
  end

  create_table "map_tiles", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "x", null: false
    t.integer "y", null: false
    t.integer "zoom", null: false
    t.bigint "map_tile_layer_id", null: false
    t.index ["map_tile_layer_id", "x", "y", "zoom"], name: "index_map_tiles_on_map_tile_layer_id_and_x_and_y_and_zoom", unique: true
    t.index ["map_tile_layer_id"], name: "index_map_tiles_on_map_tile_layer_id"
  end

  create_table "memberships", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "team_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["team_id"], name: "index_memberships_on_team_id"
    t.index ["user_id"], name: "index_memberships_on_user_id"
  end

  create_table "metric_sets", force: :cascade do |t|
    t.bigint "label_schema_id", null: false
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["label_schema_id"], name: "index_metric_sets_on_label_schema_id"
  end

  create_table "metrics", force: :cascade do |t|
    t.string "name", null: false
    t.string "formula", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "metric_set_id"
    t.integer "impact", default: 0, null: false
    t.index ["metric_set_id"], name: "index_metrics_on_metric_set_id"
  end

  create_table "models", force: :cascade do |t|
    t.string "name", null: false
    t.jsonb "source"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "lock_version", default: 0, null: false
    t.bigint "team_id", null: false
    t.index ["team_id"], name: "index_models_on_team_id"
  end

  create_table "overlays", force: :cascade do |t|
    t.bigint "region_id", null: false
    t.string "name", null: false
    t.string "colour", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["region_id"], name: "index_overlays_on_region_id"
  end

  create_table "projects", force: :cascade do |t|
    t.bigint "team_id", null: false
    t.jsonb "source", default: {}, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["team_id"], name: "index_projects_on_team_id"
  end

  create_table "regions", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "team_id", null: false
    t.index ["team_id"], name: "index_regions_on_team_id"
  end

  create_table "teams", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "training_data_downloads", force: :cascade do |t|
    t.bigint "labelling_group_id", null: false
    t.string "message"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["labelling_group_id"], name: "index_training_data_downloads_on_labelling_group_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.string "password_digest", null: false
    t.string "token", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "admin", default: false, null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["token"], name: "index_users_on_token", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "label_schemas", "teams"
  add_foreign_key "labelling_group_uploads", "label_schemas"
  add_foreign_key "labelling_group_uploads", "labelling_groups"
  add_foreign_key "labelling_group_uploads", "regions"
  add_foreign_key "labelling_groups", "label_schemas"
  add_foreign_key "labelling_groups", "regions"
  add_foreign_key "labellings", "labelling_groups"
  add_foreign_key "labellings", "map_tile_layers"
  add_foreign_key "labels", "label_schemas"
  add_foreign_key "map_tile_downloads", "regions"
  add_foreign_key "map_tile_layers", "regions"
  add_foreign_key "map_tile_uploads", "regions"
  add_foreign_key "map_tiles", "map_tile_layers"
  add_foreign_key "memberships", "teams"
  add_foreign_key "memberships", "users"
  add_foreign_key "metric_sets", "label_schemas"
  add_foreign_key "metrics", "metric_sets"
  add_foreign_key "models", "teams"
  add_foreign_key "overlays", "regions"
  add_foreign_key "projects", "teams"
  add_foreign_key "regions", "teams"
  add_foreign_key "training_data_downloads", "labelling_groups"
end
