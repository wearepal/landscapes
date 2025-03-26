class AddDescriptionToTeams < ActiveRecord::Migration[6.1]
  def change
    add_column :teams, :description, :text
  end
end
