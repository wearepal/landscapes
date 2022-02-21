class MapsController < ApplicationController
  skip_before_action :ensure_authenticated

  def show
    authorize!
  end
end
