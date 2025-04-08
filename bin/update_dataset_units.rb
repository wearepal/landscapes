#!/usr/bin/env ruby
require_relative '../config/environment'

# This script updates datasets with unit and area properties retrospectively
# based on patterns in their names or gridtype

puts "Starting dataset unit and area update script..."

# Process datasets with t/ha pattern
datasets_with_tha = Dataset.where("name LIKE ? OR name LIKE ?", "%t/ha%", "%t/Ha%", "%t/h%")
puts "Found #{datasets_with_tha.count} datasets with t/ha pattern"

datasets_with_tha.each do |dataset|
  puts "Processing dataset: #{dataset.name}"
  
  # Download the file content
  begin
    file_content = JSON.parse(dataset.file.download)
    
    # Check if it's a NumericTileGrid and update properties
    if file_content["type"] == "NumericTileGrid"
      file_content["unitProp"] = "t"
      file_content["areaProp"] = "ha"
      
      # Create a new temporary file with updated content
      temp_file = Tempfile.new(['dataset', '.json'])
      temp_file.binmode
      temp_file.write(JSON.generate(file_content))
      temp_file.rewind
      
      # Update the dataset file
      dataset.file.attach(io: temp_file, filename: "#{dataset.name}.json", content_type: 'application/json')
      dataset.save
      
      temp_file.close
      temp_file.unlink
      
      puts "  Updated with unit: t, area: ha"
    else
      puts "  Skipping: Not a NumericTileGrid"
    end
  rescue => e
    puts "  Error processing #{dataset.name}: #{e.message}"
  end
end

# Process datasets with kg/m2 pattern
datasets_with_kgm2 = Dataset.where("name LIKE ? OR name LIKE ? OR name LIKE ?", "%kg/m2%", "%kg/m²%", "%kg/m^2%")
puts "Found #{datasets_with_kgm2.count} datasets with kg/m2 pattern"

datasets_with_kgm2.each do |dataset|
  puts "Processing dataset: #{dataset.name}"
  
  # Download the file content
  begin
    file_content = JSON.parse(dataset.file.download)
    
    # Check if it's a NumericTileGrid and update properties
    if file_content["type"] == "NumericTileGrid"
      file_content["unitProp"] = "kg"
      file_content["areaProp"] = "m²"
      
      # Create a new temporary file with updated content
      temp_file = Tempfile.new(['dataset', '.json'])
      temp_file.binmode
      temp_file.write(JSON.generate(file_content))
      temp_file.rewind
      
      # Update the dataset file
      dataset.file.attach(io: temp_file, filename: "#{dataset.name}.json", content_type: 'application/json')
      dataset.save
      
      temp_file.close
      temp_file.unlink
      
      puts "  Updated with unit: kg, area: m²"
    else
      puts "  Skipping: Not a NumericTileGrid"
    end
  rescue => e
    puts "  Error processing #{dataset.name}: #{e.message}"
  end
end

puts "Dataset update completed!" 