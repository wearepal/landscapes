import { Collection, Map as olMap, TileRange } from 'ol'
import GeoJSON from 'ol/format/GeoJSON'
import { Point } from 'ol/geom'
import LayerGroup from 'ol/layer/Group'
import ImageLayer from 'ol/layer/Image'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import { fromLonLat } from 'ol/proj'
import { OSM, XYZ } from 'ol/source'
import ImageCanvasSource from 'ol/source/ImageCanvas'
import VectorSource from 'ol/source/Vector'
import { Circle, Fill, Stroke, Style, Text } from 'ol/style'
import { createXYZ } from 'ol/tilegrid'
import React, { useEffect, useRef, useState } from 'react'
import LabellingSource from '../sources/labelling'
import { LabelledTileGrid } from './TileGrid'

const tileGrid = createXYZ()

class InspectorSource extends ImageCanvasSource {
  constructor(nodeOutput) {
    super({
      canvasFunction: (extent, resolution, pixelRatio, size, projection) => this.drawCanvas(extent, pixelRatio, size)
    })
    this.nodeOutput = nodeOutput
    Object.assign(this, {
      zoom: nodeOutput.zoom,
      x0: nodeOutput.x,
      x1: nodeOutput.x + nodeOutput.width,
      y0: nodeOutput.y,
      y1: nodeOutput.y + nodeOutput.height,
      data: nodeOutput.data,
    })

    this.minValue =  Infinity
    this.maxValue = -Infinity
    nodeOutput.data.forEach(val => {
      if (isFinite(val)) {
        this.minValue = Math.min(val, this.minValue)
        this.maxValue = Math.max(val, this.maxValue)
      }
    })
  }

  drawCanvas(extent, pixelRatio, size) {
    const canvas = document.createElement("canvas")
    canvas.width = size[0]
    canvas.height = size[1]

    const ctx = canvas.getContext("2d")

    tileGrid.forEachTileCoord(
      extent,
      this.zoom,
      (coord) => {
        const x = coord[1]
        const y = coord[2]
        if (x >= this.x0 && x < this.x1 && y >= this.y0 && y < this.y1) {
          const value = this.data[(x - this.x0) * (this.y1 - this.y0) + (y - this.y0)]
          
          const tileExtent = tileGrid.getTileCoordExtent([this.zoom, x, y])

          const tileX0 = (tileExtent[0] - extent[0]) / (extent[2] - extent[0]) * size[0]
          const tileX1 = (tileExtent[2] - extent[0]) / (extent[2] - extent[0]) * size[0]

          const tileY0 = (tileExtent[3] - extent[1]) / (extent[3] - extent[1]) * size[1]
          const tileY1 = (tileExtent[1] - extent[1]) / (extent[3] - extent[1]) * size[1]

          if (value === null) {
            ctx.fillStyle = '#FF0000'
          }
          else {
            const shade = Math.floor(255 * (value - this.minValue) / (this.maxValue - this.minValue))
            ctx.fillStyle = `#${shade.toString(16).padStart(2, '0').repeat(3)}`
          }
          ctx.fillRect(Math.floor(tileX0), Math.ceil(size[1] - tileY1), Math.ceil(tileX1 - tileX0), Math.floor(tileY1 - tileY0))
        }
      }
    )

    return canvas
  }
}

function createOverlayLayer(id, colour) {
  return new VectorLayer({
    source: new VectorSource({
      url: `/overlays/${id}`,
      format: new GeoJSON(),
    }),
    style: (feature) => {
      if (feature.getGeometry() instanceof Point && !feature.get('name')) {
        return new Style({
          image: new Circle({
            radius: 2,
            fill: new Fill({ color: `#${colour}` }),
          })
        })
      }
      else {
        return new Style({
          stroke: new Stroke({ color: `#${colour}` }),
          text: new Text({
            font: `300 14px ${getComputedStyle(document.documentElement).getPropertyValue('--font-family-sans-serif')}`,
            text: feature.get('name'),
            fill: new Fill({
              color: `#${colour}`
            }),
          }),
        })
      }
    },
  })
}

function useFetchedArray(url) {
  const [data, setData] = useState([])
  async function fetchArray() {
    const response = await fetch(url)
    setData(await response.json())
  }
  useEffect(() => fetchArray(), [])
  return data
}

export default function({ nodeLabel, nodeOutput, close }) {
  const mapRef = useRef()

  const [map, setMap] = useState(null)
  const [osmVisible, setOsmVisible] = useState(true)
  const [opacity, setOpacity] = useState(0.5)
  const regions = useFetchedArray('/admin/regions.json')
  const mapTileLayers = useFetchedArray('/admin/map_tile_layers.json')
  const overlays = useFetchedArray('/admin/overlays.json')
  const [visibleOverlayIds, setVisibleOverlayIds] = useState(new Set())
  const [selectedLayerId, setSelectedLayerId] = useState(null)
  const [labelVisibility, setLabelVisibility] = useState(nodeOutput instanceof LabelledTileGrid ? new Map(nodeOutput.labelSchema.labels.map(l => [l.index, true])) : new Map())

  const { x, y, width, height, zoom } = nodeOutput

  useEffect(() => {
    const newMap = new olMap({
      target: mapRef.current,
      layers: [
        new TileLayer(),
        new TileLayer({ source: new OSM() }),
        new ImageLayer({ opacity }),
        new LayerGroup()
      ]
    })

    newMap.getView().fit(tileGrid.getTileRangeExtent(zoom, new TileRange(x, x + width, -y - height, -y)))

    setMap(newMap)

    return () => { newMap.dispose() }
  }, [])

  useEffect(() => {
    if (!map) return

    const layer = map.getLayers().item(0)
    if (selectedLayerId === null) {
      layer.setVisible(false)
    }
    else {
      const layerMeta = mapTileLayers.find(l => l.id === selectedLayerId)
      const extent = fromLonLat([...layerMeta.south_west_extent].reverse()).concat(
        fromLonLat([...layerMeta.north_east_extent].reverse())
      )
      layer.setSource(new XYZ({
        tileUrlFunction: p => `/map_tile_layers/${selectedLayerId}/map_tile?x=${p[1]}&y=${p[2]}&zoom=${p[0]}`,
        tilePixelRatio: 2,
        minZoom: layerMeta.min_zoom,
        maxZoom: layerMeta.max_zoom
      }))
      layer.setExtent(extent)
      layer.setVisible(true)
    }
  }, [selectedLayerId])

  useEffect(() => {
    if (!map) return
    const osmLayer = map.getLayers().item(1)
    osmLayer.setVisible(osmVisible)
    osmLayer.setOpacity(selectedLayerId === null ? 1 : 0.5)
  }, [selectedLayerId, osmVisible])

  useEffect(() => {
    if (!map) return

    map.getLayers().item(2).setOpacity(opacity)
  }, [opacity])

  useEffect(() => {
    if (!map) return

    const group = map.getLayers().item(3)
    group.setLayers(new Collection([...visibleOverlayIds].map(id =>
      createOverlayLayer(id, overlays.find(o => o.id === id).colour)
    )))
  }, [visibleOverlayIds])

  useEffect(() => {
    if (!map) return

    map.getLayers().item(2).setSource((
      nodeOutput instanceof LabelledTileGrid ?
        new LabellingSource(
          x, y, x + width, y + height, zoom, nodeOutput.data,
          nodeOutput.labelSchema.labels.reduce((acc, l) => {
            const { index, colour } = l
            return { ...acc, [index]: colour }
          }, {}),
          (id) => labelVisibility.get(id)
        ) :
        new InspectorSource(nodeOutput)
    ))
  }, [map, labelVisibility])

  return (
    <div>
      <div
        className="bg-dark"
        style={{position: 'absolute', top: '3.5rem', left: '0rem', bottom: '0rem', right: '0rem'}}
      >
        <div className="btn-toolbar bg-light p-2 border-top">
          <div className="small" style={{lineHeight: '1.9375rem'}}>
            Inspecting <code>{nodeLabel}</code>
          </div>
          <button type="button" className="ml-auto btn btn-sm btn-outline-secondary" onClick={close}>
            <i className="fas fa-times"></i>
            &nbsp;
            Close inspector
          </button>
        </div>

        <div ref={mapRef} style={{width: 'calc(100% - 250px)', height: 'calc(100% - 3.0625rem)'}}></div>

        <div
          className="bg-light map__sidebar"
          style={{top: '3.0625rem'}}
        >
          <div className="map__sidebar-section">
            <a className="map__sidebar-section-heading collapsed" data-toggle="collapse" href="#sidebar-section-base-layers">
              <i className="fas fa-caret-right accordion-toggle__indicator mr-2"></i>
              <i className="fas fa-layer-group fa-fw fa-lg align-middle"></i>
              &nbsp;
              Base layers
            </a>
            <div id="sidebar-section-base-layers" className="collapse">
              <div className="map__sidebar-section-content">
                <div className="custom-control custom-radio">
                  <input type="radio" className="custom-control-input" id="layer-none" checked={selectedLayerId === null} onChange={() => setSelectedLayerId(null)}/>
                  <label className="custom-control-label" htmlFor="layer-none">No imagery</label>
                </div>
                {regions.map(region =>
                  <details key={region.id}>
                    <summary>{region.name}</summary>
                    {mapTileLayers.filter(l => l.region_id === region.id).map(layer =>
                      <div key={layer.id} className="custom-control custom-radio">
                        <input
                          type="radio"
                          className="custom-control-input"
                          id={`layer-${layer.id}`}
                          checked={selectedLayerId === layer.id}
                          onChange={() => setSelectedLayerId(layer.id)}
                        />
                        <label className="custom-control-label" htmlFor={`layer-${layer.id}`}>
                          {layer.name}
                        </label>
                      </div>
                    )}
                  </details>
                )}
                <hr/>
                <div className="custom-control custom-checkbox">
                  <input type="checkbox" className="custom-control-input" id="osm" checked={osmVisible} onChange={() => setOsmVisible(!osmVisible)}/>
                  <label className="custom-control-label" htmlFor="osm">OpenStreetMap</label>
                </div>
              </div>
            </div>
          </div>

          <div className="map__sidebar-section">
            <a className="map__sidebar-section-heading collapsed" data-toggle="collapse" href="#sidebar-section-overlays">
              <i className="fas fa-caret-right accordion-toggle__indicator mr-2"></i>
              <i className="fas fa-layer-group fa-fw fa-lg align-middle"></i>
              &nbsp;
              Overlays
            </a>
            <div id="sidebar-section-overlays" className="collapse">
              <div className="map__sidebar-section-content">
                {regions.map(region =>
                  <details key={region.id}>
                    <summary>{region.name}</summary>
                    {overlays.filter(o => o.region_id === region.id).map(overlay =>
                      <div key={overlay.id} className="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id={`overlay-${overlay.id}`}
                          checked={visibleOverlayIds.has(overlay.id)}
                          onChange={(e) => {
                            const newValue = new Set(visibleOverlayIds)
                            if (e.target.checked) {
                              newValue.add(overlay.id)
                            }
                            else {
                              newValue.delete(overlay.id)
                            }
                            setVisibleOverlayIds(newValue)
                          }}
                        />
                        <label className="custom-control-label" htmlFor={`overlay-${overlay.id}`}>
                          <div className="swatch" style={{backgroundColor: `#${overlay.colour}`}}/>
                          &nbsp;
                          {overlay.name}
                        </label>
                      </div>
                    )}
                  </details>
                )}
              </div>
            </div>
          </div>

          {
            nodeOutput instanceof LabelledTileGrid &&
            <div className="map__sidebar-section">
              <a className="map__sidebar-section-heading" data-toggle="collapse" href="#sidebar-section-view-labels">
                <i className="fas fa-caret-right accordion-toggle__indicator mr-2"></i>
                <i className="fas fa-tags fa-fw fa-lg align-middle"></i>
                &nbsp;
                Labels
              </a>
              <div id="sidebar-section-view-labels" className="collapse show">
                <div className="map__sidebar-section-content">
                  {
                    nodeOutput.labelSchema.labels.map(label =>
                      <div key={label.id} className="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id={`label-${label.id}`}
                          checked={labelVisibility.get(label.index)}
                          onChange={e => {
                            const newValue = new Map(labelVisibility)
                            newValue.set(label.index, e.target.checked)
                            setLabelVisibility(newValue)
                          }}
                        />
                        <label className="custom-control-label" htmlFor={`label-${label.id}`}>
                          <div className="swatch" style={{backgroundColor: `#${label.colour}`}}/>
                          &nbsp;
                          {label.label}
                        </label>
                      </div>
                    )
                  }
                </div>
              </div>
            </div>
          }

          <div className="map__sidebar-section">
            <a className="map__sidebar-section-heading" data-toggle="collapse" href="#sidebar-section-view-settings">
              <i className="fas fa-caret-right accordion-toggle__indicator mr-2"></i>
              <i className="fas fa-eye fa-fw fa-lg align-middle"></i>
              &nbsp;
              View settings
            </a>
            <div id="sidebar-section-view-settings" className="collapse show">
              <div className="map__sidebar-section-content">
                Opacity<br/>
                <input type="range" className="custom-range" min="0" max="1" step="0.01" value={opacity} onChange={e => setOpacity(Number(e.target.value))}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
