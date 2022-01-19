class CreateTrainingDataDownloads < ActiveRecord::Migration[6.0]
  def change
    create_table :training_data_downloads do |t|
      t.references :labelling_group, null: false, foreign_key: true
      t.string :message

      t.timestamps
    end
  end
end
