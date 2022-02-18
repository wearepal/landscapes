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
      User.find_by(token: cookies[:token]) || User.find_by(token: session[:token])
    end

    def set_team
      @team = Team.find params[:team_id]
      authorize_for! @team
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
