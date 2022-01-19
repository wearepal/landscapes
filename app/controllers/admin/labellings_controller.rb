class Admin::LabellingsController < Admin::AdminController
  def show
    @labelling = Labelling.find(params[:id])
    @labelling_group = @labelling.labelling_group
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
    end
  end

  def create
    @labelling_group = LabellingGroup.find(params[:labelling_group_id])
    @labelling = @labelling_group.labellings.new(params.require(:labelling).permit(:map_tile_layer_id))
    if params[:labelling].has_key? :data
      @labelling.data = Base64.decode64(params[:labelling][:data])
    end
    if @labelling.save
      respond_to do |format|
        format.html { redirect_to [:admin, @labelling_group] }
        format.json { head :no_content }
      end
    else
      head :unprocessable_entity
    end
  end

  def edit
    @labelling = Labelling.find(params[:id])
    @labelling_group = @labelling.labelling_group

    @bounds = [
      Convert.to_lat_lng(@labelling_group.x, @labelling_group.y, @labelling_group.zoom),
      Convert.to_lat_lng(@labelling_group.x + @labelling_group.width, @labelling_group.y + @labelling_group.height, @labelling_group.zoom)
    ]
  end

  def update
    @labelling = Labelling.find(params[:id])

    if @labelling.update(data: Base64.decode64(params["data"]))
      head :ok
    else
      head :unprocessable_entity
    end
  end

  def destroy
    labelling = Labelling.find(params[:id])
    labelling.destroy
    redirect_to [:admin, labelling.labelling_group]
  end
end
