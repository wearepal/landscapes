class MapTileDownload < ApplicationRecord
  belongs_to :region

  has_one_attached :archive

  validates :year, presence: true
  validates :zoom, presence: true, numericality: { greater_than_or_equal_to: 0, only_integer: true }

  after_commit on: :create do |record|
    CreateMapTileArchiveJob.perform_later record
  end
end
