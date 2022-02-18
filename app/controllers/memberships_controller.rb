class MembershipsController < ApplicationController
  before_action :set_team, only: [:index]
  layout 'team'

  def destroy
    membership = Membership.find(params[:id])
    authorize_for! membership.team
    raise Forbidden if membership.user == current_user
    membership.destroy
    redirect_to team_memberships_url(membership.team)
  end
end
