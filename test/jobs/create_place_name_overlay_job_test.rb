require 'test_helper'

class CreatePlaceNameOverlayJobTest < ActiveJob::TestCase
  test "perform" do
    region = regions(:one)
    region.stub :south_west_extent, [30.23771349789205, 113.94195556640625] do
      region.stub :north_east_extent, [30.755998458321667, 114.70001220703125] do
        job = CreatePlaceNameOverlayJob.new(region)
        URI.stub :open, file_fixture("osm_places_wuhan.xml").read do
          job.perform_now
        end
      end
    end

    region.overlays.find_by!(name: "Place Names").source.open do |file|
      assert_equal JSON.parse(file_fixture("place_names_wuhan.json").read), JSON.parse(file.read)
    end
  end
end
