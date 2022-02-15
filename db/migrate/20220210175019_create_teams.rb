class CreateTeams < ActiveRecord::Migration[6.1]
  def change
    create_table :teams do |t|
      t.string :name

      t.timestamps
    end

    add_reference :regions, :team, foreign_key: true
    add_reference :label_schemas, :team, foreign_key: true
    add_reference :models, :team, foreign_key: true

    up_only do
      default_team_id = Team.create!(name: "Default team").id
      Region.update_all team_id: default_team_id
      LabelSchema.update_all team_id: default_team_id
      Model.update_all team_id: default_team_id
    end

    change_column_null :regions, :team_id, false
    change_column_null :label_schemas, :team_id, false
    change_column_null :models, :team_id, false
  end
end
