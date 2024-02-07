import * as React from 'react'
import './sidebar.css'
import { ReactSortable } from 'react-sortablejs'
import { nevoLevelNames, nevoPropertyNames } from './nevo'
import { AtiLayer, CropMapLayer, DatasetLayer, Layer, ModelOutputLayer, NevoLayer, OverlayLayer, ShapeLayer, State } from './state'
import { iconForLayerType } from "./util"
import { getColorStops } from './reify_layer/model_output'
import { tileGridStats } from './modelling/tile_grid'

interface OverlayLayerSettingsProps {
  layer: OverlayLayer
  mutate: (data: any) => void
}
const OverlayLayerSettings = ({ layer, mutate }: OverlayLayerSettingsProps) => (
  <>
    <div className="d-flex align-items-center mt-3">
      Stroke width
      <input
        type="range"
        min="1"
        max="10"
        step="1"
        className="custom-range ml-3"
        value={layer.strokeWidth}
        onChange={e => mutate({ strokeWidth: Number(e.target.value) })}
      />
    </div>
    <div className="d-flex align-items-center mt-3">
      Fill opacity
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        className="custom-range ml-3"
        value={layer.fillOpacity}
        onChange={e => mutate({ fillOpacity: Number(e.target.value) })}
      />
    </div>
  </>
)

interface NevoLayerSettingsProps {
  layer: NevoLayer
  mutate: (data: any) => void
}
const NevoLayerSettings = ({ layer, mutate }: NevoLayerSettingsProps) => (
  <>
    <div className="d-flex align-items-center mt-3">
      Scale
      <select className="custom-select ml-3" value={layer.level} onChange={e => mutate({ level: e.target.value })}>
        {
          Object.keys(nevoLevelNames).map(level =>
            <option key={level} value={level}>{nevoLevelNames[level]}</option>
          )
        }
      </select>
    </div>
    <div className="d-flex align-items-center mt-3">
      Fill mode
      <select className="custom-select ml-3" value={layer.fill} onChange={e => mutate({ fill: e.target.value })}>
        <option value="heatmap">Heatmap</option>
        <option value="greyscale">Greyscale</option>
      </select>
    </div>
    <div className="d-flex flex-column mt-3">
      Visualised property
      <select className="custom-select" value={layer.property} onChange={e => mutate({ property: e.target.value })}>
        {
          Object.keys(nevoPropertyNames).map(property =>
            <option key={property} value={property}>
              {property} - {nevoPropertyNames[property]}
            </option>
          )
        }
      </select>
    </div>
  </>
)

interface ATILayerSettingsProps {
  layer: AtiLayer
}

const ATILayerSettings = ({ layer }: ATILayerSettingsProps) => {

  const colors = layer.colors
  // backwards compatibility for old layers
  const notable = colors.notable ?? [158, 52, 235, 1]

  return (
    <details className="mt-3">
      <summary>Legend</summary>
      <span className="swatch" style={{ backgroundColor: `rgb(${colors.ancient[0]},${colors.ancient[1]},${colors.ancient[2]},1)` }} /> Ancient Tree<br />
      <span className="swatch" style={{ backgroundColor: `rgb(${colors.veteran[0]},${colors.veteran[1]},${colors.veteran[2]},1)` }} /> Veteran Tree<br />
      <span className="swatch" style={{ backgroundColor: `rgb(${notable[0]},${notable[1]},${notable[2]},1)` }} /> Notable Tree<br />
      <br />
      <span className="swatch" style={{ backgroundColor: `rgb(${colors.public[0]},${colors.public[1]},${colors.public[2]},1)` }} /> Public<br />
      <span className="swatch" style={{ backgroundColor: `rgb(${colors.private[0]},${colors.private[1]},${colors.private[2]},1)` }} /> Private<br />
    </details>
  )

}

interface ShapeLayerSettingsProps {
  layer: ShapeLayer
}

const ShapeLayerSettings = ({ layer }: ShapeLayerSettingsProps) => {
  const colors = layer.colors.fill
  const name = layer.name

  return (
    <details className="mt-3">
      <summary>Legend</summary>
      <span className="swatch" style={{ backgroundColor: `rgb(${colors.join(",")})` }} />{name}<br />
    </details>
  )
}

interface CropMapLayerSettingsProps {
  layer: CropMapLayer
}

const CropMapLayerSettings = ({ layer }: CropMapLayerSettingsProps) => (
  <>
    <details className="mt-3">
      <summary>Legend</summary>
      <img src={`https://environment.data.gov.uk/spatialdata/crop-map-of-england-${layer.year}/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&FORMAT=image%2Fpng&LAYER=Crop_Map_of_England_${layer.year}_West_Sussex`} />
    </details>
  </>
)

const CehLandCoverLayerSettings = () => (
  <>
    <details className="mt-3">
      <summary>Legend</summary>
      <span className="swatch" style={{ backgroundColor: "rgb(255, 0, 0)" }} /> Broadleaved woodland<br />
      <span className="swatch" style={{ backgroundColor: "rgb(0, 102, 0)" }} /> Coniferous woodland<br />
      <span className="swatch" style={{ backgroundColor: "rgb(115, 38, 0)" }} /> Arable and horticulture<br />
      <span className="swatch" style={{ backgroundColor: "rgb(0, 255, 0)" }} /> Improved grassland<br />
      <span className="swatch" style={{ backgroundColor: "rgb(127, 229, 127)" }} /> Neutral grassland<br />
      <span className="swatch" style={{ backgroundColor: "rgb(112, 168, 0)" }} /> Calcareous grassland<br />
      <span className="swatch" style={{ backgroundColor: "rgb(153, 129, 0)" }} /> Acid grassland<br />
      <span className="swatch" style={{ backgroundColor: "rgb(255, 255, 0)" }} /> Fen, marsh and swamp<br />
      <span className="swatch" style={{ backgroundColor: "rgb(128, 26, 128)" }} /> Heather<br />
      <span className="swatch" style={{ backgroundColor: "rgb(230, 140, 166)" }} /> Heather grassland<br />
      <span className="swatch" style={{ backgroundColor: "rgb(0, 128, 115)" }} /> Bog<br />
      <span className="swatch" style={{ backgroundColor: "rgb(210, 210, 255)" }} /> Inland rock<br />
      <span className="swatch" style={{ backgroundColor: "rgb(0, 0, 128)" }} /> Saltwater<br />
      <span className="swatch" style={{ backgroundColor: "rgb(0, 0, 255)" }} /> Freshwater<br />
      <span className="swatch" style={{ backgroundColor: "rgb(204, 179, 0)" }} /> Supralittoral rock<br />
      <span className="swatch" style={{ backgroundColor: "rgb(204, 179, 0)" }} /> Supralittoral sediment<br />
      <span className="swatch" style={{ backgroundColor: "rgb(255, 255, 128)" }} /> Littoral rock<br />
      <span className="swatch" style={{ backgroundColor: "rgb(255, 255, 128)" }} /> Littoral sediment<br />
      <span className="swatch" style={{ backgroundColor: "rgb(128, 128, 255)" }} /> Saltmarsh<br />
      <span className="swatch" style={{ backgroundColor: "rgb(0, 0, 0)" }} /> Urban<br />
      <span className="swatch" style={{ backgroundColor: "rgb(128, 128, 128)" }} /> Suburban
    </details>
  </>
)

interface ModelOutputLayerSettingsProps {
  layer: ModelOutputLayer | DatasetLayer
  mutate: (data: any) => void
  layerType: string | undefined
}

function ModelOutputLayerSettings({ layer, mutate, layerType }: ModelOutputLayerSettingsProps) {


  if (layer.fill == "heatmap") {
    layer.fill = "jet"
  }

  if (layerType !== "NumericTileGrid") {
    return (
      <>
      </>
    )
  } else {

    return (
      <div className="d-flex align-items-center mt-3">
        Fill mode
        <select className="custom-select ml-3" value={layer.fill} onChange={e => mutate({ fill: e.target.value })}>
          <optgroup label="Greyscale"></optgroup>
          <option value="greyscale">Greyscale</option>
          <optgroup label="Heatmap"></optgroup>
          <option value="jet">Jet</option>
          <option value="hsv">HSV</option>
          <option value="hot">Hot</option>
          <option value="cool">Cool</option>
          <option value="spring">Spring</option>
          <option value="summer">Summer</option>
          <option value="autumn">Autumn</option>
          <option value="winter">Winter</option>
          <option value="copper">Copper</option>
          <option value="YIGnBu">YIGnBu</option>
          <option value="greens">Greens</option>
          <option value="YIOrRd">YIOrRd</option>
          <option value="bluered">Bluered</option>
          <option value="RdBu">RdBu</option>
          <option value="picnic">Picnic</option>
          <option value="rainbow">Rainbow</option>
          <option value="portland">Portland</option>
          <option value="blackbody">Blackbody</option>
          <option value="earth">Earth</option>
          <option value="electric">Electric</option>
          <option value="viridis">Viridis</option>
          <option value="inferno">Inferno</option>
          <option value="magma">Magma</option>
          <option value="plasma">Plasma</option>
          <option value="warm">Warm</option>
          <option value="rainbow-soft">Rainbow-soft</option>
          <option value="bathymetry">Bathymetry</option>
          <option value="cdom">Cdom</option>
          <option value="chlorophyll">Chlorophyll</option>
          <option value="density">Density</option>
          <option value="freesurface-blue">Freesurface-Blue</option>
          <option value="freesurface-red">Freesurface-Red</option>
          <option value="oxygen">Oxygen</option>
          <option value="par">Par</option>
          <option value="phase">Phase</option>
          <option value="salinity">Salinity</option>
          <option value="temperature">Temperature</option>
          <option value="turbidity">Turbidity</option>
          <option value="velocity-blue">Velocity-Blue</option>
          <option value="velocity-green">Velocity-Green</option>
          <option value="cubehelix">Cubehelix</option>
        </select>
      </div>
    )
  }
}

export function ZoomData({zoom, area, length}) {
  const unit = area < 1 ? "cm²" : (area > 1000000 ? "km²" : "m²")
  length = area < 1 ? length * 100 : (area > 1000000 ? length / 1000 : length)
  area = area < 1 ? area * 10000 : (area > 1000000 ? area / 1000000 : area)
  return (
    <>
      <div title={`Rounded to two decimal places. Unrounded values; Area: ${area}${unit}, Resolution: ${length}${unit.slice(0, -1)}`} className="pl-3 pb-2 pt-2">
        Zoom level: {zoom} <br />
        Area per cell: ~{area.toFixed(2)}{unit} <br />
        Resolution per cell: ~{length.toFixed(2)}{unit.slice(0, -1)}
      </div>
    </>
  )
}

interface ModelOutputLayerLegendProps {
  layer: ModelOutputLayer | DatasetLayer
  getLayerData: (layer: DatasetLayer | ModelOutputLayer) => tileGridStats
  mutateColors: (color: [number, number, number, number][]) => void
  updateBounds: (overrideBounds: boolean, bounds: [min: number, max: number]) => void
}

export function Legend({ colors, minValue, maxValue, type, labels, mutateColors, updateBounds, overrideBounds, bounds, zoom, area, length }) {

  if (type === undefined) {
    // if layer is still loading stats will be unavailable.
    return <div></div>
  } else if (type === "BooleanTileGrid") {

    const data = [{ color: colors[0], label: "False" }, { color: colors[1], label: "True" }]

    const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>, key: number) => {
      const newColor = event.target.value
      const r = parseInt(newColor.slice(1, 3), 16)
      const g = parseInt(newColor.slice(3, 5), 16)
      const b = parseInt(newColor.slice(5, 7), 16)

      const updatedColors = colors.map((color: [number, number, number, number], index: number) => {
        return (index === key) ? [r, g, b, 1] : color
      })

      mutateColors(updatedColors)
    }

    return (
      <>
        <div className="color-bar-container-cat">
          <div className="color-bar-legend-cat">
            {data.map(({ color, label }) => (
              <div key={label} className="color-bar-label">
              <input
                type="color"
                value={`#${color[0].toString(16).padStart(2, '0')}${color[1].toString(16).padStart(2, '0')}${color[2].toString(16).padStart(2, '0')}`}
                style={{
                  marginLeft: 4.5,
                  backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
                  border: 'none',
                  width: '20px',
                  height: '20px',
                  padding: '0',
                  cursor: 'pointer',
                  marginRight: '5px'
                }}
                onChange={(event) => handleColorChange(event, label === "False" ? 0 : 1)}
              />
              <div className="color-bar-label-text">{label}</div>
              </div>
            ))}
          </div>
        </div>
        <ZoomData zoom={zoom} area={area} length={length} />
      </>
    )

  } else if (type === "CategoricalTileGrid") {

    if (labels) {

      if (!colors) return (<div></div>)

      const updateColour = (event: React.ChangeEvent<HTMLInputElement>, key: number) => {
        const checked = event.target.checked
        const updatedColors = colors.map((color: [number, number, number, number], index: number) => {
          if (index + 1 === key || key === -1) {
            return [color[0], color[1], color[2], checked ? 1 : 0]
          }
          return color
        })
        mutateColors(updatedColors)
      }

      const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>, key: number) => {
        const newColor = event.target.value
        const r = parseInt(newColor.slice(1, 3), 16)
        const g = parseInt(newColor.slice(3, 5), 16)
        const b = parseInt(newColor.slice(5, 7), 16)

        const updatedColors = colors.map((color: [number, number, number, number], index: number) => {
          if (index + 1 === key) return [r, g, b, color[3]]
          return color
        })

        mutateColors(updatedColors)
      }

      const data = labels.map(obj => ({
        label: obj.value,
        color: colors[obj.name - 1] ?? [0, 0, 0, 0],
        key: obj.name
      }))

      const colors_unchecked = () => {
        for (const innerArray of colors) {
          if (innerArray[3] !== 1) {
            return false;
          }
        }
        return true
      }

      return (
        <>
        <div className="color-bar-container-cat">
          <div className="color-bar-legend-cat">
            <div className='color-bar-label'>
              <input type="checkbox" checked={colors_unchecked()} name={"All"} onChange={(event) => updateColour(event, -1)} />
              <div className="color-bar-label-text ml-1">Select/Unselect All</div>
            </div>
            {data.map(({ color, label, key }) => (
              <div key={label} className="color-bar-label">
                <input type="checkbox" checked={color[3]} name={key} onChange={(event) => updateColour(event, key)} />
                <input
                  type="color"
                  value={`#${color[0].toString(16).padStart(2, '0')}${color[1].toString(16).padStart(2, '0')}${color[2].toString(16).padStart(2, '0')}`}
                  style={{
                    marginLeft: 4.5,
                    backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
                    border: 'none',
                    width: '20px',
                    height: '20px',
                    padding: '0',
                    cursor: 'pointer',
                    marginRight: '5px'
                  }}
                  onChange={(event) => handleColorChange(event, key)}
                />
                <div className="color-bar-label-text">{label}</div>
              </div>
            ))}
          </div>
        </div>
        <ZoomData zoom={zoom} area={area} length={length} />
        </>
      )

    } else {
      return <div></div>
    }


  } else {

    const min = overrideBounds ? bounds[0] : minValue
    const max = overrideBounds ? bounds[1] : maxValue
    const mean = min + (((max) - (min)) * .5)

    const toggleBounds = () => {

      if (!bounds) {
        bounds = [minValue, maxValue]
      }

      if (!overrideBounds && bounds[0] === null) {
        bounds = [minValue, maxValue]
      }

      updateBounds(!overrideBounds, bounds)
    }

    const handleMinChange = (e) => {
      const val = +(e.target.value as string)
      document.getElementById("minOverrideInput")?.classList.remove("text-danger")
      document.getElementById("maxOverrideInput")?.classList.remove("text-danger")
      const boundsValidation = document.getElementById("bounds-validation") as HTMLElement
      boundsValidation.style.display = "none"
      if (!isNaN(val) && val > bounds[1]) {
        document.getElementById("minOverrideInput")?.classList.add("text-danger")
        document.getElementById("maxOverrideInput")?.classList.add("text-danger")
        boundsValidation.style.display = "block"
      }
      updateBounds(overrideBounds, [val, bounds[1]])
    }

    const handleMaxChange = (e) => {
      const val = +(e.target.value as string)
      document.getElementById("minOverrideInput")?.classList.remove("text-danger")
      document.getElementById("maxOverrideInput")?.classList.remove("text-danger")
      const boundsValidation = document.getElementById("bounds-validation") as HTMLElement
      boundsValidation.style.display = "none"
      if (!isNaN(val) && val < bounds[0]) {
        document.getElementById("minOverrideInput")?.classList.add("text-danger")
        document.getElementById("maxOverrideInput")?.classList.add("text-danger")
        boundsValidation.style.display = "block"
      }
      updateBounds(overrideBounds, [bounds[0], val])
    }

    return (
      <>
      <div className="color-bar-container">
        <div className="color-bar">
          {colors.map((color) => (
            <div
              key={color.join(",")}
              style={{ backgroundColor: `rgb(${color.join(",")})` }}
              className="color-bar-item"
            />
          ))}
        </div>
        <div className="color-bar-legend">
          <div title={min.toString()} >{min.toFixed(3)}</div>
          <div title={mean.toString()} >{mean.toFixed(3)}</div>
          <div title={max.toString()} >{max.toFixed(3)}</div>
        </div>
        <div style={{ padding: 15, paddingTop: 0, paddingLeft: 35 }} className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="overrideToggle"
            checked={overrideBounds}
            onChange={toggleBounds}
          />
          <label className="form-check-label" htmlFor="overrideToggle">
            Set custom bounds
          </label>
        </div>
        {overrideBounds && (
          <>
          <div style={{ paddingRight: 15, paddingLeft: 15 }} className="row override-inputs">
            <div className="col">
              <label htmlFor="minOverrideInput" className="form-label">
                Min
              </label>
              <input
                type="number"
                className="form-control"
                id="minOverrideInput"
                value={bounds[0]}
                onChange={handleMinChange}
              />
            </div>
            <div className="col">
              <label htmlFor="maxOverrideInput" className="form-label">
                Max
              </label>
              <input
                type="number"
                className="form-control"
                id="maxOverrideInput"
                value={bounds[1]}
                onChange={handleMaxChange}
              />
            </div>
          </div>
          <div style={{ display: "none" }} id="bounds-validation" className="pl-3 text-center text-danger">
            invalid bounds
          </div>
          </>
        )}
      </div>
      <ZoomData zoom={zoom} area={area} length={length}/>
      </>
    )
  }

}

function ModelOutputLayerLegend({ layer, getLayerData, mutateColors, updateBounds }: ModelOutputLayerLegendProps) {

  const stats = getLayerData(layer)

  const colors = stats.type !== "NumericTileGrid" ? layer.colors : getColorStops((layer.fill == "greyscale" ? "greys" : (layer.fill === "heatmap" ? "jet" : layer.fill)), 50).filter(c => typeof c !== "number").reverse()

  return (
    <div>
      <Legend 
        colors={colors} 
        minValue={stats.min} 
        maxValue={stats.max} 
        type={stats.type} 
        labels={stats.labels}
        mutateColors={mutateColors} 
        updateBounds={updateBounds} 
        overrideBounds={layer.overrideBounds} 
        bounds={layer.bounds} 
        zoom={stats.zoom} 
        area={stats.area} 
        length={stats.length} />
    </div>
  )
}

interface SidebarProps {
  state: State
  selectLayer: (id: number | undefined) => void
  mutateLayer: (id: number, data: Partial<Layer>) => void
  deleteLayer: (id: number) => void
  setLayerOrder: (ids: number[]) => void
  showLayerPalette: () => void
  hide: () => void
  getLayerData: (layer: DatasetLayer | ModelOutputLayer) => tileGridStats
  selectedLayer: Layer | null
  setSelectedLayer: (layer: Layer | null) => void
}

export const Sidebar = ({ state, selectLayer, mutateLayer, deleteLayer, setLayerOrder, showLayerPalette, hide, getLayerData, selectedLayer, setSelectedLayer }: SidebarProps) => {
  setSelectedLayer(state.selectedLayer === undefined ? null : state.project.layers[state.selectedLayer])
  return <div className="d-flex flex-column" style={{ width: "300px" }}>
    <div className="px-3 py-2 border-top border-bottom d-flex align-items-center bg-light">
      <div className="flex-grow-1">Layers</div>
      <i className="ml-2 fas fa-plus fa-fw" style={{ cursor: "pointer" }} onClick={showLayerPalette} />
      <i className="ml-2 fas fa-angle-double-right" style={{ cursor: "pointer" }} onClick={hide} />
    </div>
    <div
      className="flex-grow-1 bg-white"
      style={{ overflowY: "auto", flexBasis: "0px" }}
      onClick={() => selectLayer(undefined)}
    >
      <ReactSortable
        list={Array.from(state.project.allLayers).reverse().map(id => ({ id }))}
        setList={(list: { id: number }[]) => { setLayerOrder(list.map(item => item.id).reverse()) }}
      >
        {
          Array.from(state.project.allLayers).reverse().map(id => {
            const layer = state.project.layers[id]
            const isDeleted = layer.type == "DatasetLayer" && layer.deleted === true
            const iconColor = layer.type === "ShapeLayer" ? `rgb(${layer.colors.fill.join(',')})` :  "rgb(96,96,96)"

            return (
              <div
                key={id}
                className={id === state.selectedLayer ? "d-flex align-items-center bg-primary text-white px-3 py-2" : "align-items-center d-flex px-3 py-2"}
                style={{ cursor: "pointer", color: isDeleted ? "red" : "inherit", textDecoration: isDeleted ? "line-through" : "none" }}
                title={isDeleted ? 'Dataset is unavailable.' : ""}
                onClick={(e) => {
                  e.stopPropagation()
                  selectLayer(id === state.selectedLayer ? undefined : id)
                }}
              >
                <div><i className={`fas fa-fw ${iconForLayerType(state.project.layers[id].type)}`} style={{color: iconColor, textShadow: "1px 1px 1px black"}} /></div>
                <span className="ml-2 mr-3 flex-grow-1" style={{ overflowX: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {state.project.layers[id].name}
                </span>
                <span
                  onClick={(e) => {
                    e.stopPropagation()
                    mutateLayer(id, { visible: !state.project.layers[id].visible })
                  }}
                >
                  {
                    state.project.layers[id].visible ?
                      <i className="fas fa-fw fa-eye" /> :
                      <i className="fas fa-fw fa-eye-slash" />
                  }
                </span>
              </div>
            )
          }
          )
        }
      </ReactSortable>
    </div>
    {
      (selectedLayer?.type == "ModelOutputLayer" || selectedLayer?.type == "DatasetLayer") &&
      (
        <div className="px-3 py-2 border-top border-bottom bg-light">Layer legend</div>
      )
    }
    {
      (selectedLayer?.type == "ModelOutputLayer" || selectedLayer?.type == "DatasetLayer") &&
      <ModelOutputLayerLegend
        layer={selectedLayer}
        getLayerData={getLayerData}
        mutateColors={colors => state.selectedLayer !== undefined && mutateLayer(state.selectedLayer, { colors })}
        updateBounds={(overrideBounds, bounds) => state.selectedLayer !== undefined && mutateLayer(state.selectedLayer, { overrideBounds, bounds })}
      />
    }
    <div className="px-3 py-2 border-top border-bottom bg-light">Layer settings</div>
    <div className="p-3 bg-white text-nowrap" style={{ maxHeight: "50vh", overflowY: "auto" }}>
      {
        selectedLayer !== null ?
          <>
            <input
              type="text"
              className="form-control"
              placeholder="Layer name"
              value={selectedLayer?.name}
              title={selectedLayer?.name}
              onChange={
                e => state.selectedLayer !== undefined &&
                  mutateLayer(state.selectedLayer, { name: e.target.value })
              }
            />
            <div className="d-flex align-items-center mt-3">
              Opacity
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                className="custom-range ml-3"
                value={selectedLayer.opacity}
                onChange={
                  e => state.selectedLayer !== undefined &&
                    mutateLayer(state.selectedLayer, { opacity: Number(e.target.value) })
                }
              />
            </div>
            {
              selectedLayer?.type == "OverlayLayer" &&
              <OverlayLayerSettings
                layer={selectedLayer}
                mutate={
                  data => state.selectedLayer !== undefined &&
                    mutateLayer(state.selectedLayer, data)
                }
              />
            }
            {
              selectedLayer?.type == "NevoLayer" &&
              <NevoLayerSettings
                layer={selectedLayer}
                mutate={
                  data => state.selectedLayer !== undefined &&
                    mutateLayer(state.selectedLayer, data)
                }
              />
            }
            {
              (selectedLayer?.type == "ModelOutputLayer" || selectedLayer?.type == "DatasetLayer") &&
              <ModelOutputLayerSettings
                layer={selectedLayer}
                mutate={
                  data => state.selectedLayer !== undefined &&
                    mutateLayer(state.selectedLayer, data)
                }
                layerType={
                  getLayerData(selectedLayer).type
                }
              />
            }
            {
              selectedLayer?.type == "CehLandCoverLayer" &&
              <CehLandCoverLayerSettings />
            }
            {
              selectedLayer?.type == "CropMapLayer" &&
              <CropMapLayerSettings layer={selectedLayer} />
            }
            {
              selectedLayer?.type == "AtiLayer" &&
              <ATILayerSettings layer={selectedLayer} />
            }
            {
              selectedLayer?.type == "ShapeLayer" &&
              <ShapeLayerSettings layer={selectedLayer}/>
            }
          </> :
          <em>No layer selected</em>
      }
    </div>
    <button
      disabled={state.selectedLayer === undefined || state.project.layers[state.selectedLayer].type === "ModelOutputLayer"}
      className="btn btn-outline-danger rounded-0 border-left-0 border-right-0 border-bottom-0"
      onClick={
        () => state.selectedLayer !== undefined &&
          deleteLayer(state.selectedLayer)
      }
      title={
        state.selectedLayer !== undefined && state.project.layers[state.selectedLayer].type === "ModelOutputLayer" ?
          "You can't delete model outputs from this view; please switch to the model editor and delete the corresponding node." : undefined
      }
    >
      Delete layer
    </button>
  </div>
}

interface CollapsedSidebarProps {
  show: () => void
}
export const CollapsedSidebar = ({ show }: CollapsedSidebarProps) => (
  <div className="bg-light">
    <div className="px-3 py-2 border-top border-bottom">
      <i className="fas fa-angle-double-left" style={{ cursor: "pointer" }} onClick={show} />
    </div>
  </div>
)
