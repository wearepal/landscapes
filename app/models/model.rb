class Model < ApplicationRecord
  validates :name, presence: true

  def duplicate
    dup
  end
end
