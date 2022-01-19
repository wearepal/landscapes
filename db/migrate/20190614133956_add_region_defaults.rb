class AddRegionDefaults < ActiveRecord::Migration[6.0]
  def change
    change_column_default :regions, :south_west_lat, from: nil, to:  -90.0
    change_column_default :regions, :south_west_lng, from: nil, to: -180.0
    change_column_default :regions, :north_east_lat, from: nil, to:   90.0
    change_column_default :regions, :north_east_lng, from: nil, to:  180.0
    change_column_default :regions, :years, from: nil, to: [].to_yaml
  end
end
