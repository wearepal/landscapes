require 'zip'

class CreateMapTileArchiveJob < ApplicationJob
  queue_as :slow

  def perform(download)
    download.update(progress: 0.0, status: nil)

    Dir.mktmpdir do |dir|
      archive_filename = File.join(dir, "archive.zip")

      Zip::File.open(archive_filename, Zip::File::CREATE) do |zip|
        tiles = download.region.map_tile_layers.find_by!(name: download.year).map_tiles.where(zoom: download.zoom)
        num_tiles = tiles.count
        tiles.with_attached_source.find_each.with_index do |tile, index|
          zip.get_output_stream("#{tile.x}-#{tile.y}-#{tile.zoom}-#{download.year}.#{tile.source.filename.extension}") do |out|
            tile.source.download do |chunk|
              out.write chunk
            end
          end
          download.update(progress: index.to_f / num_tiles.to_f) if index % 100 == 0
        end
      end

      download.archive.attach io: File.open(archive_filename), filename: "archive.zip"
    end
    
    download.update(progress: 1.0, status: true)
  end
end
