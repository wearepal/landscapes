class LabellingsController < ApplicationController
  skip_before_action :require_authentication
  
  def show
    l = Labelling.find(params[:id])
    g = l.labelling_group
    
    colours = g.label_schema.labels.select do |label|
      params.fetch(:labels, []).include? label.index.to_s
    end.map do |label|
      [label.index, ChunkyPNG::Color(label.colour)]
    end.to_h

    # TODO: If Labelling.data had the same pixel ordering as the PNG file format,
    # then this transpose would be unnecessary and we could render faster
    bytes = l.data.unpack("C*").each_slice(g.height).to_a.transpose.flatten.flat_map do |label_index|
      colours[label_index] || ChunkyPNG::Color::TRANSPARENT
    end.pack "L>*"
    
    image = ChunkyPNG::Image.from_rgba_stream(g.width, g.height, bytes)
    send_data image.to_datastream, type: "image/png", disposition: "inline"
  end
end
