require "test_helper"

class ProjectTest < ActiveSupport::TestCase
  test "name is serialised as part of source" do
    project = Team.first.projects.new
    refute project.valid?
    assert project.errors[:name].any?

    project.name = ""
    refute project.valid?
    assert project.errors[:name].any?

    project.name = "Foo"
    assert project.valid?
    assert_equal({ "name" => "Foo" }, project.source)
  end
end
