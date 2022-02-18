class MembershipsController < ApplicationController
  before_action :set_team, only: [:index, :new, :create]
  layout 'team'

  def new
    @membership = @team.memberships.new
  end

  def create
    user = User.find_by params.require(:membership).permit(:email)
    if user.nil?
      # TODO: create the user then send them an invitation by email to reset their password
      render json: { email: ["is not present in the system - please have them sign up first"] }, status: :unprocessable_entity
    elsif @team.users.include? user
      render json: { email: ["is already a member of this team"] }, status: :unprocessable_entity
    else
      @team.memberships.create! user: user
      redirect_to team_memberships_url(@team)
    end
  end

  def destroy
    membership = Membership.find(params[:id])
    authorize_for! membership.team
    raise Forbidden if membership.user == current_user
    membership.destroy
    redirect_to team_memberships_url(membership.team)
  end
end
