class Labelling < ApplicationRecord
  belongs_to :labelling_group
  belongs_to :map_tile_layer

  validates :map_tile_layer, uniqueness: { scope: :labelling_group }

  scope :ordered_by_layer, -> { includes(:map_tile_layer).order("map_tile_layers.name") }

  after_initialize do
    if new_record? && data.nil? && labelling_group.present?
      self.data = String.new("\xFF", encoding: Encoding::BINARY) * (labelling_group.width * labelling_group.height)
    end
  end

  def name
    map_tile_layer.name
  end

  def get(x, y)
    result = data[to_index(x, y)].ord
    result == 255 ? nil : result
  rescue RangeError
    nil
  end

  def set(x, y, label)
    data_will_change!
    unless label.nil? || (label.is_a?(Integer) && label >= 0 && label < 255)
      raise RangeError
    end
    data[to_index(x, y)] = label.nil? ? 255.chr : label.chr
  end

  def to_index(x, y)
    if (
      x < labelling_group.x ||
      y < labelling_group.y ||
      x >= labelling_group.x + labelling_group.width ||
      y >= labelling_group.y + labelling_group.height
    )
      raise RangeError
    else
      (x - labelling_group.x) * labelling_group.height + (y - labelling_group.y)
    end
  end

  def from_index(index)
    if (index < 0 || index >= data.size)
      raise RangeError
    else
      [
        labelling_group.x + (index / labelling_group.height),
        labelling_group.y + (index % labelling_group.height)
      ]
    end
  end
end
