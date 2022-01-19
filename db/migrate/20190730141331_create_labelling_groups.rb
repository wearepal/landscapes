class CreateLabellingGroups < ActiveRecord::Migration[6.0]
  class LabelSchema < ApplicationRecord
    belongs_to :region
  end

  class LabellingGroup < ApplicationRecord
    belongs_to :region
    belongs_to :label_schema
  end

  def change
    create_table :labelling_groups do |t|
      t.references :region, null: false, foreign_key: true
      t.references :label_schema, null: false, foreign_key: true
      t.string :name, null: false

      t.timestamps
    end

    reversible do |dir|
      dir.up do
        LabelSchema.all.each do |schema|
          LabellingGroup.create! region: schema.region, label_schema: schema, name: schema.name
        end
      end
    end
  end
end
