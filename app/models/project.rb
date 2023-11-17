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

  def parse_extent
    if extent.present?
      extent_array = extent.split(',').map(&:to_f)
      self.extent = extent_array
    end
  end

  def duplicate    
    dup
  end
end
