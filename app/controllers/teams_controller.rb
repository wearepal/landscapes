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
    redirect_to team_regions_url(@team)
  rescue ActiveRecord::RecordInvalid
    render json: @team.errors, status: :unprocessable_entity
  end

  def edit
    @team = Team.find params[:id]
    authorize_for! @team
    render layout: 'team'
  end

  def update
    @team = Team.find params[:id]
    authorize_for! @team

    if @team.update(team_params)
      redirect_to edit_team_url(@team)
    else
      render json: @team.errors, status: :unprocessable_entity
    end
  end

  def select_team
    authorize!

    @teams = current_user.teams

  end

  private

    def team_params
      params.require(:team).permit(:name)
    end
end
