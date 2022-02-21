class Model < ApplicationRecord
  belongs_to :team
  
  validates :name, presence: true

  def duplicate
    dup
  end
end
