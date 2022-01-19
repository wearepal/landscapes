class UsersController < ApplicationController
  skip_before_action :require_authentication, only: [:new, :create]
  before_action :forbid_authentication, only: [:new, :create]
  
  def new
    @user = User.new
  end

  def create
    @user = User.new(params.require(:user).permit(:name, :email, :password))

    if @user.save
      cookies.permanent[:token] = @user.token
      redirect_to root_url
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end
end
