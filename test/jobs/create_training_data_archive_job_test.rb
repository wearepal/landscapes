require 'test_helper'

class CreateTrainingDataArchiveJobTest < ActiveJob::TestCase
  test "perform" do
    download = TrainingDataDownload.create!(
      labelling_group: labelling_groups(:one)
    )

    assert_enqueued_with job: CreateTrainingDataArchiveJob, args: [download]
    perform_enqueued_jobs
    download.reload

    download.archive.open do |file|
      Zip::File.open_buffer(file) do |zip|
        assert_equal(
          file_fixture("tiles/0-0-0.jpeg").binread,
          zip.read("2020/0/0-0-0-2020.jpeg")
        )
      end
    end
  end
end
