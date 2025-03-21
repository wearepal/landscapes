class Setting < ApplicationRecord
  belongs_to :default_team, class_name: 'Team', optional: true
end 