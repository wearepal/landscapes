Rails.application.routes.draw do
  resources :teams, shallow: true do
    resources :map_tile_layers, only: [:index]
    resources :memberships
    resources :overlays, only: [:index]

    resources :datasets, only: [:index, :edit, :create, :show, :destroy, :update]
    resources :extents, only: [:index, :create, :new, :edit, :destroy]

    resources :label_schemas do
      resources :duplicates, model_name: "LabelSchema"
      resources :labels
    end

    resources :models do
      resources :duplicates, model_name: "Model"
    end

    resources :projects do 
      resources :duplicates, model_name: "Project"
    end

    resources :regions do
      resources :labelling_group_uploads
      resources :map_tile_downloads
      resources :overlays
      resources :training_data_downloads
      
      resources :labelling_groups do
        resources :labellings do
          resources :labelling_corrections
        end
        resources :duplicates, model_name: "LabellingGroup"
        resource :lock
        resources :training_data_downloads
        resources :training_data_samplings
      end

      resources :map_tile_layers do
        get "map_tile" => "map_tiles#show"
      end

      resources :map_tile_uploads do
        get :index_table, on: :collection
      end
    end
  end

  resource :user

  resource :session

  # New route for the new app
  root to: "teams#select_team"

  # legacy content from the old app content
  get "legacy", to: "maps#show" 

  get "modelling_worker.js", to: redirect(status: 302) { Webpacker.manifest.lookup("modelling_worker.js") }
end
