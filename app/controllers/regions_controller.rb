require 'varint'

class RegionsController < ApplicationController
  skip_before_action :require_authentication, only: [:show]

  def show
    redirect_to root_url(anchor: map_view_encoding(Region.find(params[:id])))
  end

  private

    def map_view_encoding(region)
      io = StringIO.new
      
      Varint.encode io, 0 # Serialisation version
      Varint.encode io, region.id

      Varint.encode io, 2 # Flags
      Varint.encode io, region.map_tile_layers.last!.id

      Varint.encode io, 0

      Base58.binary_to_base58 io.string.b, :bitcoin
    end
end
