class MakeLabellingGroupUploadsRequireLabelSchemaAndName < ActiveRecord::Migration[6.0]
  class LabellingGroupUpload < ActiveRecord::Base
  end

  def change
    up_only do
      LabellingGroupUpload.destroy_all
    end

    change_column_null :labelling_group_uploads, :label_schema_id, false
    change_column_null :labelling_group_uploads, :name, false
  end
end
