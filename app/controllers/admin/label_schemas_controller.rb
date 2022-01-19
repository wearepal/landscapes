class Admin::LabelSchemasController < Admin::AdminController
  def index
    render layout: "admin/root"
  end

  def show
    redirect_to admin_label_schema_labels_url(LabelSchema.find(params[:id]))
  end

  def new
    @label_schema = LabelSchema.new
    render layout: "admin/root"
  end

  def edit
    @label_schema = LabelSchema.find(params[:id])
    render layout: "admin/label_schema"
  end

  def create
    @label_schema = LabelSchema.new(schema_params)

    if @label_schema.save
      redirect_to admin_label_schema_url(@label_schema)
    else
      render json: @label_schema.errors, status: :unprocessable_entity
    end
  end

  def update
    @label_schema = LabelSchema.find(params[:id])

    if @label_schema.update(schema_params)
      redirect_to [:admin, @label_schema, action: :edit]
    else
      render json: @label_schema.errors, status: :unprocessable_entity
    end
  end

  def destroy
    label_schema = LabelSchema.find(params[:id])
    label_schema.destroy
    redirect_to admin_label_schemas_url
  end

  private

    def schema_params
      params.require(:label_schema).permit(:name)
    end
end
