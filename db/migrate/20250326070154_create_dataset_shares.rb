class CreateDatasetShares < ActiveRecord::Migration[6.1]
  def change
    create_table :dataset_shares do |t|
      t.references :dataset, null: false, foreign_key: true
      t.references :team, null: false, foreign_key: true

      t.timestamps
    end

    add_index :dataset_shares, [:dataset_id, :team_id], unique: true
  end
end
