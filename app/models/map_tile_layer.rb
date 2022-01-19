class MapTileLayer < ApplicationRecord
  belongs_to :region, touch: true
  has_many :map_tiles, dependent: :destroy
  has_many :labellings

  validates :name, presence: true, uniqueness: { scope: :region }

  def min_zoom
    Rails.cache.fetch "#{cache_key_with_version}/min_zoom" do
      map_tiles.minimum(:zoom)
    end
  end

  def max_zoom
    Rails.cache.fetch "#{cache_key_with_version}/max_zoom" do
      map_tiles.maximum(:zoom)
    end
  end

  def south_west_extent
    Rails.cache.fetch "#{cache_key_with_version}/south_west_extent" do
      tiles = map_tiles.where(zoom: max_zoom)
      Convert.to_lat_lng(tiles.minimum(:x), tiles.maximum(:y) + 1, max_zoom)
    end
  end

  def north_east_extent
    Rails.cache.fetch "#{cache_key_with_version}/north_east_extent" do
      tiles = map_tiles.where(zoom: max_zoom)
      Convert.to_lat_lng(tiles.maximum(:x) + 1, tiles.minimum(:y), max_zoom)
    end
  end
end
