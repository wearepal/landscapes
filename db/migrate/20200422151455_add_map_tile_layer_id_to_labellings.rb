class AddMapTileLayerIdToLabellings < ActiveRecord::Migration[6.0]
  class Region < ActiveRecord::Base
    has_many :map_tile_layers
  end

  class MapTileLayer < ActiveRecord::Base
  end

  class LabellingGroup < ActiveRecord::Base
    belongs_to :region
  end

  class Labelling < ActiveRecord::Base
    belongs_to :labelling_group
    belongs_to :map_tile_layer
  end

  def change
    add_reference :labellings, :map_tile_layer, foreign_key: true

    remove_index :labellings, column: [:labelling_group_id, :year], unique: true
    change_column_null :labellings, :year, true

    say_with_time "update references" do
      reversible do |dir|
        Labelling.find_each do |labelling|
          dir.up do
            labelling.update!(
              map_tile_layer: labelling.labelling_group.region.map_tile_layers.find_by!(name: labelling.year)
            )
          end
          dir.down do
            labelling.update!(
              year: labelling.map_tile_layer.name
            )
          end
        end
      end
    end

    remove_column :labellings, :year, :string

    change_column_null :labellings, :map_tile_layer_id, false
    add_index :labellings, [:labelling_group_id, :map_tile_layer_id], unique: true
  end
end
