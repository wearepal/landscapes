import * as React from 'react'
import { DBModels } from './db_models'
import { NevoLevel } from './nevo'
import { Layer } from './state'
import { iconForLayerType } from "./util"
import { CompiledDatasetRecord } from './saved_dataset'

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
                lost_ancient: [245, 218, 149, 1],
                lost_veteran: [77, 92, 79, 1],
                public: [0, 217, 255, 1],
                private: [235, 0, 0, 1],
              }
            }}
          />
        </Section>
        <Section title="Designations">
          {
            Array<{ name: string, identifier: string, fill: [number, number, number, number], stroke: [number, number, number, number] }>(
              {
                name: "Areas of Outstanding Natural Beauty (AONB)",
                identifier: "shapefiles:AONB_UK",
                fill: [0, 155, 0, 1],
                stroke: [0, 0, 0, 1]
              },
              {
                name: "Sites of Special Scientific Interest (SSSI)",
                identifier: "shapefiles:SSSI_UK",
                fill: [255, 0, 0, 1],
                stroke: [0, 0, 0, 1]
              },
              {
                name: "National Nature Reserves",
                identifier: "shapefiles:NNR_UK",
                fill: [42, 161, 79, 1],
                stroke: [0, 0, 0, 1]
              },
              {
                name: "Local Nature Reserves",
                identifier: "shapefiles:LNR_ENG",
                fill: [27, 174, 196, 1],
                stroke: [0, 0, 0, 1]
              },
              {
                name: "National Parks",
                identifier: "shapefiles:NP_ENG",
                fill: [255, 255, 0, 1],
                stroke: [0, 0, 0, 1]
              },
              {
                name: "Special Areas of Conservation (SAC)",
                identifier: "shapefiles:SAC_ENG",
                fill: [198, 3, 252, 1],
                stroke: [0, 0, 0, 1]
              },
              {
                name: "Ramsar Sites",
                identifier: "shapefiles:ramsar_eng",
                fill: [0, 60, 110, 1],
                stroke: [0, 0, 0, 1]
              },
              // {
              //   name: "Special Protection Areas (SPA)",
              //   identifier: "shapefiles:SPA_ENG",
              //   fill: [255, 145, 218, 1],
              //   stroke: [0, 0, 0, 1]
              // }
            ).sort((a, b) => (a.name < b.name) ? -1 : 1).map(({ name, identifier, stroke, fill }) =>
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

