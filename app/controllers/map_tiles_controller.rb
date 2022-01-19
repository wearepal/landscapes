class MapTilesController < ApplicationController
  skip_before_action :require_authentication, only: [:show, :new_show]

  def show
    layer = MapTileLayer.find(params[:map_tile_layer_id])
    tile = layer.map_tiles.find_by!(params.permit(:x, :y, :zoom))
    redirect_to tile.source
  end
end
