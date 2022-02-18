json.label_schemas @team.label_schemas.order(:name) do |schema|
  json.(schema, :id, :name)
  json.labels schema.labels.order(:index), :id, :index, :label, :colour
  json.labelling_groups schema.labelling_groups.order(:name) do |group|
    json.(group, :id, :name)
    json.labellings group.labellings.sort_by(&:name), :id, :name
  end
end

json.regions @team.regions.order(:name) do |region|
  json.(region, :id, :name)
  json.map_tile_layers region.map_tile_layers.order(:name), :id, :name
  json.overlays region.overlays.order(:name), :id, :name
  json.labelling_groups region.labelling_groups.order(:name) do |group|
    json.(group, :id, :label_schema_id, :name, :zoom)
    json.labellings group.labellings.sort_by(&:name), :id, :name
  end
end
