class DestroyMapTileLayerJob < ApplicationJob
  queue_as :default

  def perform(layer)
    layer.map_tiles.find_each(&:destroy)
    layer.destroy
  end
end
