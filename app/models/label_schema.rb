class LabelSchema < ApplicationRecord
  belongs_to :team
  
  has_many :labelling_groups
  has_many :labellings, through: :labelling_groups
  
  has_many :labels, dependent: :destroy

  validates :name, presence: true

  def duplicate
    dup.tap do |schema|
      schema.labels = labels.map(&:dup)
    end
  end
end
