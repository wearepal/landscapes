class CreateSettings < ActiveRecord::Migration[6.1]
  def change
    create_table :settings do |t|
      t.references :default_team, null: true, foreign_key: { to_table: :teams }

      t.timestamps
    end

    up_only do
      Setting.create!
    end
  end
end
