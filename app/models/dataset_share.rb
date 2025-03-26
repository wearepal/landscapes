class DatasetShare < ApplicationRecord
  belongs_to :dataset
  belongs_to :team

  validates :dataset_id, uniqueness: { scope: :team_id }
end 