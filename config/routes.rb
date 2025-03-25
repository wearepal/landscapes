Rails.application.routes.draw do
  get 'admin/index'
  resources :teams, shallow: true do
    patch :toggle_permission, on: :member
    resources :map_tile_layers, only: [:index]
    resources :memberships
    resources :overlays, only: [:index]

    resources :datasets, only: [:index, :edit, :create, :show, :destroy, :update]
    resources :extents, only: [:index, :create, :new, :edit, :destroy]
    resources :expressions, only: [:index, :create, :new, :edit, :destroy, :update]

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

  resource :user do
    get :change_password
    patch :update_password
  end

  resource :session
  
  resource :masks, only: [:create, :index, :show]

  # New route for the new app
  root to: "teams#select_team"
  

  # legacy content from the old app content
  get "legacy", to: "maps#show" 

  get "modelling_worker.js", to: redirect(status: 302) { Webpacker.manifest.lookup("modelling_worker.js") }

  get '/users/autocomplete', to: 'users#autocomplete'

  namespace :admin do
    resources :teams, only: [] do
      member do
        patch :update_default_team
      end
    end
  end
end
