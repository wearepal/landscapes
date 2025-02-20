class DatasetsController < ApplicationController
    before_action :set_team, only: [:index, :new, :create, :show]

    def create
      begin
        name = params[:name]
        existing_dataset = Dataset.find_by(:name => name)
    
        if existing_dataset.present?
          name = generate_unique_name(name)
        end
    
        @dataset = @team.datasets.new(:name => name, :file => params[:file], :gridtype => params[:gridtype])
    
        if @dataset.save
          render json: @compiled, status: :created
        else
          render json: @dataset.errors, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordInvalid => e
        Rails.logger.error "Invalid record: #{e.message}"
        render json: { error: 'Invalid record' }, status: :unprocessable_entity
      rescue ActiveRecord::RecordNotFound => e
        Rails.logger.error "Record not found: #{e.message}"
        render json: { error: 'Record not found' }, status: :not_found
      end
      end

    def edit
      begin
          @dataset = Dataset.find(params[:id])
          @team = @dataset.team
          authorize_for! @team
          render layout: "team"
      rescue ActiveRecord::RecordNotFound => e
          Rails.logger.error "Dataset not found: #{e.message}"
          redirect_to root_url, alert: 'Dataset not found'
      end
    end
      

    def update
      begin
        @dataset = Dataset.find(params[:id])
        @team = @dataset.team
        authorize_for! @team
    
        new_name = params.require(:dataset).permit(:name)[:name]
    
        if @dataset.name != new_name && Dataset.exists?(name: new_name)
        new_name = generate_unique_name(new_name)
        end
    
        if @dataset.update(name: new_name)
        redirect_to team_datasets_url(@team)
        else
        render json: { errors: @dataset.errors.full_messages }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound => e
        Rails.logger.error "Dataset not found: #{e.message}"
        redirect_to root_url, alert: 'Dataset not found'
      rescue ActionController::ParameterMissing => e
        Rails.logger.error "Required parameter missing: #{e.message}"
        render json: { error: 'Required parameter missing' }, status: :bad_request
      end
    end
      
    def destroy
      begin
        @dataset = Dataset.find(params[:id])
        @team = @dataset.team
        authorize_for! @team
    
        if @dataset.destroy
          redirect_to team_datasets_url(@team), notice: 'Dataset was successfully deleted.'
        else
          redirect_to team_datasets_url(@team), alert: 'Dataset could not be deleted.'
        end
      rescue ActiveRecord::RecordNotFound => e
        Rails.logger.error "Dataset not found: #{e.message}"
        redirect_to root_url, alert: 'Dataset not found'
      end
    end

    def index
        datasets = @team.datasets
        
        if params[:json].present?
            render json: datasets
        else
            render layout: "team"
        end
    end

    def show
      dataset = Dataset.find_by(id: params[:id])
      send_data dataset.file.download, filename: dataset.name+".json", type: dataset.file.content_type
    end

    private

    def generate_unique_name(name)
        counter = 1
        unique_name = name

        while Dataset.exists?(name: unique_name)
          unique_name = "#{name} (#{counter})"
          counter += 1
        end

        unique_name
    end
      

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
