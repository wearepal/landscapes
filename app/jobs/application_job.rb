class ApplicationJob < ActiveJob::Base
  retry_on ActiveRecord::Deadlocked
  retry_on ActiveStorage::FileNotFoundError
  retry_on Resque::TermException

  # Most jobs are safe to ignore if the underlying records are no longer available
  discard_on ActiveJob::DeserializationError
end
