class TrainingDataSampler
  include ActiveModel::Model

  attr_accessor :name, :num_samples_per_label

  validates :name, presence: true
  validates :num_samples_per_label, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 1 }

  def sample(src_group)
    src_group.dup.tap do |dst_group|
      dst_group.name = name
      dst_group.locked = false

      src_group.labellings.each do |src_labelling|
        src_labels_with_indices = src_labelling.data.bytes.each_with_index.to_a.shuffle
        dst_labels = Array.new(dst_group.width * dst_group.height, 255)

        src_labelling.labelling_group.label_schema.labels.each do |label|
          src_labels_with_indices.lazy.select { |src_label, index|
            src_label == label.index
          }.map(&:second).first(num_samples_per_label.to_i).each do |index|
            dst_labels[index] = label.index
          end
        end

        dst_group.labellings.build(
          map_tile_layer: src_labelling.map_tile_layer,
          data: dst_labels.pack("C*")
        )
      end
    end
  end
end
