class Admin::LocksController < Admin::AdminController
  def create
    group = LabellingGroup.find(params[:labelling_group_id])
    group.update! locked: true
    redirect_to [:admin, group]
  end

  def destroy
    group = LabellingGroup.find(params[:labelling_group_id])
    group.update! locked: false
    redirect_to [:admin, group]
  end
end
