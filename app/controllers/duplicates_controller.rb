class DuplicatesController < ApplicationController
  def create
    authorize_for! model.team
    duplicate = model.duplicate
    if duplicate.has_attribute?(:name)
      # TODO: what if "{name} (copy)" is already taken?
      duplicate.name = "#{duplicate.name} (copy)"
    end
    duplicate.save!
    flash.notice = "Created duplicate #{human_model_name} named '#{duplicate.name}'."
    redirect_to duplicate
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
end
