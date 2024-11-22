class AdminController < ApplicationController

  def index
    if current_user.admin?
      @users = User.all
      @teams = Team.all
      authorize!
    else
      redirect_to root_path
    end
  end
end
