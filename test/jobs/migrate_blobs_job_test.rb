require "test_helper"

class MigrateBlobsJobTest < ActiveJob::TestCase
  test "migrating from S3" do
    ActiveStorage::Blob.service = ActiveStorage::Blob.services.fetch(:test_2)
    blob = ActiveStorage::Blob.create_and_upload!(
      io: file_fixture("simple.txt").open,
      filename: "simple.txt"
    )
    assert_equal "test_2", blob.service_name
    perform_enqueued_jobs
    assert_equal file_fixture("simple.txt").read, blob.download

    ActiveStorage::Blob.service = ActiveStorage::Blob.services.fetch(:test)
    MigrateBlobsJob.perform_now :test_2, :test
    blob.reload
    assert_equal "test", blob.service_name
    assert_equal file_fixture("simple.txt").read, blob.download
  end
end
