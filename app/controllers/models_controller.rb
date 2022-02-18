class ModelsController < ApplicationController
  before_action :set_team, only: [:index, :create]
  before_action :set_model, only: [:edit, :update, :destroy]
  
  def index
    @team = Team.find(params[:team_id])
    render layout: "team"
  end
  
  def create
    redirect_to edit_model_url(@team.models.create!(name: "Untitled model"))
  end

  def update
    if @model.update(model_params)
      render json: @model
    else
      head :unprocessable_entity
    end
  rescue ActiveRecord::StaleObjectError
    render json: { lock_version: @model.reload.lock_version }, status: :conflict
  end

  def destroy
    @model.destroy!
    redirect_to team_models_url(@model.team)
  end

  private

    def set_model
      @model = Model.find params[:id]
      @team = @model.team
      authorize_for! @team
    end

    def model_params
      params.require(:model).permit(:name, :source, :lock_version)
    end
end
