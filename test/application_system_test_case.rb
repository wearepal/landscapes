require "test_helper"

SimpleCov.command_name 'test:system'

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase

  Webdrivers::Chromedriver.required_version = `curl https://chromedriver.storage.googleapis.com/LATEST_RELEASE`

  driven_by :selenium, using: ENV.fetch("SYSTEM_TEST_BROWSER", "headless_chrome").to_sym, screen_size: [1400, 1400]
end
