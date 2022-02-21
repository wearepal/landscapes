class LabellingsController < ApplicationController
  skip_before_action :ensure_authenticated, only: [:show]
  before_action :set_labelling, only: [:edit, :update, :destroy]
  
  def show
    @labelling = Labelling.find(params[:id])
    @labelling_group = @labelling.labelling_group
    authorize!

    respond_to do |format|
      format.json do
        render json: {
          zoom: @labelling_group.zoom,
          x: @labelling_group.x,
          y: @labelling_group.y,
          width: @labelling_group.width,
          height: @labelling_group.height,
          data: Base64.strict_encode64(@labelling.data),
        }
      end
      format.png do
        colours = @labelling_group.label_schema.labels.select do |label|
          params.fetch(:labels, []).include? label.index.to_s
        end.map do |label|
          [label.index, ChunkyPNG::Color(label.colour)]
        end.to_h

        # TODO: If Labelling.data had the same pixel ordering as the PNG file format,
        # then this transpose would be unnecessary and we could render faster
        bytes = @labelling.data.unpack("C*").each_slice(@labelling_group.height).to_a.transpose.flatten.flat_map do |label_index|
          colours[label_index] || ChunkyPNG::Color::TRANSPARENT
        end.pack "L>*"
        
        image = ChunkyPNG::Image.from_rgba_stream(@labelling_group.width, @labelling_group.height, bytes)
        send_data image.to_datastream, type: "image/png", disposition: "inline"
      end
    end
  end

  def create
    @labelling_group = LabellingGroup.find(params[:labelling_group_id])
    authorize_for! @labelling_group.region.team
    @labelling = @labelling_group.labellings.new(params.require(:labelling).permit(:map_tile_layer_id))
    if params[:labelling].has_key? :data
      @labelling.data = Base64.decode64(params[:labelling][:data])
    end
    if @labelling.save
      respond_to do |format|
        format.html { redirect_to @labelling_group }
        format.json { head :no_content }
      end
    else
      head :unprocessable_entity
    end
  end

  def edit
    @bounds = [
      Convert.to_lat_lng(@labelling_group.x, @labelling_group.y, @labelling_group.zoom),
      Convert.to_lat_lng(@labelling_group.x + @labelling_group.width, @labelling_group.y + @labelling_group.height, @labelling_group.zoom)
    ]
  end

  def update
    if @labelling.update(data: Base64.decode64(params["data"]))
      head :ok
    else
      head :unprocessable_entity
    end
  end

  def destroy
    @labelling.destroy
    redirect_to @labelling.labelling_group
  end

  private

    def set_labelling
      @labelling = Labelling.find params[:id]
      @labelling_group = @labelling.labelling_group
      @team = @labelling_group.region.team
      authorize_for! @team
    end
end
