class MoveLabellingsToLabellingGroups < ActiveRecord::Migration[6.0]
  class Labelling < ApplicationRecord
    belongs_to :label_schema
    belongs_to :labelling_group
  end

  class LabelSchema < ApplicationRecord
    has_many :labelling_groups
  end

  class LabellingGroup < ApplicationRecord
    belongs_to :label_schema
  end

  def change
    remove_index :labellings, column: [:label_schema_id, :year], unique: true

    add_reference :labellings, :labelling_group, foreign_key: true
    change_column_null :labellings, :label_schema_id, from: false, to: true

    reversible do |dir|
      dir.up do
        Labelling.all.each do |labelling|
          labelling.update! labelling_group: labelling.label_schema.labelling_groups.first
        end
      end

      dir.down do
        Labelling.all.each do |labelling|
          labelling.update! label_schema: labelling.labelling_group.label_schema
        end
      end
    end

    change_column_null :labellings, :labelling_group_id, from: true, to: false
    remove_reference :labellings, :label_schema, foreign_key: true

    add_index :labellings, [:labelling_group_id, :year], unique: true
  end
end
