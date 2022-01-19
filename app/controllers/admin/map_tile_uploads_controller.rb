class Admin::MapTileUploadsController < Admin::AdminController
  layout "admin/region"
  
  before_action :set_region

  def index
  end

  def index_table
    render partial: "table"
  end

  def new
    @upload = @region.map_tile_uploads.new
  end

  def create
    @upload = @region.map_tile_uploads.new(params.require(:map_tile_upload).permit(:archive))

    if @upload.save
      redirect_to admin_region_map_tile_uploads_url(@region)
    else
      head :unprocessable_entity
    end
  end

  private

    def set_region
      @region = Region.find(params[:region_id])
    end
end
