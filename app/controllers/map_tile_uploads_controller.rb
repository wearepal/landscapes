class MapTileUploadsController < ApplicationController
  layout 'region'
  before_action :set_region

  def index_table
    render partial: "table"
  end

  def new
    @upload = @region.map_tile_uploads.new
  end

  def create
    @upload = @region.map_tile_uploads.new(params.require(:map_tile_upload).permit(:archive))

    if @upload.save
      redirect_to region_map_tile_uploads_url(@region)
    else
      head :unprocessable_entity
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
end