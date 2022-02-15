class CreateMemberships < ActiveRecord::Migration[6.1]
  def change
    create_table :memberships do |t|
      t.references :user, null: false, foreign_key: true
      t.references :team, null: false, foreign_key: true

      t.timestamps
    end

    up_only do
      default_team = Team.first!
      User.where(admin: true).find_each do |user|
        Membership.create! user_id: user.id, team_id: default_team.id
      end
    end
  end
end
