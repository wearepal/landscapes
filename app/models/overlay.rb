class Overlay < ApplicationRecord
  belongs_to :region

  has_one_attached :source

  validates :name, presence: true
  validates :colour, presence: true, format: { with: /\A[0-9a-f]{6}\z/, message: "must be a hex string (e.g. ffffff)" }
  validates :source, presence: { message: "is required" }
  # TODO: validate that source is a valid GeoJSON document

  before_validation do
    colour.downcase!
  end
end
