class Team < ApplicationRecord
  has_many :memberships
  has_many :users, through: :memberships
  has_many :regions, dependent: :destroy
  has_many :label_schemas, dependent: :destroy
  has_many :models, dependent: :destroy

  validates :name, presence: true
end
