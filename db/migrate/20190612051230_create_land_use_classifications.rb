class CreateLandUseClassifications < ActiveRecord::Migration[6.0]
  def change
    create_table :land_use_classifications do |t|
      t.references :region, null: false, foreign_key: true
      t.string :name, null: false

      t.timestamps
    end

    reversible do |dir|
      dir.up do
        Region.all.each do |region|
          LabelSchema.create! id: region.id, region_id: region.id, name: "Default"
        end
      end
    end

    rename_column :land_use_classes, :region_id, :land_use_classification_id
    rename_column :metrics, :region_id, :land_use_classification_id
  end
end
