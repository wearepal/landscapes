SimpleCov.start 'rails'
SimpleCov.command_name 'test'

ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'

class ActiveSupport::TestCase
  # Run tests in parallel with specified workers
  parallelize(workers: :number_of_processors)

  parallelize_setup do |worker|
    SimpleCov.command_name "#{SimpleCov.command_name}-#{worker}"
  end

  parallelize_teardown do |worker|
    SimpleCov.result
  end

  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  # Add more helper methods to be used by all tests here...
  setup do
    MapTile.find_each do |tile|
      filename = "tiles/#{tile.x}-#{tile.y}-#{tile.zoom}.jpeg"
      tile.source.attach(
        io: file_fixture(filename).open,
        filename: filename
      )
    end
    Overlay.find_each do |overlay|
      filename = "#{overlay.name}.json"
      overlay.source.attach(
        io: file_fixture(filename).open,
        filename: filename
      )
    end
  end
end
