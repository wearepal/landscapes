import * as React from 'react'
import { DBModels } from './db_models'
import { NevoLevel } from './nevo'
import { KewOption, Layer } from './state'
import { iconForLayerType } from "./util"
import { CompiledDatasetRecord } from './saved_dataset'
import { designations } from './modelling/designations'
import { IMDProperties } from './reify_layer/imd'
import { ProjectPermissions } from './project_editor'
import { KewPointOptions } from './reify_layer/kew'
import { seasonYearOptions } from './modelling/components/kew_samples_component'
import { natmap_outputs } from './modelling/components/natmap_soil_component'

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
  permissions: ProjectPermissions
}

export const LayerPalette = ({ addLayer, hide, dbModels, getTeamDatasets, teamName, permissions }: LayerPaletteProps) => {

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
        {/* <Section title="Machine Learning Output">
          <AddLayerButton
            addLayer={addLayer}
            prototype={{
              type: "GeoserverLayer",
              layerName: "ml:tree_hedge_predictions",
              name: "Trees & Hedges Classification",
              visible: true,
              opacity: 1,
            }}
          />
        </Section> */}
        {
          permissions.KewSamples &&
          <Section title="Kew">
            {
              <AddLayerButton
                  addLayer={addLayer}
                  prototype={{
                    type: "KewPointLayer",
                    name: "Wakehurst Soil",
                    identifier: "kew:wakehurst_soil_rp3857_v2",
                    fill: "hsv",
                    metric: KewPointOptions.indexOf(KewPointOptions.find(option => option.value === "ph")!),
                    visible: true,
                    opacity: 1,
                    seasonYear: seasonYearOptions[0]
                  }}
              />
            }
          </Section>
        }
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
            designations.sort((a, b) => (a.name < b.name) ? -1 : 1).map(({ name, identifier, stroke, fill, attribution }) =>
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
                  attribution
                }}
              />
            )
          }
        </Section>
        <Section title="OS Boundaries">
          {
            Array<{ name: string, identifier: string, target: string }>(
              {
                name: "Historic Counties",
                identifier: "shapefiles:boundary_line_historic_counties",
                target: "all"
              },
              {
                name: "Ceremonial Counties",
                identifier: "shapefiles:boundary_line_ceremonial_counties",
                target: "all"
              },
              {
                name: "Westminster Constituencies (2010-2024)",
                identifier: "shapefiles:westminster_const ",
                target: "all"
              },
              {
                name: "Westminster Constituencies (2024 onwards)",
                identifier: "shapefiles:bdline_gb__westminster_const",
                target: "all"
              },
              {
                name: "Polling Districts",
                identifier: "shapefiles:polling_districts_england",
                target: "all"
              },
              {
                name: "District Councils",
                identifier: "shapefiles:district_borough_unitary",
                target: "all"
              },
              {
                name: "Wealden District Council",
                identifier: "shapefiles:district_borough_unitary",
                target: "Wealden District"
              }
            ).sort((a, b) => (a.name < b.name) ? -1 : 1).map(({ name, identifier, target }) =>
              <AddLayerButton
                addLayer={addLayer}
                prototype={{
                  type: "BoundaryLayer",
                  name,
                  identifier,
                  visible: true,
                  opacity: 1,
                  target
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
        <Section title="ORVal">
          {
            Array<{ name: string, source: string, style: string }>(
              { name: "Parks" , source: "ORVAL:parks_england", style: "ORVAL:orvalparks"},
              { name: "Beaches", source: "ORVAL:beaches_england", style: ""},
              { name: "Paths", source: "ORVAL:paths_england", style: ""},
              { name: "Path Access Points", source: "ORVAL:paths_england_accesspts", style: ""},
            ).map(({ name, source, style }) =>
              <AddLayerButton
                addLayer={addLayer}
                prototype={{
                  type: "ORValLayer",
                  name,
                  visible: true,
                  opacity: 1,
                  source,
                  style
                }}
              />
            )
          }
        </Section>
        <Section title="Indices of Multiple Deprivation">
          {
            Array<{ year: number }>(
              { year: 2019 }
            ).map(({ year }) => 
              <AddLayerButton
                addLayer={addLayer}
                prototype={{
                  type: "IMDLayer",
                  name: `Indices of Multiple Deprivation ${year}`,
                  visible: true,
                  opacity: 1,
                  fill: "jet",
                  property: IMDProperties[0],
                  year
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
          permissions.NATMAPSoil &&
          <Section title="Natmap Soil">
              <AddLayerButton
                addLayer={addLayer}
                prototype={{
                  type: "WFSLayer",
                  name: "Natmap Soil Carbon",
                  layer: "cranfield_soil:NATMAPcarbon",
                  attribution: "Cranfield University",
                  propIdx: 0,
                  visible: true,
                  opacity: 1,
                  fill: "jet"
                }}
              />
            
          </Section>
        }
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
          (dbModels.mapTileLayers.length > 0 || permissions.KewRgb25cm) &&
          <Section title="Aerial/Satellite imagery">
            {permissions.KewRgb25cm &&          
              <AddLayerButton
                addLayer={addLayer}
                prototype={{
                  layerName: "rgb:full_mosaic_3857",
                  type: "GeoserverLayer",
                  name: "RGB 25cm",
                  visible: true,
                  opacity: 1,
                }}
              />
            }
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

