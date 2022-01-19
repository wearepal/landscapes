class ChangeLandUseCategoryNameToLabel < ActiveRecord::Migration[6.0]
  def change
    rename_column :land_use_categories, :name, :label
  end
end
