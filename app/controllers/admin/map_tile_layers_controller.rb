class Admin::MapTileLayersController < Admin::AdminController
  layout "admin/region"

  def index
    if params.has_key? :region_id
      @region = Region.find(params[:region_id])
    end
  end

  def edit
    @layer = MapTileLayer.find(params[:id])
    @region = @layer.region
  end

  def update
    layer = MapTileLayer.find(params[:id])
    if layer.update(params.require(:map_tile_layer).permit(:name))
      redirect_to [:admin, layer.region, :map_tile_layers]
    else
      render json: layer.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @layer = MapTileLayer.find(params[:id])
    DestroyMapTileLayerJob.perform_later @layer
    flash.notice = "Enqueued '#{@layer.name}' for deletion (this may take some time)"
    redirect_to [:admin, @layer.region, :map_tile_layers]
  end
end
