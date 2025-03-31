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
      format = params[:format]
      if format == "tiff"
        dataset = Dataset.find_by(id: params[:id])
        require 'net/http'
        require 'uri'
        require 'tempfile'

        uri = URI('https://landscapes.wearepal.ai/api/v2/geotiff')
        http = Net::HTTP.new(uri.host, uri.port)
        http.use_ssl = true

        request = Net::HTTP::Post.new(uri)
        
        # Create a temporary file to store the dataset content
        temp_file = Tempfile.new(['dataset', '.json'])
        begin
          temp_file.binmode
          temp_file.write(dataset.file.download)
          temp_file.rewind
          
          # Create the multipart form data
          boundary = "----RubyMultipartPost-#{rand(1000000)}"
          request["Content-Type"] = "multipart/form-data; boundary=#{boundary}"
          
          body = []
          body << "--#{boundary}"
          body << "Content-Disposition: form-data; name=\"dataset\"; filename=\"#{dataset.name}.json\""
          body << "Content-Type: application/json"
          body << ""
          body << temp_file.read
          body << "--#{boundary}--"
          
          request.body = body.join("\r\n")
          response = http.request(request)
          
          if response.is_a?(Net::HTTPSuccess)
            send_data response.body, 
                      type: 'image/tiff',
                      disposition: 'inline',
                      filename: "#{dataset.name}.tif"
          else
            Rails.logger.error "TIFF conversion failed with status #{response.code}: #{response.body}"
            render json: { 
              error: 'Failed to convert to TIFF',
              details: response.body,
              status: response.code
            }, status: :unprocessable_entity
          end
        rescue StandardError => e
          Rails.logger.error "Error during TIFF conversion: #{e.message}\n#{e.backtrace.join("\n")}"
          render json: { 
            error: 'Error during TIFF conversion',
            details: e.message
          }, status: :internal_server_error
        ensure
          temp_file.close
          temp_file.unlink
        end
      else
        dataset = Dataset.find_by(id: params[:id])
        send_data dataset.file.download, filename: dataset.name+".json", type: dataset.file.content_type
      end
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
