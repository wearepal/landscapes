class TeamsController < ApplicationController
  def new
    authorize!
    @team = Team.new
  end

  def create
    authorize!
    @team = Team.new(team_params)
    ActiveRecord::Base.transaction do
      @team.save!
      @team.memberships.create! user: current_user
    end
    redirect_to team_projects_url(@team)
  rescue ActiveRecord::RecordInvalid => e
    Rails.logger.error "Error creating team: #{e.message}"
    render json: @team.errors, status: :unprocessable_entity
  end

  def edit
    @team = Team.find(params[:id])
    authorize_for! @team
    render layout: 'team'
  rescue ActiveRecord::RecordNotFound => e
    Rails.logger.error "Team not found: #{e.message}"
    redirect_to root_url, alert: 'Team not found'
  end

  def update
    @team = Team.find(params[:id])
    authorize_for! @team

    if @team.update(team_params)
      redirect_to edit_team_url(@team)
    else
      render json: @team.errors, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound => e
    Rails.logger.error "Team not found: #{e.message}"
    redirect_to root_url, alert: 'Team not found'
  end

  def toggle_permission
    admin = current_user.admin?
    if admin
      authorize!
    else
      redirect_to root_path
    end
    team = Team.find(params[:id])
    permission = Permission.find_or_create_by(name: params[:permission_key])
    team_permission = TeamPermission.find_or_create_by(team: team, permission: permission)
    team_permission.update(enabled: !team_permission.enabled)
    redirect_to admin_index_path
  end

  def select_team
    authorize!
    @teams = current_user.teams
  end

  private

    def team_params
      params.require(:team).permit(:name)
    rescue ActionController::ParameterMissing => e
      Rails.logger.error "Required parameter missing: #{e.message}"
      render json: { error: 'Required parameter missing' }, status: :bad_request
    end
end