class Permission < ApplicationRecord
    has_many :team_permissions, dependent: :destroy
    has_many :teams, through: :team_permissions

    after_create :assign_to_all_teams

    private

    def assign_to_all_teams
        Team.all.each do |team|
            TeamPermission.create(team: team, permission: self, enabled: false)
        end
    end
end
