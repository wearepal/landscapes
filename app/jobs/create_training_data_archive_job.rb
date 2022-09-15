require 'fileutils'

class CreateTrainingDataArchiveJob < ApplicationJob
  queue_as :slow

  include ActionView::Helpers::DateHelper

  def perform(download)
    Dir.mktmpdir do |root|
      log = Logger.new(File.join(root, "log.txt"))

      group = download.labelling_group
      x0 = group.x
      y0 = group.y
      x1 = x0 + group.width
      y1 = y0 + group.height

      group.labellings.each_with_index do |labelling, i|
        layer = labelling.map_tile_layer
        (x0...x1).each do |x|
          percent_complete = 100 * (i * group.width + x - x0) / (group.labellings.count * group.width)
          download.update! message: "Fetching map tiles... (#{percent_complete}%)"
          (y0...y1).each do |y|
            label = labelling.get(x, y)
            unless label.nil?
              tile = layer.map_tiles.find_by(x: x, y: y, zoom: group.zoom)
              if tile.nil? || !tile.source.present?
                log.warn "Map tile not found for (#{x}, #{y}), zoom level #{group.zoom}, layer: #{layer.name}"
              else
                dest = File.join(root, layer.name, label.to_s)
                FileUtils.mkdir_p dest
                tile.source.open do |file|
                  FileUtils.cp file.path, File.join(dest, "#{x}-#{y}-#{group.zoom}-#{layer.name}#{File.extname(file)}")
                end
              end
            end
          end
        end
      end

      download.update! message: "Archiving map tiles..."
      Dir.chdir root do
        if system("zip", "-r", "archive.zip", ".", out: "/dev/null")
          download.archive.attach io: File.open(File.join(root, "archive.zip")), filename: "archive.zip"
          download.update! message: "Archive complete"
        else
          download.update! message: "Failed to create archive"
        end
      end
    end
  end
end
