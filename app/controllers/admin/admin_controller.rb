class Admin::AdminController < ApplicationController
  before_action :require_authorization

  def admin_root
    redirect_to admin_regions_url
  end

  protected

    def require_authorization
      redirect_to root_url unless current_user.try(:admin?)
    end
end
