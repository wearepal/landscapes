class Project < ApplicationRecord
  belongs_to :team

  validates :name, presence: true
  before_save :parse_extent

  def name
    source["name"]
  end

  def name=(name)
    source["name"] = name
  end  

  def extent
    source["extent"]
  end

  def extent=(extent)
    source["extent"] = extent
  end

  def cql
    source["cql"]
  end

  def cql=(cql)
    source["cql"] = cql
  end

  def layer
    source["layer"]
  end

  def layer=(layer)
    source["layer"] = layer
  end

  def parse_extent
    if extent.present?
      extent_array = extent.is_a?(String) ? extent.split(',').map(&:to_f) : extent.map(&:to_f)
      self.extent = extent_array
    end
  end

  def duplicate    
    dup
  end
end
