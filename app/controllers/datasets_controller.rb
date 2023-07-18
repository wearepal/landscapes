class DatasetsController < ApplicationController
    before_action :set_team, only: [:index, :new, :create]

    def create
                
        name = params[:name]

        existing_dataset = Dataset.find_by(:name => name)

        if existing_dataset.present?
            name = generate_unique_name(name)
        end
            
        @dataset = @team.datasets.new(:name => name, :file => params[:file], :gridtype => params[:gridtype])

        if @dataset.save
            render json: @compiled, status: :created
        else
            render json: @compiled.errors, status: :unprocessable_entity
        end

    end

    def update
        @dataset = Dataset.find(params[:id])
        @team = @dataset.team
        authorize_for! @team

        puts params
    end

    def destroy
        @dataset = Dataset.find(params[:id])
        @team = @dataset.team
        authorize_for! @team
        @dataset.destroy
        redirect_to team_datasets_url(@team)
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
        redirect_to Dataset.find(params[:id]).file
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
        @team = Team.find(params[:team_id])
        authorize_for! @team
    end

end
