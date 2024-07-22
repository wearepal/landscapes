class ExtentsController < ApplicationController
    before_action :set_team, only: [:index, :new, :create]
  
    def index
      @team_extents = @team.extents
      render layout: "team"
    end
  
    def new
      @extent = @team.extents.new
      render layout: "team"
    end
  
    def edit
      begin
        @extent = Extent.find(params[:id])
        @team = @extent.team
        authorize_for! @extent.team
        render layout: "team"
      rescue ActiveRecord::RecordNotFound => e
        Rails.logger.error "Extent not found: #{e.message}"
        redirect_to root_url, alert: 'Extent not found'
      end
    end
  
    def destroy
      begin
        @extent = Extent.find(params[:id])
        @team = @extent.team
        authorize_for! @team
        @extent.destroy
        redirect_to team_extents_url(@team)
      rescue ActiveRecord::RecordNotFound => e
        Rails.logger.error "Extent not found: #{e.message}"
        redirect_to root_url, alert: 'Extent not found'
      end
    end
  
    def create
      values_array = params[:extent][:value].split(',').map(&:to_f)
      @extent = @team.extents.new(name: params[:extent][:name], value: values_array)
      if @extent.save
          redirect_to team_extents_url(@team)
      else
          render :new, layout: "team"
      end
    end
  
    private
  
    def set_team
      begin
        @team = Team.find(params[:team_id])
        authorize_for! @team
      rescue ActiveRecord::RecordNotFound => e
        Rails.logger.error "Team not found: #{e.message}"
        redirect_to root_url, alert: 'Team not found'
      end
    end
  end