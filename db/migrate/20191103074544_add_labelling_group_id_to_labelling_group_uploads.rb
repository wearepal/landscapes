class AddLabellingGroupIdToLabellingGroupUploads < ActiveRecord::Migration[6.0]
  def change
    change_column_null :labelling_group_uploads, :label_schema_id, from: false, to: true
    change_column_null :labelling_group_uploads, :name, from: false, to: true
    add_reference :labelling_group_uploads, :labelling_group, foreign_key: true
  end
end
