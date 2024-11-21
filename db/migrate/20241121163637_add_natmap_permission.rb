class AddNatmapPermission < ActiveRecord::Migration[6.1]
  def change
    permission = Permission.find_or_create_by(name: 'natmap_soil')
  
    Team.all.each do |team|
      TeamPermission.find_or_create_by(team: team, permission: permission, enabled: false)
    end
  end
end
