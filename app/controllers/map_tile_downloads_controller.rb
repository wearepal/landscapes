class MapTileDownloadsController < ApplicationController
  layout 'region'
  before_action :set_region

  def index
    render partial: "table" if params[:partial]
  end

  def new
    @download = @region.map_tile_downloads.new
    @download.zoom = @region.map_tiles.maximum(:zoom)
  end

  def create
    @download = @region.map_tile_downloads.new(download_params)

    if @download.save
      redirect_to [@region, :map_tile_downloads]
    else
      render json: @download.errors, status: :unprocessable_entity
    end
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

    def download_params
      params.require(:map_tile_download).permit(:year, :zoom)
    rescue ActionController::ParameterMissing => e
      Rails.logger.error "Required parameter missing: #{e.message}"
      render json: { error: 'Required parameter missing' }, status: :bad_request
    end
end