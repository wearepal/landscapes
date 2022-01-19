require 'test_helper'

class CreateMapTileArchiveJobTest < ActiveJob::TestCase
  test "perform" do
    download = regions(:one).map_tile_downloads.create! year: map_tile_layers(:one).name, zoom: 0

    assert_enqueued_with job: CreateMapTileArchiveJob, args: [download]
    perform_enqueued_jobs
    download.reload

    assert download.status
    assert_equal 1.0, download.progress

    download.archive.open do |file|
      Zip::File.open_buffer(file) do |zip|
        assert_equal 1, zip.count
        assert_equal(
          file_fixture("tiles/0-0-0.jpeg").binread,
          zip.read("0-0-0-#{map_tile_layers(:one).name}.jpeg")
        )
      end
    end
  end
end
