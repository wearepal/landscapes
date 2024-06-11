class AddHedgerowPermission < ActiveRecord::Migration[6.1]

  def up
    permission = Permission.find_or_create_by(name: 'defra_hedgerow')

    Team.all.each do |team|
      TeamPermission.find_or_create_by(team: team, permission: permission, enabled: false)
    end

  end

  def down
    permission = Permission.find_by(name: 'defra_hedgerow')

    if permission
      TeamPermission.where(permission: permission).destroy_all
      permission.destroy
    end
  end

end
