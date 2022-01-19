class Admin::TrainingDataSamplingsController < Admin::AdminController
  layout "admin/region"

  def new
    @labelling_group = LabellingGroup.find(params[:labelling_group_id])
    @region = @labelling_group.region
    @sampler = TrainingDataSampler.new
  end

  def create
    source_group = LabellingGroup.find(params[:labelling_group_id])
    sampler = TrainingDataSampler.new(params.require(:training_data_sampler).permit(:name, :num_samples_per_label))
    if sampler.valid?
      dst_group = sampler.sample(source_group)
      dst_group.save!
      redirect_to [:admin, dst_group]
    else
      render json: sampler.errors, status: :unprocessable_entity
    end
  end
end
