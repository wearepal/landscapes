class CreateRegions < ActiveRecord::Migration[6.0]
  def change
    create_table :regions do |t|
      t.string :name, null: false
      t.float :south_west_lat, null: false
      t.float :south_west_lng, null: false
      t.float :north_east_lat, null: false
      t.float :north_east_lng, null: false
      t.string :years, null: false

      t.timestamps
    end
  end
end
