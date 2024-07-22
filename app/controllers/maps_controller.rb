class MapsController < ApplicationController
  skip_before_action :ensure_authenticated

  def show
    begin
      authorize!
    end
  end
end