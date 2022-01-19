class MapTile < ApplicationRecord
  belongs_to :map_tile_layer, touch: true

  has_one_attached :source

  validates :x, :y, :zoom, presence: true
end
