class LabellingCorrectionsController < ApplicationController
  before_action :set_labelling

  def new
    @label = params[:label_id].present? ? @group.label_schema.labels.find(params[:label_id]) : nil

    labels = @labelling.data.bytes
    @tiles = labels.lazy.each_with_index.drop(params[:cursor].to_i).map do |label, tile_index|
      if label == (@label.try(&:index) || 255)
        x, y = @labelling.from_index tile_index
        [@labelling.map_tile_layer.map_tiles.find_by!(x: x, y: y, zoom: @group.zoom), tile_index]
      end
    end.reject(&:nil?).first(126)

    @last_page = @tiles.count < 126

    if params.has_key?(:prev_cursors)
      if params[:prev_cursors].is_a? Array
        # This is an old link that someone has bookmarked, we still need to support it
        @prev_cursors = params[:prev_cursors].map(&:to_i)
      else
        @prev_cursors = JSON.parse(params[:prev_cursors])
      end
    else
      @prev_cursors = []
    end
    @cursor = params[:cursor].to_i
  end

  def create
    label_index = params[:label_index].to_i
    x, y = @labelling.from_index(params[:tile_index].to_i)
    @labelling.set x, y, label_index == 255 ? nil : label_index
    @labelling.save!
    head :ok
  end

  private

    def set_labelling
      @labelling = Labelling.find params[:labelling_id]
      @group = @labelling.labelling_group
      @region = @group.region
      @team = @region.team
      authorize_for! @team
    end
end
