class Team < ApplicationRecord
  has_many :memberships
  has_many :users, through: :memberships
  has_many :regions, dependent: :destroy
  has_many :label_schemas, dependent: :destroy
  has_many :models, dependent: :destroy
  has_many :projects, dependent: :destroy
  has_many :datasets, dependent: :destroy

  has_many :map_tile_layers, through: :regions
  has_many :overlays, through: :regions

  validates :name, presence: true
end
