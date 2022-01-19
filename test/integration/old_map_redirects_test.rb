require "test_helper"

class OldMapRedirectsTest < ActionDispatch::IntegrationTest
  test "labelling group redirects" do
    get labelling_group_url(labelling_groups(:one))
    assert_redirected_to 'http://www.example.com/#1C1ehCwcgSpaBS1eTSDm74sSBsfcEgwjoPbjSaArj'

    assert_raises(ActiveRecord::RecordNotFound) do
      get labelling_group_url(labelling_groups(:two))
    end
  end

  test "region redirects" do
    get region_url(regions(:one))
    assert_redirected_to 'http://www.example.com/#15aUgQQuUc3daA9DSw'
  end
end
