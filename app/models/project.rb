class Project < ApplicationRecord
  belongs_to :team

  validates :name, presence: true

  def name
    source["name"]
  end

  def name=(name)
    source["name"] = name
  end
end
