Rails.application.routes.draw do
  resources :teams, shallow: true do
    resources :label_schemas do
      resources :duplicates, model_name: "LabelSchema"
      resources :labels
    end

    resources :memberships

    resources :models do
      resources :duplicates, model_name: "Model"
    end

    resources :regions do
      resources :labelling_group_uploads
      
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

      resources :map_tile_downloads

      resources :map_tile_uploads do
        get :index_table, on: :collection
      end

      resources :overlays

      resources :training_data_downloads
    end
  end

  resource :user

  resource :session

  root to: "maps#show"

  get "modelling_worker.js", to: redirect(status: 302) { Webpacker.manifest.lookup("modelling_worker.js") }
end
