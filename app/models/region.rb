class Region < ApplicationRecord
  belongs_to :team
  
  has_many :labelling_group_uploads, dependent: :destroy
  has_many :labelling_groups, dependent: :destroy
  has_many :labellings, through: :labelling_groups
  has_many :map_tile_downloads, dependent: :destroy
  has_many :map_tile_uploads, dependent: :destroy
  has_many :map_tile_layers, dependent: :destroy
  has_many :map_tiles, through: :map_tile_layers
  has_many :overlays, dependent: :destroy
  has_many :training_data_downloads, through: :labelling_groups

  validates :name, presence: true

  def south_west_extent
    Rails.cache.fetch "#{cache_key_with_version}/south_west_extent" do
      map_tile_layers.map(&:south_west_extent).transpose.map(&:min)
    end
  end

  def north_east_extent
    Rails.cache.fetch "#{cache_key_with_version}/north_east_extent" do
      map_tile_layers.map(&:north_east_extent).transpose.map(&:max)
    end
  end

  def extent
    [south_west_extent, north_east_extent].flatten
  end

  def default_map_tile_layer
    map_tile_layers.order(:name).last
  end
end
