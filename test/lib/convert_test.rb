require 'test_helper'

class ConvertTest < ActiveJob::TestCase
  test "from_lat_lng" do
    assert_equal [0, 0], Convert.from_lat_lng(LAT, LNG, 0)
    assert_equal [TILE_X, TILE_Y], Convert.from_lat_lng(LAT, LNG, 18)
  end

  test "to_lat_lng" do
    assert_equal [0, 0], Convert.to_lat_lng(1, 1, 1)
    assert_equal [LAT, LNG], Convert.to_lat_lng(TILE_X, TILE_Y, 18)
  end

  private

    LAT = 30.23771349789205
    LNG = 113.94195556640625
    TILE_X = 214042
    TILE_Y = 107954
end
