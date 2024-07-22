class ApplicationController < ActionController::Base
  before_action :ensure_authenticated
  before_action :set_sentry_context
  after_action :ensure_authorized

  helper_method :current_user

  def authorized?
    @authorized
  end

  def authorize!
    @authorized = true
  end

  def authorize_for!(team)
    if team.users.include? current_user
      authorize!
    else
      raise Forbidden
    end
  end
  
  protected

    class Forbidden < StandardError
    end

    def ensure_authenticated
      unless current_user
        redirect_to new_session_url(return_to: request.path)
      end
    end

    def ensure_authorized
      raise Forbidden unless authorized?
    end

    def current_user
      begin
        user = User.find_by(token: cookies[:token]) || User.find_by(token: session[:token])
        if user && !user.deactivated
          return user
        else
          if user
            cookies.delete(:token)
            session.delete(:token)
          end
          return nil
        end
      rescue ActiveRecord::RecordNotFound, ActiveRecord::StatementInvalid => e
        Rails.logger.error "Error finding user by token: #{e.message}"
        return nil
      end  
    end

    def set_team
      begin
        @team = Team.find params[:team_id]
        authorize_for! @team
      rescue ActiveRecord::RecordNotFound => e
        Rails.logger.error "Team not found: #{e.message}"
        redirect_to root_url, alert: 'Team not found'
      end
    end

    def set_sentry_context
      if current_user
        Sentry.set_user(
          id: current_user.id,
          name: current_user.name,
          email: current_user.email,
        )
      end
    end
end
