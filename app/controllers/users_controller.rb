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
  rescue ActionController::ParameterMissing => e
    Rails.logger.error "Required parameter missing: #{e.message}"
    render json: { error: 'Required parameter missing' }, status: :bad_request
  end
end