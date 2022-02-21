class TrainingDataDownloadsController < ApplicationController
  layout 'region'

  def index
    @region = Region.find(params[:region_id])
    @team = @region.team
    authorize_for! @team
    if params[:partial]
      render partial: "table"
    end
  end
  
  def create
    labelling_group = LabellingGroup.find(params[:labelling_group_id])
    authorize_for! labelling_group.region.team
    download = labelling_group.training_data_downloads.create!
    redirect_to [labelling_group.region, :training_data_downloads]
  end

  def destroy
    @download = TrainingDataDownload.find(params[:id])
    authorize_for! @download.labelling_group.region.team
    @download.destroy!
    redirect_to [@download.labelling_group.region, :training_data_downloads]
  end
end
