class Admin::MapTileDownloadsController < Admin::AdminController
  layout "admin/region"
  
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
      redirect_to [:admin, @region, :map_tile_downloads]
    else
      render json: @download.errors, status: :unprocessable_entity
    end
  end

  private

    def set_region
      @region = Region.find(params[:region_id])
    end

    def download_params
      params.require(:map_tile_download).permit(:year, :zoom)
    end
end
