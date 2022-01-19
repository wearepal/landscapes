class MakeLabellingDataBinary < ActiveRecord::Migration[6.0]
  class Labelling < ActiveRecord::Base
  end

  def change
    rename_column :labellings, :data, :old_data
    change_column_null :labellings, :old_data, true
    add_column :labellings, :data, :binary

    reversible do |dir|
      say_with_time "migrate data" do
        Labelling.reset_column_information
        Labelling.find_each do |labelling|
          dir.up { labelling.data = labelling.old_data.pack("C*") }
          dir.down { labelling.old_data = labelling.data.unpack("C*") }
          labelling.save
        end
      end
    end

    change_column_null :labellings, :data, false
    remove_column :labellings, :old_data, :integer, array: true
  end
end
