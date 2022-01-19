require 'test_helper'
require 'minitest/mock'

class ExtractMapTileArchiveJobTest < ActiveJob::TestCase
  test "perform" do
    upload = regions(:one).map_tile_uploads.create!(
      archive: ActiveStorage::Blob.create_and_upload!(
        io: file_fixture("tiles.tar").open,
        filename: "tiles.tar"
      )
    )

    assert_enqueued_with job: ExtractMapTileArchiveJob, args: [upload]

    Process.stub :fork, 0 do
      Process.stub :wait, nil do
        perform_enqueued_jobs
      end
    end

    upload.reload
    assert_equal "Extracted 1 tiles", upload.message
    MapTileLayer.find_by!(region: regions(:one), name: "2020").map_tiles.find_by!(x: 0, y: 0, zoom: 0).source.open do |file|
      assert_equal(
        file_fixture("tiles/0-0-0.jpeg").binread,
        file.read
      )
    end
  end
end
