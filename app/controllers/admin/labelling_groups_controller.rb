class Admin::LabellingGroupsController < Admin::AdminController
  layout "admin/region"
  
  def index
    @region = Region.find(params[:region_id])
  end

  def show
    @labelling_group = LabellingGroup.find(params[:id])
    @region = @labelling_group.region
  end

  def new
    @region = Region.find(params[:region_id])
    @labelling_group = @region.labelling_groups.new
  end

  def create
    @region = Region.find(params[:region_id])
    @labelling_group = @region.labelling_groups.new(params.require(:labelling_group).permit(:name, :label_schema_id, :zoom, :x, :y, :width, :height))

    if @labelling_group.save
      respond_to do |format|
        format.js { redirect_to [:admin, @labelling_group] }
        format.json { render json: @labelling_group, status: :created }
      end
    else
      render json: @labelling_group.errors, status: :unprocessable_entity
    end
  end

  def edit
    @labelling_group = LabellingGroup.find(params[:id])
    @region = @labelling_group.region
  end

  def update
    @labelling_group = LabellingGroup.find(params[:id])
    @region = @labelling_group.region
    if @labelling_group.update(params.require(:labelling_group).permit(:name))
      redirect_to [:admin, @labelling_group]
    else
      render json: @labelling_group.errors, status: :unprocessable_entity
    end
  end

  def destroy
    labelling_group = LabellingGroup.find(params[:id])
    labelling_group.destroy
    respond_to do |format|
      format.html { redirect_to [:admin, labelling_group.region, :labelling_groups] }
      format.json { head :no_content }
    end
  end
end
