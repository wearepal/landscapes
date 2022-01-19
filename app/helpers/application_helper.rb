module ApplicationHelper
  # From https://github.com/rwz/nestive/blob/master/lib/nestive/layout_helper.rb
  def extends(layout, &block)
    # Make sure it's a string
    layout = layout.to_s

    # If there's no directory component, presume a plain layout name
    layout = "layouts/#{layout}" unless layout.include?('/')

    # Capture the content to be placed inside the extended layout
    @view_flow.get(:layout).replace capture(&block).to_s

    render template: layout
  end
end
