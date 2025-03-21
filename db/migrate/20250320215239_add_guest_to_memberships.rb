class AddGuestToMemberships < ActiveRecord::Migration[6.1]
  def change
    add_column :memberships, :guest, :boolean, null: false, default: false
  end
end
