require 'varint'

class RegionsController < ApplicationController
  skip_before_action :ensure_authenticated, only: [:show]
  before_action :set_team, only: [:index, :new, :create]
  layout 'team'

  def show
    begin
      authorize!
      redirect_to root_url(anchor: map_view_encoding(Region.find(params[:id])))
    rescue ActiveRecord::RecordNotFound => e
      Rails.logger.error "Region not found: #{e.message}"
      redirect_to root_url, alert: 'Region not found'
    end
  end

  def new
    @region = @team.regions.new
  end

  def create
    @region = @team.regions.new(region_params)
    if @region.save
      redirect_to region_labelling_groups_url(@region)
    else
      render json: @region.errors, status: :unprocessable_entity
    end
  end

  private

    def region_params
      params.require(:region).permit(:name)
    rescue ActionController::ParameterMissing => e
      Rails.logger.error "Required parameter missing: #{e.message}"
      render json: { error: 'Required parameter missing' }, status: :bad_request
    end

    def map_view_encoding(region)
      io = StringIO.new
      Varint.encode io, 0 # Serialization version
      Varint.encode io, region.id

      Varint.encode io, 2 # Flags
      Varint.encode io, region.map_tile_layers.last!.id

      Varint.encode io, 0

      Base58.binary_to_base58 io.string.b, :bitcoin
    end

    def set_team
      begin
        @team = Team.find(params[:team_id])
      rescue ActiveRecord::RecordNotFound => e
        Rails.logger.error "Team not found: #{e.message}"
        redirect_to root_url, alert: 'Team not found'
      end
    end
end