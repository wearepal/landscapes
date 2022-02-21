class LocksController < ApplicationController
  before_action :set_group

  def create
    @group.update! locked: true
    redirect_to @group
  end

  def destroy
    @group.update! locked: false
    redirect_to @group
  end

  private

    def set_group
      @group = LabellingGroup.find params[:labelling_group_id]
      authorize_for! @group.region.team
    end
end
