class LabelSchemasController < ApplicationController
  before_action :set_team, only: [:index, :new, :create]
  before_action :set_label_schema, only: [:edit, :update, :destroy]

  def index
    render layout: "team"
  end

  def show
    authorize!
    redirect_to label_schema_labels_url(params[:id])
  end

  def new
    @label_schema = @team.label_schemas.new
    render layout: "team"
  end

  def create
    @label_schema = @team.label_schemas.new(schema_params)

    if @label_schema.save
      redirect_to label_schema_labels_url(@label_schema)
    else
      render json: @label_schema.errors, status: :unprocessable_entity
    end
  end

  def edit
    render layout: "label_schema"
  end

  def update
    if @label_schema.update(schema_params)
      redirect_to edit_label_schema_url(@label_schema)
    else
      render json: @label_schema.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @label_schema.destroy
    redirect_to team_label_schemas_url(@team)
  end

  private

    def set_label_schema
      @label_schema = LabelSchema.find params[:id]
      @team = @label_schema.team
      authorize_for! @team
    rescue ActiveRecord::RecordNotFound => e
      Rails.logger.error "Label schema not found: #{e.message}"
      redirect_to root_url, alert: 'Label schema not found'
    end

    def set_team
      @team = Team.find(params[:team_id])
      authorize_for! @team
    rescue ActiveRecord::RecordNotFound => e
      Rails.logger.error "Team not found: #{e.message}"
      redirect_to root_url, alert: 'Team not found'
    end

    def schema_params
      params.require(:label_schema).permit(:name)
    rescue ActionController::ParameterMissing => e
      Rails.logger.error "Required parameter missing: #{e.message}"
      render json: { error: 'Required parameter missing' }, status: :bad_request
    end
end