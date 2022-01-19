class ExtractMapTileLayers < ActiveRecord::Migration[6.0]
  def change
    create_map_tile_layers

    # Add map_tile_layer_id
    add_reference :map_tiles, :map_tile_layer, foreign_key: true

      # Remove region_id
      remove_index :map_tiles, column: [:region_id, :zoom, :x]
      remove_index :map_tiles, column: [:region_id, :zoom, :y]
      remove_index :map_tiles, column: [:region_id, :x, :y, :zoom, :year], unique: true
      remove_index :map_tiles, column: [:region_id, :year]
      change_column_null :map_tiles, :region_id, true

        # Extract map_tiles.year -> map_tile_layers.name
        update_references
        remove_column :map_tiles, :year, :string

      remove_reference :map_tiles, :region, foreign_key: true

    change_column_null :map_tiles, :map_tile_layer_id, false
    add_index :map_tiles, [:map_tile_layer_id, :x, :y, :zoom], unique: true
  end

  private

    def create_map_tile_layers
      create_table :map_tile_layers do |t|
        t.references :region, null: false, foreign_key: true
        t.string :name, null: false

        t.index [:region_id, :name], unique: true

        t.timestamps
      end

      up_only do
        execute <<~SQL
          INSERT INTO "map_tile_layers" ("region_id", "name", "created_at", "updated_at")
          SELECT DISTINCT
            "map_tiles"."region_id",
            "map_tiles"."year",
            now(),
            now()
          FROM "map_tiles"
        SQL
      end
    end

    def update_references
      reversible do |dir|
        dir.up do
          execute <<~SQL
            UPDATE "map_tiles"
            SET "map_tile_layer_id" = "map_tile_layers"."id"
            FROM "map_tile_layers"
              WHERE "map_tiles"."region_id" = "map_tile_layers"."region_id"
              AND "map_tiles"."year" = "map_tile_layers"."name"
          SQL
        end
  
        dir.down do
          execute <<~SQL
            UPDATE "map_tiles"
            SET
              "region_id" = "map_tile_layers"."region_id",
              "year" = "map_tile_layers"."name"
            FROM "map_tile_layers"
              WHERE "map_tiles"."map_tile_layer_id" = "map_tile_layers"."id"
          SQL
        end
      end
    end
end
