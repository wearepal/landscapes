class AddRgb25cmPermission < ActiveRecord::Migration[6.1]

  def up
    permission = Permission.find_or_create_by(name: 'kew_rgb25cm')

    Team.all.each do |team|
      TeamPermission.find_or_create_by(team: team, permission: permission, enabled: false)
    end
  end

  def down
    permission = Permission.find_by(name: 'kew_rgb25cm')
    if permission
      TeamPermission.where(permission: permission).destroy_all
      permission.destroy
    end
  end
end
