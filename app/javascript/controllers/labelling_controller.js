import { Controller } from "@hotwired/stimulus"

import Map from "ol/Map"
import Control from "ol/control/Control"
import LineString from "ol/geom/LineString"
import ImageLayer from "ol/layer/Image"
import TileLayer from "ol/layer/Tile"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import XYZ from "ol/source/XYZ"
import Stroke from "ol/style/Stroke"
import Style from "ol/style/Style"
import { defaults as defaultControls } from "ol/control"
import { defaults as defaultInteractions } from "ol/interaction"
import { fromLonLat } from "ol/proj"
import { createXYZ } from "ol/tilegrid"

import DragPan from "ol/interaction/DragPan"
import { platformModifierKeyOnly } from "ol/events/condition"
import LabellingSource from "../sources/labelling"

import PaintInteraction from "../interactions/paint"

export default class extends Controller {
  static targets = [
    "brushSize",
    "brushSizeLabel",
    "container",
    "control",
    "saveButton",
  ]

  connect() {
    this.labels = Uint8Array.from(atob(this.data.get("labels")), c => c.charCodeAt(0))

    const southWest = fromLonLat([
      Number(this.data.get("south-west-lng")),
      Number(this.data.get("south-west-lat"))
    ])

    const northEast = fromLonLat([
      Number(this.data.get("north-east-lng")),
      Number(this.data.get("north-east-lat"))
    ])

    const extent = [southWest[0], southWest[1], northEast[0], northEast[1]]

    const baseLayer = new TileLayer({
      extent: extent,
      source: new XYZ({
        tileUrlFunction: p => `/map_tile_layers/${this.data.get("map-tile-layer-id")}/map_tile?x=${p[1]}&y=${p[2]}&zoom=${p[0]}`,
        tilePixelRatio: 2,
        minZoom: parseInt(this.data.get("zoom-min")),
        maxZoom: parseInt(this.data.get("zoom-max"))
      })
    })

    const zoom = parseInt(this.data.get("zoom"))
    const x0 = parseInt(this.data.get("x"))
    const y0 = parseInt(this.data.get("y"))
    const width = parseInt(this.data.get("width"))
    const height = parseInt(this.data.get("height"))
    const colours = JSON.parse(this.data.get("colours"))

    const labellingLayer = new ImageLayer({
      source: new LabellingSource(x0, y0, x0 + width, y0 + height, zoom, this.labels, colours),
      opacity: 0.5,
    })

    const paintBrushSource = new VectorSource()

    this.paintInteraction = new PaintInteraction(
      paintBrushSource,
      (coordinate, radius) => {
        const tileGrid = createXYZ()
        const label = parseInt(this.element.querySelector('input[name="brush"]:checked').value)

        tileGrid.forEachTileCoord(
          [
            coordinate[0] - radius,
            coordinate[1] - radius,
            coordinate[0] + radius,
            coordinate[1] + radius
          ],
          zoom,
          (coord) => {
            const x = coord[1]
            const y = coord[2]
            if (x >= x0 && x < x0 + width && y >= y0 && y < y0 + height) {
              const tileCenter = tileGrid.getTileCoordCenter(coord)
              if (new LineString([coordinate, tileCenter]).getLength() < radius) {
                this.labels[(x - x0) * height + (y - y0)] = label
              }
            }
          }
        )

        labellingLayer.getSource().refresh()
        this.data.set("dirty", "true")
      }
    )

    this.map = new Map({
      target: this.containerTarget,
      
      layers: [
        baseLayer,
        labellingLayer,
        new VectorLayer({ source: paintBrushSource, style: new Style({ stroke: new Stroke({ color: "white" }) }) }),
      ],

      controls: defaultControls().extend(
        this.controlTargets.map(el => new Control({ element: document.importNode(el.content, true).querySelector("div") }))
      ),

      interactions: defaultInteractions().extend([
        this.paintInteraction,
        new DragPan({ condition: platformModifierKeyOnly }),
      ]),
    })
    
    this.map.getView().fit(
      extent, {
        size: [
          window.innerWidth - 250,
          window.innerHeight - 56
        ]
      }
    )

    // Hack: sometimes the map doesn't display properly until the window is resized
    setTimeout(() => window.dispatchEvent(new Event('resize')), 2000)

    this.setBrushSize()
  }

  disconnect() {
    this.map.dispose()

    delete this.map
    delete this.paintInteraction
    delete this.labels
  }

  setBrushSize() {
    const minRadius = 20000000 / (2 ** parseInt(this.data.get("zoom")))
    const maxRadius = minRadius * Math.max(parseInt(this.data.get("width")), parseInt(this.data.get("height")))
    const scale = Math.pow(Number(this.brushSizeTarget.value), 2)
    const radius = minRadius + scale * (maxRadius - minRadius)
    this.brushSizeLabelTarget.innerHTML = parseInt(radius).toLocaleString()
    this.paintInteraction.setRadius(radius)
  }

  save(event) {
    this.saveButtonTarget.disabled = true

    const formData = new FormData()
    formData.set("data", btoa(new TextDecoder('ascii').decode(this.labels)))
    
    fetch(
      this.data.get("url"),
      {
        method: "PATCH",
        headers: {
          "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
        },
        body: formData
      }
    )
    .then(response => {
      if (!response.ok) {
        throw new Error()
      }
      this.data.delete("dirty")
    })
    .catch(
      () => alert("An unexpected error occurred while trying to save your changes")
    )
    .finally(
      () => {
        this.saveButtonTarget.innerHTML = "Save complete"
        setTimeout(() => {
          this.saveButtonTarget.innerHTML = "Save changes"
          this.saveButtonTarget.disabled = false
        }, 2000)
      }
    )
  }

  warnIfUnsaved(event) {
    if (this.data.get("dirty") && !confirm("You have unsaved changes. Are you sure you want to leave this page without saving?")) {
      event.preventDefault()
    }
  }

  closeWindow(event) {
    this.warnIfUnsaved(event)
    if (!event.defaultPrevented) {
      window.close()
    }
  }

  handleShortcutKey(event) {
    const { key } = event
    if (key === "[" || key === "]") {
      const slider = document.getElementById("brush-radius")
      key === "[" ? slider.stepDown() : slider.stepUp()
      slider.dispatchEvent(new Event('change'))
      this.paintInteraction.drawPaintBrush()
      event.preventDefault()
    }
    else if (key.length == 1) {
      const num = parseInt(key, 36)
      if (!isNaN(num)) {
        const elem = document.getElementById(`brush-${num}`)
        if (elem) {
          elem.checked = true
          event.preventDefault()
        }
      }
    }
  }
}
