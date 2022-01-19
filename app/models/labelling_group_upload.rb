class LabellingGroupUpload < ApplicationRecord
  belongs_to :region
  belongs_to :label_schema
  belongs_to :labelling_group, optional: true

  has_one_attached :source

  validates :name, presence: true
  validates :source, presence: { message: "is required" }

  after_commit on: :create do |record|
    ProcessLabellingGroupUploadJob.perform_later record
  end
end
