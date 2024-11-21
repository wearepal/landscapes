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

  def defra_hedgerow_permission
    p = Permission.find_by(name: 'defra_hedgerow')
    return false unless p

    tp = team.team_permissions.find_by(permission: p)
    tp ? tp.enabled : false
  end
  
  def kew_rgb25cm_permission
    p = Permission.find_by(name: 'kew_rgb25cm')
    puts "p: #{p}"
    return false unless p

    tp = team.team_permissions.find_by(permission: p)
    tp ? tp.enabled : false
  end

  def kew_samples_permission
    p = Permission.find_by(name: 'kew_samples')
    return false unless p

    tp = team.team_permissions.find_by(permission: p)
    tp ? tp.enabled : false
  end
  
  def natmap_soil_permission
    p = Permission.find_by(name: 'natmap_soil')
    return false unless p

    tp = team.team_permissions.find_by(permission: p)
    tp ? tp.enabled : false
  end
  
  def extents
    team_extents = Extent.where(team_id: team.id).to_json
  end

end
