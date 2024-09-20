class ExpressionsController < ApplicationController

    before_action :set_team, only: [:index, :new, :create]

    def index
        @team_expressions = @team.expressions
        
        if params[:json].present?

            json_exp = @team_expressions.map do |expression|
                expression.attributes.merge('id' => -expression.id)
            end

            render json: json_exp
        else
            render layout: "team"
        end
    end

    def new
        @expression = @team.expressions.new
        render layout: "team"
    end

    def destroy
        begin
            @expression = Expression.find(params[:id])
            @team = @expression.team
            authorize_for! @team
            @expression.destroy
            redirect_to team_expressions_url(@team)
        rescue ActiveRecord::RecordNotFound => e
            Rails.logger.error "Expression not found: #{e.message}"
            redirect_to root_url, alert: 'Expression not found'
        end
    end

    def create
        puts params
        @expression = @team.expressions.new(name: params[:expression][:name], expression: params[:expression][:expression])
        if @expression.save
            redirect_to team_expressions_url(@team)
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
