class UsersController < ApplicationController
  skip_before_action :ensure_authenticated, only: [:new, :create]
  
  def new
    authorize!
    @user = User.new
  end

  def create
    authorize!
    @user = User.new(params.require(:user).permit(:name, :email, :password))

    if @user.save
      cookies.permanent[:token] = @user.token
      redirect_to root_url
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end
end
