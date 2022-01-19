require 'test_helper'

class LabellingGroupTest < ActiveSupport::TestCase
  test "if left blank, labelling group bounds are populated from region bounds" do
    group = regions(:one).labelling_groups.create!(
      name: "Test",
      label_schema: label_schemas(:one),
      zoom: 1,
    )
    assert_equal 0, group.x
    assert_equal 0, group.y
    assert_equal 2, group.width
    assert_equal 2, group.height
  end
end
