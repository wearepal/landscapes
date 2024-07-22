class LocksController < ApplicationController
  before_action :set_group

  def create
    @group.update!(locked: true)
    redirect_to @group
  end

  def destroy
    @group.update!(locked: false)
    redirect_to @group
  end

  private

    def set_group
      begin
        @group = LabellingGroup.find(params[:labelling_group_id])
        authorize_for! @group.region.team
      rescue ActiveRecord::RecordNotFound => e
        Rails.logger.error "Labelling group not found: #{e.message}"
        redirect_to root_url, alert: 'Labelling group not found'
      end
    end
end