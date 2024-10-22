class AddKewPermission < ActiveRecord::Migration[6.1]
  def change
    permission = Permission.find_or_create_by(name: 'kew_samples')
  
    Team.all.each do |team|
      TeamPermission.find_or_create_by(team: team, permission: permission, enabled: false)
    end
  end
end
