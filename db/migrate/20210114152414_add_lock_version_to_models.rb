class AddLockVersionToModels < ActiveRecord::Migration[6.1]
  def change
    add_column :models, :lock_version, :integer, null: false, default: 0
  end
end
