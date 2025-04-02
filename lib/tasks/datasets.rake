namespace :datasets do
  desc "Add properties to existing dataset files"
  task add_properties: :environment do
    # Define common patterns and their corresponding properties
    name_patterns = {
      /t\/ha/i => { units: "t", area: "ha" },
      /kg\/ha/i => { units: "kg", area: "ha" },
      /g\/m2/i => { units: "g", area: "m2" },
      /kg\/m2/i => { units: "kg", area: "m2" },
      /t\/m2/i => { units: "t", area: "m2" },
      /m\/ha/i => { units: "m", area: "ha" },
      /km\/ha/i => { units: "km", area: "ha" },
      /m2\/ha/i => { units: "m2", area: "ha" },
      /km2\/ha/i => { units: "km2", area: "ha" },
      /%|percent/i => { units: "%", area: "na" },
      /ratio/i => { units: "na", area: "na" }
    }

    Dataset.find_each do |dataset|
      begin
        # Download the current file content
        content = dataset.file.download
        data = JSON.parse(content)
        
        # Add properties if they don't exist
        if data["type"] == "NumericTileGrid" && !data["properties"]
          # Find matching pattern in dataset name
          matching_pattern = name_patterns.find { |pattern, _| dataset.name.match?(pattern) }
          
          if matching_pattern
            pattern, properties = matching_pattern
            # Replace nil values with "na"
            data["properties"] = properties.transform_values { |v| v.nil? ? "na" : v }
            puts "Updated dataset: #{dataset.name} with properties: #{data["properties"]}"
          else
            data["properties"] = { units: "na", area: "na" }
            puts "Updated dataset: #{dataset.name} with properties: #{data["properties"]}"
          end
          
          # Save the updated content back to the file
          dataset.file.attach(
            io: StringIO.new(JSON.dump(data)),
            filename: dataset.file.filename,
            content_type: dataset.file.content_type
          )
        end
      rescue => e
        puts "Error processing dataset #{dataset.name}: #{e.message}"
      end
    end
  end
end 