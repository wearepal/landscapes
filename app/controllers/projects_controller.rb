class ProjectsController < ApplicationController
  before_action :set_team, only: [:index, :new, :create]

  def index
    render layout: "team"
  end

  def new
    @project = @team.projects.new
    render layout: "team"
  end

  def create
    @project = @team.projects.new(params.require(:project).permit(:name))
    if @project.save
      redirect_to team_projects_url(@team)
    else
      render json: @project.errors, status: :unprocessable_entity
    end
  end

  def show
    @project = Project.find(params[:id])
    @team = @project.team
    authorize_for! @team
  end
end
