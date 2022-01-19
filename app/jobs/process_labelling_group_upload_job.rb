require 'csv'

class ProcessLabellingGroupUploadJob < ApplicationJob
  queue_as :default

  class InvalidUploadError < RuntimeError
  end

  discard_on CSV::MalformedCSVError do |job|
    job.arguments[0].update! error_message: "Not a valid CSV file"
  end

  discard_on InvalidUploadError do |job, error|
    job.arguments[0].update! error_message: error.message
  end

  def perform(upload)
    upload.source.open do |csv|
      # Find labelling bounds
      min_x = nil
      min_y = nil
      max_x = nil
      max_y = nil
      labels = []
      zoom_levels = []
      layers = []
      open_csv(csv).map do |entry|
        matches = entry["filename"].match(IMAGE_NAME_REGEX)
        raise InvalidUploadError, "Filename \"#{entry["filename"]}\" doesn't match the expected format" if matches.nil?
        
        x = matches[1].to_i
        y = matches[2].to_i

        if min_x.nil? || min_x > x
          min_x = x
        end

        if min_y.nil? || min_y > y
          min_y = y
        end

        if max_x.nil? || max_x < x
          max_x = x
        end

        if max_y.nil? || max_y < y
          max_y = y
        end

        zoom_levels << matches[3].to_i
        zoom_levels.sort!.uniq!

        layers << matches[4]
        layers.sort!.uniq!

        labels << entry["prediction"].to_i
        labels.sort!.uniq!
      end

      if zoom_levels.count != 1
        raise InvalidUploadError, "More than 1 zoom level present in data"
      end

      unknown_labels = labels - upload.label_schema.labels.map(&:index)
      unless unknown_labels.empty?
        raise InvalidUploadError, "Upload contains label(s) that aren't in the chosen schema '#{upload.label_schema.name}': #{unknown_labels.join(", ")}"
      end

      unknown_layers = layers - upload.region.map_tile_layers.map(&:name)
      unless unknown_layers.empty?
        raise InvalidUploadError, "Upload contains layer(s) that aren't in the region '#{upload.region.name}': #{unknown_layers.join(", ")}"
      end

      zoom = zoom_levels.first

      group = upload.region.labelling_groups.build(
        label_schema: upload.label_schema,
        name: upload.name,
        zoom: zoom,
        x: min_x,
        y: min_y,
        width: 1 + max_x - min_x,
        height: 1 + max_y - min_y,
        locked: true
      )

      labellings = layers.map do |layer|
        [
          layer,
          group.labellings.build(
            map_tile_layer: group.region.map_tile_layers.find_by!(name: layer),
          )
        ]
      end.to_h

      # Render the data
      open_csv(csv).map do |entry|
        matches = entry["filename"].match(IMAGE_NAME_REGEX)
        x = matches[1].to_i
        y = matches[2].to_i
        layer = matches[4]
        label = entry["prediction"].to_i

        labellings[layer].set(x, y, label)
      end

      # Save the labellings
      group.save!
      upload.update! labelling_group: group
    end
  end

  private

    IMAGE_NAME_REGEX = /([0-9]+)-([0-9]+)-([0-9]+)-([^.]+).?[a-zA-Z0-9]*/

    def open_csv(file)
      CSV.open(file, headers: :first_row).tap do |csv|
        csv.shift
        missing_columns = ["filename", "prediction"] - csv.headers
        unless missing_columns.empty?
          raise InvalidUploadError, "Missing column(s): #{missing_columns.join(", ")}"
        end
        csv.rewind
      end
    end
end
