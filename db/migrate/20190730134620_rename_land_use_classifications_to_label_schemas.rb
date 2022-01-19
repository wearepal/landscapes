class RenameLandUseClassificationsToLabelSchemas < ActiveRecord::Migration[6.0]
  def change
    rename_table :land_use_classifications, :label_schemas
    rename_column :labellings, :land_use_classification_id, :label_schema_id
    rename_column :labels, :land_use_classification_id, :label_schema_id
    rename_column :metrics, :land_use_classification_id, :label_schema_id
  end
end
