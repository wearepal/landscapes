class Admin::TrainingDataDownloadsController < Admin::AdminController
  layout "admin/region"

  def index
    @region = Region.find(params[:region_id])
    if params[:partial]
      render partial: "table"
    end
  end
  
  def create
    labelling_group = LabellingGroup.find(params[:labelling_group_id])
    download = labelling_group.training_data_downloads.create!
    redirect_to [:admin, labelling_group.region, :training_data_downloads]
  end

  def destroy
    @download = TrainingDataDownload.find(params[:id])
    @download.destroy!
    redirect_to [:admin, @download.labelling_group.region, :training_data_downloads]
  end
end
