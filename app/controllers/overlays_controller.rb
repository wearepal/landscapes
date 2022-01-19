class OverlaysController < ApplicationController
  skip_before_action :require_authentication, only: [:show]
  
  def show
    redirect_to Overlay.find(params[:id]).source
  end
end
