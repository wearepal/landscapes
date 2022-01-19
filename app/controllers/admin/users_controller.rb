class Admin::UsersController < Admin::AdminController
  layout "admin/root"
  
  before_action :set_user, only: [:promote, :demote, :destroy]

  def promote
    @user.update! admin: true
    redirect_to admin_users_url
  end

  def demote
    @user.update! admin: false
    redirect_to admin_users_url
  end

  def destroy
    @user.destroy
    redirect_to admin_users_url
  end

  private

    def set_user
      @user = User.find(params[:id])
      if @user == current_user
        head :unprocessable_entity
      end
    end
end
