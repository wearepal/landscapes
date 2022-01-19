class Admin::LabelsController < Admin::AdminController
  layout "admin/label_schema"
  
  def index
    @label_schema = LabelSchema.find(params[:label_schema_id])
    respond_to do |format|
      format.html
      format.json { render json: @label_schema.labels.order(:index) }
    end
  end

  def new
    @label_schema = LabelSchema.find(params[:label_schema_id])
    @label = @label_schema.labels.new
  end

  def edit
    @label = Label.find(params[:id])
    @label_schema = @label.label_schema
  end

  def create
    @label_schema = LabelSchema.find(params[:label_schema_id])
    @label = @label_schema.labels.new(label_params)

    if @label.save
      redirect_to admin_label_schema_labels_url(@label_schema)
    else
      render json: @label.errors, status: :unprocessable_entity
    end
  end

  def update
    @label = Label.find(params[:id])
    if @label.update(label_params)
      redirect_to admin_label_schema_labels_url(@label.label_schema)
    else
      render json: @label.errors, status: :unprocessable_entity
    end
  end

  def destroy
    label = Label.find(params[:id])
    label.destroy
    redirect_to admin_label_schema_labels_url(label.label_schema)
  end

  private

    def label_params
      params.require(:label).permit(:index, :label, :name, :colour)
    end
end
