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
    begin
      authorize!
      redirect_to Overlay.find(params[:id]).source
    rescue ActiveRecord::RecordNotFound => e
      Rails.logger.error "Overlay not found: #{e.message}"
      redirect_to root_url, alert: 'Overlay not found'
    end
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
      begin
        @region = Region.find(params[:region_id])
        @team = @region.team
        authorize_for! @team
      rescue ActiveRecord::RecordNotFound => e
        Rails.logger.error "Region not found: #{e.message}"
        redirect_to root_url, alert: 'Region not found'
      end
    end

    def set_overlay
      begin
        @overlay = Overlay.find(params[:id])
        @region = @overlay.region
        @team = @region.team
        authorize_for! @team
      rescue ActiveRecord::RecordNotFound => e
        Rails.logger.error "Overlay not found: #{e.message}"
        redirect_to root_url, alert: 'Overlay not found'
      end
    end

    def overlay_params
      params.require(:overlay).permit(:name, :source, :colour)
    rescue ActionController::ParameterMissing => e
      Rails.logger.error "Required parameter missing: #{e.message}"
      render json: { error: 'Required parameter missing' }, status: :bad_request
    end
end