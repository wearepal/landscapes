class LabelSchemasController < ApplicationController
  before_action :set_team, only: [:index, :new, :create]
  before_action :set_label_schema, only: [:edit, :update, :destroy]

  def index
    render layout: "team"
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
    end

    def schema_params
      params.require(:label_schema).permit(:name)
    end
end
