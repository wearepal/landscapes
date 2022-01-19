namespace :user do
  desc "promote the given user to admin"
  task :promote, [:email] => [:environment] do |t, args|
    User.find_by!(email: args.email).update!(admin: true)
  end

  desc "revoke admin permissions from the given user"
  task :demote, [:email] => [:environment] do |t, args|
    User.find_by!(email: args.email).update!(admin: false)
  end
end
