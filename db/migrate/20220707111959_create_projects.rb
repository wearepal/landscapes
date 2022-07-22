class CreateProjects < ActiveRecord::Migration[6.1]
  def change
    create_table :projects do |t|
      t.references :team, null: false, foreign_key: true
      t.jsonb :source, null: false, default: {}

      t.timestamps
    end
  end
end
