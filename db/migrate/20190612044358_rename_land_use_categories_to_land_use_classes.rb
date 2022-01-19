class RenameLandUseCategoriesToLandUseClasses < ActiveRecord::Migration[6.0]
  def change
    rename_table :land_use_categories, :land_use_classes
  end
end
