class CreateExpressions < ActiveRecord::Migration[6.1]
  def change

    create_table :expressions do |t|
      t.string :name
      t.string :expression
      t.references :team, null: false, foreign_key: true

      t.timestamps
    end
  end
end
