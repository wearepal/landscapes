class CreateModels < ActiveRecord::Migration[6.0]
  def change
    create_table :models do |t|
      t.string :name, null: false
      t.jsonb :source

      t.timestamps
    end
  end
end
