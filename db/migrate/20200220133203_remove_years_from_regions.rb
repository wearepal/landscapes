class RemoveYearsFromRegions < ActiveRecord::Migration[6.0]
  class Region < ActiveRecord::Base
    has_many :map_tile_layers
    serialize :years, Array
  end

  class MapTileLayer < ActiveRecord::Base
  end

  def change
    change_column_null :regions, :years, true, [].to_yaml
    reversible do |dir|
      dir.down do
        say_with_time "update regions.years" do
          Region.find_each do |region|
            region.update!(years: region.map_tile_layers.pluck(:name).sort)
          end
        end
      end
    end
    remove_column :regions, :years, :string, default: [].to_yaml
  end
end
