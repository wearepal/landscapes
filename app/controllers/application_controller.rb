class ApplicationController < ActionController::Base
  before_action :require_authentication
  before_action :set_sentry_context
  skip_before_action :require_authentication, only: [:root]

  helper_method :current_user

  def root
    if Region.any?
      redirect_to Region.order(:name).first
    end
  end
  
  protected

  def require_authentication
    unless current_user
      redirect_to new_session_url(return_to: request.path)
    end
  end

  def forbid_authentication
    redirect_to root_url if current_user
  end

  def current_user
    User.find_by(token: cookies[:token]) || User.find_by(token: session[:token])
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
