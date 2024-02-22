import * as React from 'react'
import { DBModels } from './db_models'
import { NevoLevel } from './nevo'
import { KewOption, Layer } from './state'
import { iconForLayerType } from "./util"
import { CompiledDatasetRecord } from './saved_dataset'
import { designations } from './modelling/designations'

interface AddLayerButtonProps {
  prototype: Layer
  addLayer: (Layer) => void
}
const AddLayerButton = ({ prototype, addLayer }: AddLayerButtonProps) => (
  <div
    className="px-3 py-2 d-flex align-items-center add-layer-button"
    onClick={() => addLayer(prototype)}
  >
    <i className={`fas fa-fw ${iconForLayerType(prototype.type)}`} />
    <div className="ml-2 mr-3 flex-grow-1">{prototype.name}</div>
    <i className="fas fa-plus add-layer-button-plus" />
  </div>
)

interface SectionProps {
  title: string
  children?: React.ReactNode
}
const Section = ({ title, children }: SectionProps) => (
  <details>
    <summary className="px-3 py-2 bg-light border-bottom">{title}</summary>
    <div className="d-flex flex-column border-bottom bg-white">
      {children}
    </div>
  </details>
)

interface LayerPaletteProps {
  addLayer: (Layer) => void
  hide: () => void
  dbModels: DBModels
  getTeamDatasets: () => Promise<Array<CompiledDatasetRecord>>
  teamName: string
}

export const LayerPalette = ({ addLayer, hide, dbModels, getTeamDatasets, teamName }: LayerPaletteProps) => {

  const [teamDatasets, setTeamDatasets] = React.useState<CompiledDatasetRecord[]>([])

  React.useEffect(() => {
    getTeamDatasets()
      .then((datasets) => {
        setTeamDatasets(datasets)
      })
      .catch((error) => {
        console.error('Error fetching team datasets:', error)
      })
  }, [])


  return (
    <div className="bg-light border-right d-flex flex-column" style={{ minWidth: "300px" }}>
      <div className="px-3 py-2 border-top border-bottom d-flex align-items-center justify-content-between">
        Add layer
        <i className="fas fa-times" style={{ cursor: "pointer" }} onClick={hide} />
      </div>
      <div className="flex-grow-1" style={{ overflowY: "auto", flexBasis: "0px" }}>
        {
          teamDatasets.length > 0 &&
          <Section title={teamName}>
            {teamDatasets.sort((a, b) => a.name.localeCompare(b.name)).map((dataset) => (
              <AddLayerButton
                key={dataset.id}
                addLayer={addLayer}
                prototype={{
                  type: "DatasetLayer",
                  id: dataset.id,
                  name: dataset.name,
                  visible: true,
                  opacity: 1,
                  fill: "greyscale",
                  colors: [],
                  overrideBounds: false,
                  bounds: undefined
                }}
              />
            ))}
          </Section>
        }
        <Section title="Machine Learning Output">
          <AddLayerButton
            addLayer={addLayer}
            prototype={{
              type: "MLLayer",
              layerName: "ml:tree_hedge_predictions",
              name: "Trees & Hedges Classification",
              visible: true,
              opacity: 1,
            }}
          />
        </Section>
        <Section title="Kew Samples">
          {
            Array<{ name: string, location: string, metric: string, loc : string | undefined, periodOptions: KewOption[], typeOptions: KewOption[] }>(
              {
                name: "SSSI Woodland",
                location: "kew:sssi_wood_os_bng_04m_grid",
                metric: "grasses",
                loc: undefined,
                periodOptions: [
                  { value: "Summer22", label: "Summer 22", selected: false },
                  { value: "Autumn22", label: "Autumn 22", selected: false },
                  { value: "Spring23", label: "Spring 23", selected: false },
                  { value: "Summer23", label: "Summer 23", selected: false },
                  { value: "Autumn23", label: "Autumn 23", selected: true },
                ],
                typeOptions: [
                  { value: "grasses", label: "Grass", max : 100 },
                  { value: "forbs", label: "Forbs" , max : 100},
                  { value: "bryos", label: "Bryos" , max : 100},
                  { value: "leaf_litter", label: "Leaf Liter", max : 100 },
                  { value: "bare_ground", label: "Bare Ground" , max : 100},
                  { value: "canopy_cover", label: "Canopy" , max : 100},
                ]
              },
              {
                name: "Young Conifer",
                location: "kew:young_conifer_os_bng_04m_grid",
                metric: "totalCarbon",
                loc: "DenseCon",
                periodOptions: [
                  { value: "Sp21", label: "Spring 2022", selected: false },
                  { value: "Aut21", label: "Autumn 2021", selected: false },
                  { value: "Su22", label: "Summer 2022", selected: false },
                  { value: "Su22_2", label: "Summer 2022 - 2" , selected: false},
                  { value: "Aut22", label: "Autumn 2022", selected: false },
                  { value: "Sp23", label: "Spring 2023" , selected: false},
                  { value: "Su23", label: "Summer 2023", selected: true }
                ],
                typeOptions: [
                  { value: "totalCarbon", label: "Total Carbon", max : 7},
                  { value: "soil_density", label: "Soil Density", max : 1200 },
                  { value: "pH", label: "pH", max : 14},
                  { value: "dry_matter", label: "Dry Matter", max : 100},
                ]
              },
              {
                name: "Coronation Meadow",
                location: "kew:coronation_meadow_os_bng_02m_grid",
                metric: "totalCarbon",
                loc: "Meadow",
                periodOptions: [
                  { value: "Sp21", label: "Spring 2022", selected: false },
                  { value: "Aut21", label: "Autumn 2021", selected: false },
                  { value: "Su22", label: "Summer 2022", selected: false },
                  { value: "Su22_2", label: "Summer 2022 - 2" , selected: false},
                  { value: "Aut22", label: "Autumn 2022", selected: false },
                  { value: "Sp23", label: "Spring 2023" , selected: false},
                  { value: "Su23", label: "Summer 2023", selected: true }
                ],
                typeOptions: [
                  { value: "totalCarbon", label: "Total Carbon", max : 7},
                  { value: "soil_density", label: "Soil Density", max : 1200 },
                  { value: "pH", label: "pH", max : 14},
                  { value: "dry_matter", label: "Dry Matter", max : 100},
                ]
              }
            ).map(({ name, location, metric, periodOptions, typeOptions, loc }) =>
              <AddLayerButton
                addLayer={addLayer}
                prototype={{
                  type: "KewLayer",
                  name,
                  location,
                  metric,
                  periodOptions,
                  typeOptions,
                  visible: true,
                  opacity: 1,
                  loc
                }}
              />
            )
          }
        </Section>
        <Section title="Ancient Tree Inventory">
          <AddLayerButton
            addLayer={addLayer}
            prototype={{
              type: "AtiLayer",
              name: "Ancient Tree Inventory",
              visible: true,
              opacity: 1,
              colors: {
                ancient: [255, 183, 0, 1],
                veteran: [0, 82, 11, 1],
                notable: [158, 52, 235, 1],
                public: [0, 217, 255, 1],
                private: [235, 0, 0, 1],
              }
            }}
          />
        </Section>
        <Section title="Designations">
          {
            designations.sort((a, b) => (a.name < b.name) ? -1 : 1).map(({ name, identifier, stroke, fill }) =>
              <AddLayerButton
                addLayer={addLayer}
                prototype={{
                  type: "ShapeLayer",
                  name,
                  colors: {
                    stroke,
                    fill
                  },
                  identifier,
                  visible: true,
                  opacity: 1,
                }}
              />
            )
          }
        </Section>
        <Section title="OS Boundaries">
          {
            Array<{ name: string, identifier: string }>(
              {
                name: "Historic Counties",
                identifier: "shapefiles:boundary_line_historic_counties"
              },
              {
                name: "Ceremonial Counties",
                identifier: "shapefiles:boundary_line_ceremonial_counties"
              },
              {
                name: "Westminster Constituencies",
                identifier: "shapefiles:westminster_const "
              },
              {
                name: "Polling Districts",
                identifier: "shapefiles:polling_districts_england"
              }
            ).sort((a, b) => (a.name < b.name) ? -1 : 1).map(({ name, identifier }) =>
              <AddLayerButton
                addLayer={addLayer}
                prototype={{
                  type: "BoundaryLayer",
                  name,
                  identifier,
                  visible: true,
                  opacity: 1,
                }}
              />
            )
          }
        </Section>
        <Section title="NEVO">
          {
            Array<{ name: string, level: NevoLevel }>(
              { name: "NEVO data (2km grid)", level: "2km" },
              { name: "NEVO data (Subcatchments)", level: "subbasins" },
              { name: "NEVO data (National Parks)", level: "national_parks" },
              { name: "NEVO data (Local Authorities)", level: "lad" },
              { name: "NEVO data (Catchments)", level: "basins" },
              { name: "NEVO data (Counties)", level: "counties_uas" },
              { name: "NEVO data (GORs)", level: "regions" },
              { name: "NEVO data (Countries)", level: "countries" },
            ).map(({ name, level }) =>
              <AddLayerButton
                key={level}
                addLayer={addLayer}
                prototype={{
                  type: "NevoLayer",
                  name,
                  visible: true,
                  opacity: 1,
                  level,
                  property: "urban_ha",
                  fill: "heatmap"
                }}
              />
            )
          }
        </Section>
        <Section title="UKCEH Land Cover Maps">
          <AddLayerButton
            addLayer={addLayer}
            prototype={{
              type: "CehLandCoverLayer",
              name: "UKCEH Land Cover Map 2021",
              visible: true,
              opacity: 1,
              year: 2021,
            }}
          />
          <AddLayerButton
            addLayer={addLayer}
            prototype={{
              type: "ShapeLayer",
              name: "UKCEH Woody Linear Features",
              identifier: "ukceh:linearwoody2",
              colors: {
                stroke: [0, 255, 0, 1],
                fill: [0, 255, 0, 1],
                strokeWidth: 3
              },
              visible: true,
              opacity: 1,
              minZoom: 15
            }}
          />
        </Section>
        <Section title="Crop Map of England">
          {
            Array<{ year: number }>(
              { year: 2018 }, { year: 2019 }, { year: 2020 }, { year: 2021 }
            ).map((year) =>
              <AddLayerButton
                addLayer={addLayer}
                prototype={{
                  type: "CropMapLayer",
                  name: `Crop Map of England (CROME) ${year.year}`,
                  visible: true,
                  opacity: 1,
                  year: year.year
                }}
              />)
          }
        </Section>
        {
          dbModels.overlays.length > 0 &&
          <Section title="Overlays">
            {
              dbModels.overlays.map(layer => (
                <AddLayerButton
                  key={layer.id}
                  addLayer={addLayer}
                  prototype={{
                    type: "OverlayLayer",
                    name: layer.name,
                    visible: true,
                    opacity: 1,
                    id: layer.id,
                    strokeWidth: 2,
                    fillOpacity: 0.2
                  }}
                />
              ))
            }
          </Section>
        }
        {
          dbModels.mapTileLayers.length > 0 &&
          <Section title="Aerial/Satellite imagery">
            {
              dbModels.mapTileLayers.map(layer => (
                <AddLayerButton
                  key={layer.id}
                  addLayer={addLayer}
                  prototype={{
                    type: "MapTileLayer",
                    name: layer.name,
                    visible: true,
                    opacity: 1,
                    id: layer.id
                  }}
                />
              ))
            }
          </Section>
        }
        <Section title="Base layers">
          <AddLayerButton
            addLayer={addLayer}
            prototype={{
              type: "OsmLayer",
              name: "OpenStreetMap",
              visible: true,
              opacity: 1
            }}
          />
        </Section>
      </div>
    </div>
  )
}

