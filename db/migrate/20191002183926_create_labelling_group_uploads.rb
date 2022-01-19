class CreateLabellingGroupUploads < ActiveRecord::Migration[6.0]
  def change
    create_table :labelling_group_uploads do |t|
      t.references :region, null: false, foreign_key: true
      t.references :label_schema, null: false, foreign_key: true
      t.string :name, null: false

      t.timestamps
    end
  end
end
