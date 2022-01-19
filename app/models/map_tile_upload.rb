class MapTileUpload < ApplicationRecord
  belongs_to :region

  has_one_attached :archive

  after_commit on: :create do |record|
    ExtractMapTileArchiveJob.perform_later record
  end
end
