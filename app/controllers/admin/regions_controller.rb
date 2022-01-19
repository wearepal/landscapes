class Admin::RegionsController < Admin::AdminController
  def index
    render layout: "admin/root"
  end

  def show
    redirect_to admin_region_labelling_groups_url(Region.find(params[:id]))
  end

  def new
    @region = Region.new
    render layout: "admin/root"
  end

  def create
    @region = Region.new(region_params)
    if @region.save
      redirect_to admin_region_url(@region)
    else
      render json: @region.errors, status: :unprocessable_entity
    end
  end

  private

    def region_params
      params.require(:region).permit(:name)
    end
end
