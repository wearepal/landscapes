# Stolen from https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames
module Convert
  # TODO: Change to lon_lat
  def self.to_lat_lng(xtile, ytile, zoom)
    n = 2.0 ** zoom
    lng_deg = xtile / n * 360.0 - 180.0
    lat_rad = Math::atan(Math::sinh(Math::PI * (1.0 - 2.0 * ytile / n)))
    lat_deg = 180.0 * (lat_rad / Math::PI)
    [lat_deg, lng_deg]
  end

  # TODO: Change to lon_lat
  def self.from_lat_lng(lat_deg, lng_deg, zoom)
    lat_rad = lat_deg / 180.0 * Math::PI
    n = 2.0 ** zoom
    x = ((lng_deg + 180.0) / 360.0 * n).to_i
    y = ((1.0 - Math::log(Math::tan(lat_rad) + (1.0 / Math::cos(lat_rad))) / Math::PI) / 2.0 * n).to_i
    [x, y]
  end
end
