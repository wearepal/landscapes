require "application_system_test_case"

class AuthenticationTest < ApplicationSystemTestCase
  test "signing up" do
    visit root_url
    click_on "Sign In/Register"
    click_on "sign up"

    click_on "Create Account"
    assert_text "can't be blank"

    fill_in "Name", with: "Example User"
    fill_in "Email address", with: "user@example.com"
    fill_in "Password", with: "password"
    click_on "Create Account"

    assert_current_path root_path

    click_on "Example User"
    click_on "Sign Out"

    assert_text "Sign In/Register"
  end

  test "signing in" do
    visit root_url
    click_on "Sign In/Register"

    fill_in "Email address", with: "one@example.com"
    fill_in "Password", with: "password"
    click_on "Sign In"

    click_on "User One"
    click_on "Sign Out"

    assert_text "Sign In/Register"
  end
end
