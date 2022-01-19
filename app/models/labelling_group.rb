class LabellingGroup < ApplicationRecord
  belongs_to :region
  belongs_to :label_schema
  has_many :labellings, dependent: :destroy
  has_many :labelling_group_uploads, dependent: :destroy
  has_many :training_data_downloads, dependent: :destroy

  validates :name, presence: true
  validates :zoom, presence: true, numericality: {
    greater_than_or_equal_to: 0,
    only_integer: true,
  }
  validates :x, :y, presence: true, numericality: {
    greater_than_or_equal_to: 0,
    less_than: Proc.new { |o| 2 ** o.zoom },
    only_integer: true,
    if: Proc.new { |o| o.zoom.present? }
  }
  validates :width, presence: true, numericality: {
    greater_than: 0,
    less_than_or_equal_to: Proc.new { |o| 2 ** o.zoom - o.x },
    only_integer: true,
    if: Proc.new { |o| o.zoom.present? && o.x.present? }
  }
  validates :height, presence: true, numericality: {
    greater_than: 0,
    less_than_or_equal_to: Proc.new { |o| 2 ** o.zoom - o.y },
    only_integer: true,
    if: Proc.new { |o| o.zoom.present? && o.y.present? }
  }

  before_validation(on: :create) do
    if x.nil? && y.nil? && width.nil? && height.nil? && zoom.present? && region.present?
      tiles = region.map_tiles.where(zoom: zoom)
      if tiles.any?
        self.x = tiles.minimum(:x)
        self.y = tiles.minimum(:y)
        self.width = tiles.maximum(:x) - x + 1
        self.height = tiles.maximum(:y) - y + 1
      end
    end
  end

  def duplicate
    dup.tap do |group|
      group.labellings = labellings.map(&:dup)
      group.locked = false
    end
  end

  def extent
    [[x, y + height], [x + width - 1, y]].flat_map do |coord|
      Convert.to_lat_lng(*coord, zoom)
    end
  end
end
