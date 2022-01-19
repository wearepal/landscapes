Sentry.init do |config|
  config.dsn = "https://947e82282a23489f91fd18ad21ffac44@o28290.ingest.sentry.io/5304857"
  config.breadcrumbs_logger = [:active_support_logger, :http_logger]
  config.enabled_environments = %w(production)
end
