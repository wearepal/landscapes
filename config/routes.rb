Rails.application.routes.draw do
  namespace :admin do
    root to: 'admin#admin_root'

    resources :labelling_corrections, shallow: true

    resources :label_schemas, shallow: true do
      resources :duplicates, model_name: "LabelSchema"

      resources :labels
    end

    resources :models do
      resources :duplicates, model_name: "Model"
    end

    resources :regions do
      resources :labelling_groups, shallow: true do
        resources :duplicates, model_name: "LabellingGroup"
        resources :labellings, shallow: true
        resource :lock
        resources :training_data_downloads, only: [:create]
        resources :training_data_samplings, only: [:new, :create]
      end

      resources :labelling_group_uploads, shallow: true
      
      resources :map_tile_layers, shallow: true
      resources :map_tile_uploads, shallow: true do
        collection do
          get :index_table
        end
      end
      resources :map_tile_downloads, shallow: true

      resources :overlays, shallow: true

      resources :training_data_downloads, shallow: true, only: [:index, :destroy]
    end

    resources :users do
      member do
        post :promote
        post :demote
      end
    end

    resources :map_tile_layers, only: [:index]
    resources :overlays, only: [:index]
  end

  resources :regions do
    resources :labelling_groups, shallow: true do
      resources :labellings
    end

    resources :overlays, shallow: true
  end

  resources :map_tile_layers do
    get "map_tile" => "map_tiles#show"
  end

  resource :user

  resource :session

  root to: "maps#show"
  get "/old", to: "application#root"

  get "modelling_worker.js", to: redirect(status: 302) { Webpacker.manifest.lookup("modelling_worker.js") }
end
