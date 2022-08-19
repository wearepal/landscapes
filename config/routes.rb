Rails.application.routes.draw do
  resources :teams, shallow: true do
    resources :map_tile_layers, only: [:index]
    resources :memberships
    resources :overlays, only: [:index]

    resources :label_schemas do
      resources :duplicates, model_name: "LabelSchema"
      resources :labels
    end

    resources :models do
      resources :duplicates, model_name: "Model"
    end

    resources :projects

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

  root to: "maps#show"

  get "modelling_worker.ts", to: redirect(status: 302) { Webpacker.manifest.lookup("modelling_worker.ts") }
end
