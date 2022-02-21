class CreateMemberships < ActiveRecord::Migration[6.1]
  def change
    create_table :memberships do |t|
      t.references :user, null: false, foreign_key: true
      t.references :team, null: false, foreign_key: true

      t.timestamps
    end

    up_only do
      User.where(admin: true).find_each do |user|
        Team.find_each do |team|
          team.memberships.create! user_id: user.id
        end
      end
    end
  end
end
