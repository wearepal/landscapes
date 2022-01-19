class FixForeignKeys < ActiveRecord::Migration[6.0]
  def change
    remove_foreign_key "land_use_classes", "regions", column: "land_use_classification_id"
    add_foreign_key "land_use_classes", "land_use_classifications"

    remove_foreign_key "metrics", "regions", column: "land_use_classification_id"
    add_foreign_key "metrics", "land_use_classifications"
  end
end
