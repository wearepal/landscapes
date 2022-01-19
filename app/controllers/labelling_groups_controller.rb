require 'varint'

class LabellingGroupsController < ApplicationController
  skip_before_action :require_authentication

  def show
    redirect_to root_url(anchor: map_view_encoding(LabellingGroup.find(params[:id])))
  end

  private

    def map_view_encoding(group)
      region = group.region
      label_schema = group.label_schema
      labelling = group.labellings.last!

      io = StringIO.new
      
      Varint.encode io, 0 # Serialisation version
      Varint.encode io, region.id

      Varint.encode io, 6 # Flags
      Varint.encode io, labelling.map_tile_layer_id

      Varint.encode io, labelling.id
      Varint.encode io, 4 # Labelling opacity * 10
      Varint.encode io, label_schema.labels.count
      label_schema.labels.each do |label|
        Varint.encode io, label.id
      end

      Varint.encode io, 0

      Base58.binary_to_base58 io.string.b, :bitcoin
    end
end
