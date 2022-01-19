class Admin::LabellingGroupUploadsController < Admin::AdminController
  layout "admin/region"
  
  def new
    @region = Region.find(params[:region_id])
    @upload = @region.labelling_group_uploads.new
  end

  def create
    @region = Region.find(params[:region_id])
    @upload = @region.labelling_group_uploads.new(upload_params)

    if @upload.save
      redirect_to [:admin, @upload]
    else
      render json: @upload.errors, status: :unprocessable_entity
    end
  end

  def show
    @upload = LabellingGroupUpload.find(params[:id])
    @region = @upload.region

    if params[:partial]
      render :_status, layout: false
    end
  end

  private

  def upload_params
    params.require(:labelling_group_upload).permit(:name, :label_schema_id, :source)
  end
end
