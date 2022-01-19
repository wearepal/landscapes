class CreateMetricSets < ActiveRecord::Migration[6.0]
  class LabelSchema < ApplicationRecord
    has_many :metric_sets
  end

  class MetricSet < ApplicationRecord
    belongs_to :label_schema
    has_many :metrics
  end

  class Metric < ApplicationRecord
    belongs_to :label_schema
    belongs_to :metric_set
  end

  def change
    create_table :metric_sets do |t|
      t.references :label_schema, null: false, foreign_key: true
      t.string :name

      t.timestamps
    end

    add_reference :metrics, :metric_set, foreign_key: true
    change_column_null :metrics, :label_schema_id, from: false, to: true

    reversible do |dir|
      dir.up do
        LabelSchema.all.each do |schema|
          schema.metric_sets.create! name: "Default"
        end
        Metric.all.each do |metric|
          metric.update! metric_set: metric.label_schema.metric_sets.first
        end
      end

      dir.down do
        Metric.all.each do |metric|
          metric.update! label_schema: metric.metric_set.label_schema
        end
      end
    end

    remove_index :metrics, column: ["label_schema_id", "name"], name: "index_metrics_on_label_schema_id_and_name", unique: true
    remove_reference :metrics, :label_schema, foreign_key: true
    change_column_null :metrics, :metric_set_id, from: true, to: false
  end
end
