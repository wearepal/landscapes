class AdminController < ApplicationController
  protect_from_forgery with: :null_session, if: -> { request.format.json? }
  before_action :require_admin

  def index
    @users = User.all
    @teams = Team.all
    authorize!
  end

  private

  def require_admin
    unless current_user&.admin?
      redirect_to root_path, alert: 'You must be an admin to access this page.'
    end
  end
end
