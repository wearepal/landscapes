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
    begin
      @upload = LabellingGroupUpload.find params[:id]
      @region = @upload.region
      @team = @region.team
      authorize_for! @team

      if params[:partial]
        render :_status, layout: false
      end
    rescue ActiveRecord::RecordNotFound => e
      Rails.logger.error "Labelling group upload not found: #{e.message}"
      redirect_to root_url, alert: 'Labelling group upload not found'
    end
  end

  private

    def set_region
      begin
        @region = Region.find params[:region_id]
        @team = @region.team
        authorize_for! @team
      rescue ActiveRecord::RecordNotFound => e
        Rails.logger.error "Region not found: #{e.message}"
        redirect_to root_url, alert: 'Region not found'
      end
    end

    def upload_params
      params.require(:labelling_group_upload).permit(:name, :label_schema_id, :source)
    rescue ActionController::ParameterMissing => e
      Rails.logger.error "Required parameter missing: #{e.message}"
      render json: { error: 'Required parameter missing' }, status: :bad_request
    end
end