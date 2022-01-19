class Admin::ModelsController < Admin::AdminController
  def index
    render layout: "admin/root"
  end

  def show
    redirect_to edit_admin_model_url(params[:id])
  end
  
  def create
    model = Model.new(name: "Untitled model")
    model.save!
    redirect_to edit_admin_model_url(model)
  end

  def edit
    @model = Model.find(params[:id])
  end

  def update
    @model = Model.find(params[:id])
    if @model.update(model_params)
      render json: @model
    else
      head :unprocessable_entity
    end
  rescue ActiveRecord::StaleObjectError
    render json: { lock_version: @model.reload.lock_version }, status: :conflict
  end

  def destroy
    model = Model.find(params[:id])
    model.destroy!
    redirect_to admin_models_url
  end

  private

    def model_params
      params.require(:model).permit(:name, :source, :lock_version)
    end
end
