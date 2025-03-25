class ProjectsController < ApplicationController
  before_action :set_team, only: [:index, :new, :create]

  def index
    @team_projects = @team.projects.select(:id, :source, :updated_at)
      .order(Arel.sql("source->>'name'"))
      .pluck(:id, Arel.sql("source->>'name'"), :updated_at)
      .map { |id, name, updated_at| OpenStruct.new(id: id, name: name, updated_at: updated_at) }
    render layout: "team"
  end

  def new
    @extents = @team.extents
    @project = @team.projects.new
    render layout: "team"
  end

  def edit
    begin
      @project = Project.find(params[:id])
      @team = @project.team
      @extents = @team.extents
      authorize_for! @project.team
      render layout: "team"
    rescue ActiveRecord::RecordNotFound => e
      Rails.logger.error "Project not found: #{e.message}"
      redirect_to root_url, alert: 'Project not found'
    end
  end

  def create
    @project = @team.projects.new(params.require(:project).permit(:name, :extent, :cql, :layer))
    if @project.save
      redirect_to project_url(@project)
    else
      render json: @project.errors, status: :unprocessable_entity
    end
  end

  def update
    begin
      @project = Project.find(params[:id])
      authorize_for! @project.team
      if params[:project].present? && params[:project][:source].present?
        if @project.update(source: JSON.parse(params.require(:project).require(:source)))
          head :ok
        else
          head :unprocessable_entity
        end
      else
        @team = @project.team
        existing_source = @project.source || {}
        existing_source["name"] = params.require(:project).require(:name)
        existing_source["extent"] = params.require(:project).require(:extent).split(",").map(&:to_f)
        existing_source["cql"] = params[:project][:cql] if params[:project].key?(:cql)
        existing_source["layer"] = params[:project][:layer] if params[:project].key?(:layer)
      
        if @project.update(source: existing_source)
          if params[:commit] == 'Save and open project'
            redirect_to project_url(@project)
          elsif params[:commit] == 'Save and return to menus'
            redirect_to team_projects_url(@team)
          end
        end
      end
    rescue ActiveRecord::RecordNotFound => e
      Rails.logger.error "Project not found: #{e.message}"
      redirect_to root_url, alert: 'Project not found'
    end
  end

  def show
    begin
      @project = Project.find(params[:id])
      @team = @project.team
      authorize_for! @team
    rescue ActiveRecord::RecordNotFound => e
      Rails.logger.error "Project not found: #{e.message}"
      redirect_to root_url, alert: 'Project not found'
    end
  end

  def destroy
    begin
      @project = Project.find(params[:id])
      @team = @project.team
      authorize_for! @team
      @project.destroy
      redirect_to team_projects_url(@team)
    rescue ActiveRecord::RecordNotFound => e
      Rails.logger.error "Project not found: #{e.message}"
      redirect_to root_url, alert: 'Project not found'
    end
  end

  def clone_to_team
    @source_project = Project.find(params[:id])
    @target_team = Team.find(params[:team_id])
    
    authorize_for! @source_project.team
    authorize_for! @target_team

    new_project = @target_team.projects.new
    new_project.source = @source_project.source.deep_dup
    base_name = @source_project.name.sub(/\s*\(\d+\)\s*$/, '').sub(/\s*\(copy\)\s*$/, '')
    new_project.name = "#{base_name} (Copied from #{@source_project.team.name})"

    if new_project.save
      redirect_to team_projects_url(@target_team)
    else
      redirect_to team_projects_url(@source_project.team)
    end
  end
end