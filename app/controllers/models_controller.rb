class ModelsController < ApplicationController
  before_action :set_team, only: [:index, :create]
  before_action :set_model, only: [:edit, :update, :destroy]
  
  def index
    begin
      @team = Team.find(params[:team_id])
      render layout: "team"
    rescue ActiveRecord::RecordNotFound => e
      Rails.logger.error "Team not found: #{e.message}"
      redirect_to root_url, alert: 'Team not found'
    end
  end
  
  def create
    redirect_to edit_model_url(@team.models.create!(name: "Untitled model"))
  end

  def show
    authorize!
    redirect_to edit_model_url(params[:id])
  end

  def update
    begin
      if @model.update(model_params)
        render json: @model
      else
        head :unprocessable_entity
      end
    rescue ActiveRecord::StaleObjectError
      render json: { lock_version: @model.reload.lock_version }, status: :conflict
    end
  end

  def destroy
    @model.destroy!
    redirect_to team_models_url(@model.team)
  end

  private

    def set_model
      begin
        @model = Model.find(params[:id])
        @team = @model.team
        authorize_for! @team
      rescue ActiveRecord::RecordNotFound => e
        Rails.logger.error "Model not found: #{e.message}"
        redirect_to root_url, alert: 'Model not found'
      end
    end

    def model_params
      params.require(:model).permit(:name, :source, :lock_version)
    rescue ActionController::ParameterMissing => e
      Rails.logger.error "Required parameter missing: #{e.message}"
      render json: { error: 'Required parameter missing' }, status: :bad_request
    end
end