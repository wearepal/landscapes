class AddImpactToMetrics < ActiveRecord::Migration[6.0]
  def change
    add_column :metrics, :impact, :integer, null: false, default: 0
  end
end
