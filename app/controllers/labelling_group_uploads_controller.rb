class LabellingGroupUploadsController < ApplicationController
  before_action :set_region, only: [:new, :create]
  layout 'region'
  
  def new
    @upload = @region.labelling_group_uploads.new
  end

  def create
    @upload = @region.labelling_group_uploads.new(upload_params)

    if @upload.save
      redirect_to @upload
    else
      render json: @upload.errors, status: :unprocessable_entity
    end
  end

  def show
    @upload = LabellingGroupUpload.find params[:id]
    @region = @upload.region
    @team = @region.team
    authorize_for! @team

    if params[:partial]
      render :_status, layout: false
    end
  end

  private

    def set_region
      @region = Region.find params[:region_id]
      @team = @region.team
      authorize_for! @team
    end

    def upload_params
      params.require(:labelling_group_upload).permit(:name, :label_schema_id, :source)
    end
end
