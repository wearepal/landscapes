class AddCascadeDeleteToTeamPermissions < ActiveRecord::Migration[6.1]
  def change
    remove_foreign_key :team_permissions, :permissions
    add_foreign_key :team_permissions, :permissions, on_delete: :cascade

    remove_foreign_key :team_permissions, :teams
    add_foreign_key :team_permissions, :teams, on_delete: :cascade
  end
end
