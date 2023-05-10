class DuplicatesController < ApplicationController
  def create
    authorize_for! model.team
    duplicate = model.duplicate
    duplicate.name = "#{duplicate.name} (copy)"
    duplicate.save!

    unless model_name == "Project"
      flash.notice = "Created duplicate #{human_model_name} named '#{duplicate.name}'."    
      redirect_to duplicate
    else
      redirect_to team_projects_url(model.team)
    end
  end

  private

    def model_class
      params[:model_name].constantize
    end

    def human_model_name
      params[:model_name].underscore.humanize(capitalize: false)
    end

    def foreign_key_name
      params[:model_name].foreign_key
    end

    def model
      model_class.find(params[foreign_key_name])
    end
    
    def model_name
      params[:model_name]
    end
end
