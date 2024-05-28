class CreateMasks < ActiveRecord::Migration[6.1]
  def change
    create_table :masks do |t|
      t.string :name

      t.timestamps
    end
    add_index :masks, :name, unique: true
  end
end
