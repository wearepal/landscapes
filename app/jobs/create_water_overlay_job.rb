class CreateWaterOverlayJob < ApplicationJob
  queue_as :default

  def perform(region)
    region.overlays.create!(
      name: "Bodies of Water (OpenStreetMap)",
      colour: "9fbfdf",
      source: {
        io: StringIO.new(to_geojson(water_areas_in(region))),
        filename: "water.json"
      }
    )
  end

  private

    def water_areas_in(region)
      left = region.south_west_lng
      bottom = region.south_west_lat
      right = region.north_east_lng
      top = region.north_east_lat
      url = "https://overpass-api.de/api/xapi_meta?way[natural=water][bbox=#{left},#{bottom},#{right},#{top}]"
      doc = Nokogiri::XML(URI.open(url))
      nodes = doc.xpath("//node").map do |node|
        [
          node.xpath("@id").text,
          {
            lon: node.xpath("@lon").text.to_f,
            lat: node.xpath("@lat").text.to_f,
          }
        ]
      end.to_h
      doc.xpath("//way").map do |way|
        way.xpath("nd").map do |node_ref|
          nodes[node_ref.xpath("@ref").text]
        end
      end
    end

    def to_geojson(areas)
      {
        type: "FeatureCollection",
        features: areas.map do |area|
          {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [area.map { |point| [point[:lon], point[:lat]] }]
            }
          }
        end
      }.to_json
    end
end
