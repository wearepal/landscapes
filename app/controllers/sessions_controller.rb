class SessionsController < ApplicationController
  skip_before_action :ensure_authenticated, only: [:new, :create]
  
  def new
    authorize!
  end

  def create
    authorize!
    user = User.find_by(params.permit(:email))
    
    if user.try(:authenticate, params[:password])
      cookies.permanent[:token] = user.token
      redirect_to validate_url(params[:return_to]) || root_url
    else
      head :unprocessable_entity
    end
  end

  def destroy
    authorize!
    cookies.delete :token
    session.delete :token
    redirect_to root_url
  end

  private

    def validate_url(url)
      Rails.application.routes.recognize_path(url)
      url
    rescue ActionController::RoutingError
      nil
    end
end
