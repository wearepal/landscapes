class MakeLabelSchemaIndependentOfRegion < ActiveRecord::Migration[6.0]
  class LabelSchema < ApplicationRecord
    belongs_to :region
    has_many :labelling_groups
  end

  class LabellingGroup < ApplicationRecord
    belongs_to :region
  end

  def up
    remove_reference :label_schemas, :region
  end

  def down
    add_reference :label_schemas, :region, foreign_key: true

    LabelSchema.all.each do |schema|
      schema.update! region: schema.labelling_groups.first.region
    end

    change_column_null :label_schemas, :region_id, false
  end
end
