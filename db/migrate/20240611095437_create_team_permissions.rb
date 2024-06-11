class CreateTeamPermissions < ActiveRecord::Migration[6.1]
  def change
    create_table :team_permissions do |t|
      t.references :team, null: false, foreign_key: true
      t.references :permission, null: false, foreign_key: true
      t.boolean :enabled

      t.timestamps
    end
  end
end
