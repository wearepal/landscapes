class UsersController < ApplicationController
  skip_before_action :ensure_authenticated, only: [:new, :create]
  
  def new
    authorize!
    @user = User.new
  end

  def autocomplete
    authorize!    
    query = params[:query]
    users = User.where("(email ILIKE ? OR name ILIKE ?) AND id != ?", "%#{query}%", "%#{query}%", current_user.id).limit(10)
    
    render json: users.select(:email, :name)
  end

  def create
    authorize!
    @user = User.new(params.require(:user).permit(:name, :email, :password))

    if @user.save
      # Add user to default team as guest if one exists
      if default_team = Setting.first&.default_team
        default_team.memberships.create!(user: @user, guest: true)
      end
      
      cookies.permanent[:token] = @user.token
      redirect_to root_url
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  rescue ActionController::ParameterMissing => e
    Rails.logger.error "Required parameter missing: #{e.message}"
    render json: { error: 'Required parameter missing' }, status: :bad_request
  end

  def change_password
    authorize!
    @user = current_user
  end

  def update_password
    authorize!
    @user = current_user

    if @user.authenticate(params[:current_password])
      if @user.update(password: params[:password], password_confirmation: params[:password_confirmation])
        redirect_to root_url, notice: 'Password was successfully updated.'
      else
        render json: @user.errors, status: :unprocessable_entity
      end
    else
      render json: { current_password: ['is incorrect'] }, status: :unprocessable_entity
    end
  end
end