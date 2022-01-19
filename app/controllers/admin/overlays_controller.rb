class Admin::OverlaysController < Admin::AdminController
  layout "admin/region"
  
  def index
    if params.has_key? :region_id
      @region = Region.find(params[:region_id])
    end
  end

  def new
    @region = Region.find(params[:region_id])
    @overlay = @region.overlays.new
  end

  def create
    @region = Region.find(params[:region_id])
    @overlay = @region.overlays.new(overlay_params)

    if @overlay.save
      redirect_to admin_region_overlays_url(@region)
    else
      render json: @overlay.errors, status: :unprocessable_entity
    end
  end

  def edit
    @overlay = Overlay.find(params[:id])
    @region = @overlay.region
  end

  def update
    @overlay = Overlay.find(params[:id])
    
    if @overlay.update(overlay_params)
      redirect_to admin_region_overlays_url(@overlay.region)
    else
      render json: @overlay.errors, status: :unprocessable_entity
    end
  end

  def destroy
    overlay = Overlay.find(params[:id])
    overlay.destroy
    redirect_to admin_region_overlays_url(overlay.region)
  end

  private

    def overlay_params
      params.require(:overlay).permit(:name, :source, :colour)
    end
end
