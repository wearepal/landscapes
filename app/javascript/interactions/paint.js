import PointerInteraction from "ol/interaction/Pointer"
import { noModifierKeys, primaryAction } from "ol/events/condition"
import Feature from "ol/Feature"
import Circle from "ol/geom/Circle"

export default class PaintInteraction extends PointerInteraction {
  constructor(source, onPaint) {
    super({
      handleMoveEvent: (event) => {
        if (noModifierKeys(event)) {
          this.mouseCoordinate = event.coordinate
          this.drawPaintBrush()
          return true
        }
        else return false
      },

      handleDownEvent: (event) => {
        if (noModifierKeys(event) && primaryAction(event)) {
          onPaint(event.coordinate, this.radius)
          return true
        }
        else return false
      },

      handleDragEvent: (event) => {
        this.mouseCoordinate = event.coordinate
        this.drawPaintBrush()
        onPaint(event.coordinate, this.radius)
        return true
      },
    })

    this.source = source
  }

  drawPaintBrush() {
    this.source.clear()
    this.source.addFeature(new Feature(
      new Circle(
        this.mouseCoordinate,
        this.radius
      )
    ))
  }

  setRadius(radius) {
    this.radius = radius
  }
}
