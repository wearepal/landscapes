class CreateTeams < ActiveRecord::Migration[6.1]
  def change
    create_table :teams do |t|
      t.string :name

      t.timestamps
    end

    add_reference :regions, :team, foreign_key: true
    add_reference :label_schemas, :team, foreign_key: true
    add_reference :models, :team, foreign_key: true

    up_only do
      default_team = Team.new(name: "Default team")
      default_team.skip_permission_callback = true
      default_team.save!

      Region.find_each do |region|
        team = Team.new(name: region.name)
        team.skip_permission_callback = true
        team.save!
        region.update! team_id: team.id
      end

      LabelSchema.find_each do |schema|
        regions = schema.labelling_groups.map(&:region).uniq
        if regions.count == 0
          schema.update! team_id: default_team.id
        elsif regions.count == 1
          schema.update! team_id: regions.first.team_id
        else
          raise "Label schema referenced in multiple regions: #{schema.name}"
        end
      end

      Model.find_each do |model|
        if model.source.blank?
          model.update! team_id: default_team.id
        else
          data = JSON.parse(model.source)["nodes"].map { |k, v| v["data"] }
          referenced_regions = data.map { |d| d["regionId"] }.compact.map { |id| Region.find id }
          referenced_regions.concat data.map { |d| d["overlayId"] }.compact.map { |id| Overlay.find_by(id: id)&.region }
          referenced_regions.concat data.map { |d| d["labellingGroupId"] }.compact.map { |id| LabellingGroup.find_by(id: id)&.region }
          referenced_regions.concat data.map { |d| d["labellingId"] }.compact.map { |id| Labelling.find_by(id: id)&.labelling_group&.region }
          referenced_regions.concat data.map { |d| d["labelSchemaId"] }.compact.map { |id| LabelSchema.find_by(id: id)&.labelling_groups&.map(&:region)&.uniq&.first }
          referenced_regions.uniq!.compact!
          if referenced_regions.count == 0
            model.update! team_id: default_team.id
          elsif referenced_regions.count == 1
            model.update! team_id: referenced_regions.first.team_id
          else
            raise "Model #{model.name} references multiple regions: #{referenced_regions.join(', ')}"
          end
        end
      end
    end

    change_column_null :regions, :team_id, false
    change_column_null :label_schemas, :team_id, false
    change_column_null :models, :team_id, false
  end
end
