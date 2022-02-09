require 'test_helper'
require 'minitest/mock'

class ExtractMapTileArchiveJobTest < ActiveJob::TestCase
  test "perform" do
    upload = regions(:one).map_tile_uploads.create!(
      archive: ActiveStorage::Blob.create_and_upload!(
        io: file_fixture("map_tile_upload.tar").open,
        filename: "map_tile_upload.tar"
      )
    )

    assert_enqueued_with job: ExtractMapTileArchiveJob, args: [upload]

    Process.stub :fork, 0 do
      Process.stub :wait, nil do
        perform_enqueued_jobs
      end
    end

    upload.reload
    assert_equal "Extracted 5 tiles", upload.message
    uploaded_map_tiles = MapTileLayer.find_by!(region: regions(:one), name: "Test layer").map_tiles
    [
      [0, 0, 0],
      [1, 0, 0],
      [1, 0, 1],
      [1, 1, 0],
      [1, 1, 1]
    ].each do |z, x, y|
      uploaded_map_tiles.find_by!(x: x, y: y, zoom: z).source.open do |file|
        assert_equal(
          file_fixture("tiles/#{x}-#{y}-#{z}.jpeg").binread,
          file.read
        )
      end
    end
  end
end
