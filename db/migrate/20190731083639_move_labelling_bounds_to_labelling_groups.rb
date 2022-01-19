class MoveLabellingBoundsToLabellingGroups < ActiveRecord::Migration[6.0]
  class LabellingGroup < ApplicationRecord
    has_many :labellings
  end

  class Labelling < ApplicationRecord
    belongs_to :labelling_group
  end

  def change
    add_column :labelling_groups, :zoom, :integer
    add_column :labelling_groups, :x, :integer
    add_column :labelling_groups, :y, :integer
    add_column :labelling_groups, :width, :integer
    add_column :labelling_groups, :height, :integer

    change_column_null :labellings, :zoom, from: false, to: true
    change_column_null :labellings, :x, from: false, to: true
    change_column_null :labellings, :y, from: false, to: true
    change_column_null :labellings, :width, from: false, to: true
    change_column_null :labellings, :height, from: false, to: true

    reversible do |dir|
      dir.up do
        LabellingGroup.all.each do |group|
          labelling = group.labellings.first
          group.update!(
            zoom: labelling.zoom,
            x: labelling.x,
            y: labelling.y,
            width: labelling.width,
            height: labelling.height
          )
        end
      end
      dir.down do
        Labelling.all.each do |labelling|
          group = labelling.labelling_group
          labelling.update!(
            zoom: group.zoom,
            x: group.x,
            y: group.y,
            width: group.width,
            height: group.height
          )
        end
      end
    end

    remove_column :labellings, :zoom, :integer
    remove_column :labellings, :x, :integer
    remove_column :labellings, :y, :integer
    remove_column :labellings, :width, :integer
    remove_column :labellings, :height, :integer

    change_column_null :labelling_groups, :zoom, from: true, to: false
    change_column_null :labelling_groups, :x, from: true, to: false
    change_column_null :labelling_groups, :y, from: true, to: false
    change_column_null :labelling_groups, :width, from: true, to: false
    change_column_null :labelling_groups, :height, from: true, to: false
  end
end
