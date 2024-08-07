require 'varint'

class LabellingGroupsController < ApplicationController
  skip_before_action :ensure_authenticated, only: [:show]
  layout 'region'
  helper_method :map_view_encoding
  before_action :set_region, only: [:index, :new, :create]
  before_action :set_labelling_group, only: [:edit, :update, :destroy]

  def show
    if current_user.nil?
      begin
        authorize!
        redirect_to root_url(anchor: map_view_encoding(LabellingGroup.find(params[:id])))
      rescue ActiveRecord::RecordNotFound => e
        Rails.logger.error "Labelling group not found: #{e.message}"
        redirect_to root_url, alert: 'Labelling group not found'
      end
    else
      set_labelling_group
    end
  end
  
  def new
    @labelling_group = @region.labelling_groups.new
  end
  
  def create
    @labelling_group = @region.labelling_groups.new(params.require(:labelling_group).permit(:name, :label_schema_id, :zoom, :x, :y, :width, :height))

    if @labelling_group.save
      respond_to do |format|
        format.js { redirect_to @labelling_group }
        format.json { render json: @labelling_group, status: :created }
      end
    else
      render json: @labelling_group.errors, status: :unprocessable_entity
    end
  end

  def update
    begin
      if @labelling_group.update(params.require(:labelling_group).permit(:name))
        redirect_to @labelling_group
      else
        render json: @labelling_group.errors, status: :unprocessable_entity
      end
    rescue ActionController::ParameterMissing => e
      Rails.logger.error "Required parameter missing: #{e.message}"
      render json: { error: 'Required parameter missing' }, status: :bad_request
    end
  end
  
  def destroy
    begin
      @labelling_group.destroy!
      respond_to do |format|
        format.html { redirect_to [@labelling_group.region, :labelling_groups], notice: 'Labelling group was successfully deleted.' }
        format.json { head :no_content }
      end
    rescue ActiveRecord::RecordNotDestroyed => e
      Rails.logger.error "Error destroying labelling group: #{e.message}"
      respond_to do |format|
        format.html { redirect_to [@labelling_group.region, :labelling_groups], alert: 'Labelling group could not be deleted.' }
        format.json { render json: { error: 'Labelling group could not be deleted' }, status: :unprocessable_entity }
      end
    end
  end

  private

    def set_region
      begin
        @region = Region.find params[:region_id]
        @team = @region.team
        authorize_for! @team
      rescue ActiveRecord::RecordNotFound => e
        Rails.logger.error "Region not found: #{e.message}"
        redirect_to root_url, alert: 'Region not found'
      end
    end
    
    def set_labelling_group
      begin
        @labelling_group = LabellingGroup.find params[:id]
        @region = @labelling_group.region
        @team = @region.team
        authorize_for! @team
      rescue ActiveRecord::RecordNotFound => e
        Rails.logger.error "Labelling group not found: #{e.message}"
        redirect_to root_url, alert: 'Labelling group not found'
      end
    end
    
    def map_view_encoding(group)
      begin
        region = group.region
        label_schema = group.label_schema
        labelling = group.labellings.last!
    
        io = StringIO.new
    
        Varint.encode io, 0 # Serialization version
        Varint.encode io, region.id
    
        Varint.encode io, 6 # Flags
        Varint.encode io, labelling.map_tile_layer_id
    
        Varint.encode io, labelling.id
        Varint.encode io, 4 # Labelling opacity * 10
        Varint.encode io, label_schema.labels.count
        label_schema.labels.each do |label|
          Varint.encode io, label.id
        end
    
        Varint.encode io, 0
    
        Base58.binary_to_base58 io.string.b, :bitcoin
      rescue ActiveRecord::RecordNotFound => e
        Rails.logger.error "Record not found: #{e.message}"
        raise e
      end
    end
end
