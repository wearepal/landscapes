class TrainingDataDownload < ApplicationRecord
  belongs_to :labelling_group

  has_one_attached :archive

  after_commit on: :create do |record|
    CreateTrainingDataArchiveJob.perform_later record
  end
end
