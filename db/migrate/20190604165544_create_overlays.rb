class CreateOverlays < ActiveRecord::Migration[6.0]
  def change
    create_table :overlays do |t|
      t.references :region, null: false, foreign_key: true
      t.string :name, null: false
      t.string :url, null: false
      t.string :colour, null: false

      t.timestamps
    end
  end
end
