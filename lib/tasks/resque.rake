require 'resque/tasks'
require 'resque/pool/tasks'

task "resque:setup" => :environment

task "resque:pool:setup" do
  ActiveRecord::Base.connection.disconnect!
  Resque::Pool.after_prefork do
    ActiveRecord::Base.establish_connection
    Resque.redis.client.reconnect
  end
end
