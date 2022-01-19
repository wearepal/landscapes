module Convert
  # TODO: Change to lon_lat
  def self.to_lat_lng(x, y, zoom)
    n = 2.0 ** zoom
    lng_deg = x / (2.0 ** zoom) * 360.0 - 180.0

    n = Math::PI - 2.0 * Math::PI * y / (2.0 ** zoom)
    lat_deg = (180.0 / Math::PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))))

    [lat_deg, lng_deg]
  end

  # TODO: Change to lon_lat
  def self.from_lat_lng(lat, lon, zoom)
    xtile = (lon + 180) / 360 * (1<<zoom);
    ytile = (1 - Math.log(Math.tan(lat * Math::PI / 180) + 1 / Math.cos(lat * Math::PI / 180)) / Math::PI) / 2 * (1<<zoom);
    [xtile.floor, ytile.floor]
  end
end
