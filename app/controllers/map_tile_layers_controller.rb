class MapTileLayersController < ApplicationController
  layout 'region'

  def index
    respond_to do |format|
      format.html { set_region }
      format.json { set_team }
    end
  end

  def edit
    @layer = MapTileLayer.find(params[:id])
    @region = @layer.region
    @team = @region.team
    authorize_for! @team
  end

  def update
    layer = MapTileLayer.find(params[:id])
    authorize_for! layer.region.team
    if layer.update(params.require(:map_tile_layer).permit(:name))
      redirect_to [layer.region, :map_tile_layers]
    else
      render json: layer.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @layer = MapTileLayer.find(params[:id])
    authorize_for! @layer.region.team
    DestroyMapTileLayerJob.perform_later @layer
    flash.notice = "Enqueued '#{@layer.name}' for deletion (this may take some time)"
    redirect_to [@layer.region, :map_tile_layers]
  end

  private

    def set_region
      @region = Region.find(params[:region_id])
      @team = @region.team
      authorize_for! @team
    end
end
