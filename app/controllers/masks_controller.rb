class MasksController < ApplicationController

    def create
        authorize!
        @mask = Mask.new(:name => params[:name], :file => params[:file])
        if @mask.save
            render json: @mask, status: :created
        else
            render json: @mask.errors, status: :unprocessable_entity
        end
    end

    def show
        authorize!
        @mask = Mask.find_by(:name => params[:name])
        redirect_to @mask.file
    end

    def index
        authorize!
        @masks = Mask.all
        render json: @masks
    end
end
