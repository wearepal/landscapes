require "test_helper"

SimpleCov.command_name 'test:system'

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase

  # temporary fix until 115 has been released
  Webdrivers::Chromedriver.required_version = '114.0.5735.90'

  driven_by :selenium, using: ENV.fetch("SYSTEM_TEST_BROWSER", "headless_chrome").to_sym, screen_size: [1400, 1400]
end
