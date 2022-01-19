class AddErrorMessageToLabellingGroupUploads < ActiveRecord::Migration[6.0]
  def change
    add_column :labelling_group_uploads, :error_message, :string
  end
end
