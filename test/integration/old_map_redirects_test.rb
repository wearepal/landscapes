require "test_helper"
require "capybara/rails"

class OldMapRedirectsTest < ActionDispatch::IntegrationTest
  test "labelling group redirects" do
    get labelling_group_url(labelling_groups(:one))
    assert_redirected_to 'http://www.example.com/#1C1ehCwcgSpaBS1eTSDm74sSBsfcEgwjoPbjSaArj'

    get labelling_group_url(labelling_groups(:two))
    page.driver.browser.switch_to.alert.accept # This accepts the alert
    assert_redirected_to 'http://www.example.com/' # Should redirect to root_url on failure
  end

  test "region redirects" do
    get region_url(regions(:one))
    assert_redirected_to 'http://www.example.com/#15aUgQQuUc3daA9DSw'
  end
end