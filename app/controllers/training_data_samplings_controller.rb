class TrainingDataSamplingsController < ApplicationController
  before_action :set_labelling_group
  layout 'region'

  def new
    @sampler = TrainingDataSampler.new
  end

  def create
    sampler = TrainingDataSampler.new(params.require(:training_data_sampler).permit(:name, :num_samples_per_label))
    if sampler.valid?
      new_group = sampler.sample(@labelling_group)
      new_group.save!
      redirect_to new_group
    else
      render json: sampler.errors, status: :unprocessable_entity
    end
  end

  private

    def set_labelling_group
      begin
        @labelling_group = LabellingGroup.find(params[:labelling_group_id])
        @region = @labelling_group.region
        @team = @region.team
        authorize_for! @team
      rescue ActiveRecord::RecordNotFound => e
        Rails.logger.error "Labelling group not found: #{e.message}"
        redirect_to root_url, alert: 'Labelling group not found'
      end
    end
end