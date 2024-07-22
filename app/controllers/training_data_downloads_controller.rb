class TrainingDataDownloadsController < ApplicationController
  layout 'region'

  def index
    begin
      @region = Region.find(params[:region_id])
      @team = @region.team
      authorize_for! @team
      if params[:partial]
        render partial: "table"
      end
    rescue ActiveRecord::RecordNotFound => e
      Rails.logger.error "Region not found: #{e.message}"
      redirect_to root_url, alert: 'Region not found'
    end
  end
  
  def create
    begin
      labelling_group = LabellingGroup.find(params[:labelling_group_id])
      authorize_for! labelling_group.region.team
      download = labelling_group.training_data_downloads.create!
      redirect_to [labelling_group.region, :training_data_downloads]
    rescue ActiveRecord::RecordNotFound => e
      Rails.logger.error "Labelling group not found: #{e.message}"
      redirect_to root_url, alert: 'Labelling group not found'
    end
  end

  def destroy
    begin
      @download = TrainingDataDownload.find(params[:id])
      authorize_for! @download.labelling_group.region.team
      @download.destroy!
      redirect_to [@download.labelling_group.region, :training_data_downloads]
    rescue ActiveRecord::RecordNotFound => e
      Rails.logger.error "Training data download not found: #{e.message}"
      redirect_to root_url, alert: 'Training data download not found'
    end
  end
end