class AddNameToLandUseCategories < ActiveRecord::Migration[6.0]
  class LandUseCategory < ApplicationRecord; end
  
  def change
    add_column :land_use_categories, :name, :string

    LandUseCategory.all.each do |category|
      category.update! name: category.label.downcase.gsub(/[^[:alnum:]]+/, '_').gsub(/_*\z/, '')
    end

    change_column_null :land_use_categories, :name, false
    add_index :land_use_categories, [:region_id, :name], unique: true
  end
end
