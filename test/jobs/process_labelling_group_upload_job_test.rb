require 'test_helper'

class ProcessLabellingGroupUploadJobTest < ActiveJob::TestCase
  test "perform" do
    name = "Test Labelling Group Upload"
    upload = create_upload(name, "labelling_group.csv")

    assert_nil upload.error_message

    group = upload.labelling_group
    assert_equal(
      {
        "region_id" => regions(:one).id,
        "label_schema_id" => label_schemas(:one).id,
        "name" => name,
        "zoom" => 1,
        "x" => 0,
        "y" => 0,
        "width" => 2,
        "height" => 2,
        "locked" => true,
      },
      group.attributes.except("id", "created_at", "updated_at")
    )
    assert_equal 1, group.labellings.count

    labelling = group.labellings.first
    assert_equal(
      {
        "map_tile_layer_id" => map_tile_layers(:two).id,
        "data" => [0, 1, 0, 1].pack("C*"),
      },
      labelling.attributes.except("id", "created_at", "updated_at", "labelling_group_id")
    )
  end

  test "perform with non-csv source" do
    upload = create_upload("Not a CSV", "tiles/0-0-0.jpeg")
    assert upload.labelling_group.nil?
    assert_equal "Not a valid CSV file", upload.error_message
  end

  test "perform with missing columns" do
    upload = create_upload("Missing columns", "labelling_group_missing_columns.csv")
    assert upload.labelling_group.nil?
    assert_equal "Missing column(s): filename, prediction", upload.error_message
  end

  test "perform with multiple zooms" do
    upload = create_upload("Multiple zooms", "labelling_group_multiple_zooms.csv")
    assert upload.labelling_group.nil?
    assert_equal "More than 1 zoom level present in data", upload.error_message
  end

  test "perform with incorrect filenames" do
    upload = create_upload("Incorrect filenames", "labelling_group_incorrect_filenames.csv")
    assert upload.labelling_group.nil?
    assert_equal "Filename \"Foo\" doesn't match the expected format", upload.error_message
  end

  private

    def create_upload(name, source_filename)
      regions(:one).labelling_group_uploads.create!(
        name: name,
        label_schema: label_schemas(:one),
        source: {
          io: file_fixture(source_filename).open,
          filename: source_filename
        }
      ).tap do |upload|
        assert_enqueued_with job: ProcessLabellingGroupUploadJob, args: [upload]
        perform_enqueued_jobs
        upload.reload
      end
    end
end
