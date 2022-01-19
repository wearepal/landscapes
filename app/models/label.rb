class Label < ApplicationRecord
  belongs_to :label_schema

  validates :index, presence: true, uniqueness: { scope: :label_schema }, numericality: { greater_than_or_equal_to: 0, less_than: 255, only_integer: true }
  validates :label, presence: true
  validates :name, presence: true, uniqueness: { scope: :label_schema }, format: { with: /\A[a-z_]*\z/ }
  validates :colour, presence: true, format: { with: /\A[0-9a-f]{6}\z/, message: "must be a hex string (e.g. ffffff)" }

  before_validation do
    colour.downcase!
    name.downcase!
  end
end
