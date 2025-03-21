module Admin
  class TeamsController < AdminController
    skip_before_action :verify_authenticity_token, only: [:update_default_team]

    def update_default_team
      Rails.logger.debug "Current user: #{current_user.inspect}"
      Rails.logger.debug "Admin?: #{current_user&.admin?}"
      Rails.logger.debug "Params: #{params.inspect}"
      
      authorize!
      setting = Setting.first_or_create!
      setting.update!(default_team_id: params[:id])
      head :ok
    end
  end
end 