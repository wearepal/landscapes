class CreatePlaceNameOverlayJob < ApplicationJob
  queue_as :default

  PLACE_TYPES = [
    :city,
    :borough,
    :suburb,
    :quarter,
    :neighbourhood,
    :town,
    :village,
    :hamlet,
  ]

  def perform(region)
    region.overlays.create!(
      name: "Place Names",
      colour: "ffffff",
      source: {
        io: StringIO.new(to_geojson(places_in(region))),
        filename: "place_names.json"
      }
    )
  end

  private

  def places_in(region)
    left = region.south_west_lng
    bottom = region.south_west_lat
    right = region.north_east_lng
    top = region.north_east_lat
    url = "https://overpass-api.de/api/xapi_meta?node[place=#{PLACE_TYPES.join("|")}][bbox=#{left},#{bottom},#{right},#{top}]"
    Nokogiri::XML(URI.open(url)).xpath("//node").map do |node|
      {
        name: node.xpath("tag[@k='name']/@v").text,
        lat: node.xpath("@lat").text.to_f,
        lng: node.xpath("@lon").text.to_f,
      }
    end
  end

  def to_geojson(places)
    {
      type: "FeatureCollection",
      features: places.reject { |place| place[:name].blank? }.map do |place|
        {
          type: "Feature",
          properties: { name: place[:name] },
          geometry: {
            type: "Point",
            coordinates: [place[:lng], place[:lat]]
          }
        }
      end
    }.to_json
  end
end
