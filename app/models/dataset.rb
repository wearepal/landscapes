class Dataset < ApplicationRecord
  belongs_to :team
  has_one_attached :file
end
