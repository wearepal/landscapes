class ChangeLabellingYearToString < ActiveRecord::Migration[6.0]
  def up
    change_column :labellings, :year, :string
  end

  def down
    # TODO: can't automatically cast back to integer
    change_column :labellings, :year, :integer
  end
end
