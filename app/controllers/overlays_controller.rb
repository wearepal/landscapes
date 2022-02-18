class OverlaysController < ApplicationController
  skip_before_action :ensure_authenticated, only: [:show]
  before_action :set_region, only: [:new, :create]
  before_action :set_overlay, only: [:edit, :update, :destroy]
  layout 'region'

  def index
    respond_to do |format|
      format.html { set_region }
      format.json { set_team }
    end
  end
  
  def show
    authorize!
    redirect_to Overlay.find(params[:id]).source
  end

  def new
    @overlay = @region.overlays.new
  end

  def create
    @overlay = @region.overlays.new(overlay_params)

    if @overlay.save
      redirect_to region_overlays_url(@region)
    else
      render json: @overlay.errors, status: :unprocessable_entity
    end
  end

  def update
    if @overlay.update(overlay_params)
      redirect_to region_overlays_url(@overlay.region)
    else
      render json: @overlay.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @overlay.destroy
    redirect_to region_overlays_url(@overlay.region)
  end

  private

    def set_region
      @region = Region.find params[:region_id]
      @team = @region.team
      authorize_for! @team
    end

    def set_overlay
      @overlay = Overlay.find params[:id]
      @region = @overlay.region
      @team = @region.team
      authorize_for! @team
    end

    def overlay_params
      params.require(:overlay).permit(:name, :source, :colour)
    end
end
