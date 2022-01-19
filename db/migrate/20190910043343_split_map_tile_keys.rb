class SplitMapTileKeys < ActiveRecord::Migration[6.0]
  def change
    add_column :map_tiles, :x, :integer
    add_column :map_tiles, :y, :integer
    add_column :map_tiles, :zoom, :integer
    add_column :map_tiles, :year, :integer
    add_index :map_tiles, [:region_id, :x, :y, :zoom, :year], unique: true

    change_column_null :map_tiles, :key, from: false, to: true

    reversible do |dir|
      dir.up do
        say_with_time "split keys" do
          MapTile.find_each do |tile|
            m = tile.key.split "-"
            tile.update!(
              x: m[0].to_i,
              y: m[1].to_i,
              zoom: m[2].to_i,
              year: m[3].to_i
            )
          end
        end
      end
      dir.down do
        say_with_time "join keys" do
          MapTile.find_each do |tile|
            tile.update! key: [tile.x, tile.y, tile.zoom, tile.year].join("-")
          end
        end
      end
    end

    remove_index :map_tiles, column: [:region_id, :key], unique: true
    remove_column :map_tiles, :key, :string
  end
end
