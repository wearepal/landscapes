class MakeDefaultTeamNullableInSettings < ActiveRecord::Migration[6.1]
  def change
    change_column_null :settings, :default_team_id, true
  end
end
