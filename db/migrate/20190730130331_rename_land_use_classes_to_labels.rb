class RenameLandUseClassesToLabels < ActiveRecord::Migration[6.0]
  def change
    rename_table :land_use_classes, :labels
  end
end
