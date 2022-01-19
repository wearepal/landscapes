require 'test_helper'

class UserTest < ActiveSupport::TestCase
  test "first created user is admin" do
    User.destroy_all
    assert User.create!(name: "User One", email: "one@example.com", password: "password").admin?
    refute User.create!(name: "User Two", email: "two@example.com", password: "password").admin?
  end
end
