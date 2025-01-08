import { BaseComponent } from "./base_component"
import { Node, Output, Socket } from "rete"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { ProjectProperties } from "."
import { KewPointOptions } from "../../reify_layer/kew"
import { createXYZ } from "ol/tilegrid"
import { bboxFromExtent, maskFromExtentAndShape } from "../bounding_box"
import { GeoJSON } from "ol/format"
import { Feature } from "ol"
import { BooleanTileGrid, NumericTileGrid } from "../tile_grid"
import { CheckboxControl } from "../controls/checkboxgroup"

const seasons = [
    {
        id: 0,
        name: 'Spring'
    },
    {
        id: 1,
        name: 'Summer'
    },
    {
        id: 2,
        name: 'Autumn'
    },
    {
        id: 3,
        name: 'Winter'
    }
]

const years = [
    {
        id: 0,
        name: '2022'
    },
    {
        id: 1,
        name: '2023'
    },
    {
        id: 2,
        name: '2024'
    }
]

export const seasonYearOptions = years.flatMap(year => seasons.map(season => ({id: year.id*4 + season.id, name: `${season.name} ${year.name}`, year: year.name, season: season.name})))

interface SeasonYearOption {
    id: number
    name: string
    year: string
    season: string
}

function applyFeaturesToGrid(features: Feature[], grid: NumericTileGrid, projectProps: ProjectProperties, seasonyear: (undefined | SeasonYearOption)[], prop: string, mask: BooleanTileGrid) : NumericTileGrid {
    features.forEach((feature) => {
        seasonyear.forEach(sy => {

            const year = sy?.year!
            const season = sy?.season!

            if(feature.get('year').toString().slice(-2) == year.slice(-2) && feature.get('season') == season){
                const value = feature.get(prop)
                const geom = feature.getGeometry()

                if(value && geom){
                    // geom is point data
                    const [fx, fy] = (geom as any).getCoordinates()
                    //const extent = [fx-2, fy-2, fx+2, fy+2]
                    const extent = [fx, fy, fx, fy]

                    const tileGrid = createXYZ() 

                    const outputTileRange = tileGrid.getTileRangeForExtentAndZ(
                        projectProps.extent,
                        projectProps.zoom
                    )

                    const featureTileRange = tileGrid.getTileRangeForExtentAndZ(
                        extent,
                        projectProps.zoom
                    )

                    for (
                        let x = Math.max(featureTileRange.minX, outputTileRange.minX);
                        x <= Math.min(featureTileRange.maxX, outputTileRange.maxX);
                        ++x
                        ) {
                        for (
                            let y = Math.max(featureTileRange.minY, outputTileRange.minY);
                            y <= Math.min(featureTileRange.maxY, outputTileRange.maxY);
                            ++y
                        ) {
                            if(mask.get(x, y)) grid.set(x, y, +value)
                        }
                    }

                }
                
            }
        })
    })

    return grid
}

async function retrieveKewSamples(projectProps: ProjectProperties) : Promise<any>{
    
    const response = await fetch(
        "https://landscapes.wearepal.ai/geoserver/wfs?" +
        new URLSearchParams(
          {
            outputFormat: 'application/json',
            request: 'GetFeature',
            typeName: 'kew:wakehurst_soil_rp3857_v2',
            srsName: 'EPSG:3857',
            bbox : bboxFromExtent(projectProps.extent),
          }
        )
    )

    if (!response.ok) throw new Error()
    
    const mask = await maskFromExtentAndShape(projectProps.extent, projectProps.zoom, projectProps.maskLayer, projectProps.maskCQL, projectProps.mask)
      
    const features = new GeoJSON().readFeatures(await response.json())

    return features
    
}

export class KewSamplesComponent extends BaseComponent {
    projectProps: ProjectProperties
    featuresCache: Feature[] | undefined
    gridCache: Map<string, NumericTileGrid>
    seasonYearOptions: SeasonYearOption[]

    constructor(projectProps : ProjectProperties) {
        super("Kew Samples")
        this.category = "Kew"
        this.projectProps = projectProps
        this.featuresCache = undefined
        this.gridCache = new Map()
        this.seasonYearOptions = seasonYearOptions
    }

    async builder(node: Node) {

        node.addControl(new CheckboxControl(this.editor, 'Season', this.seasonYearOptions))
        
        KewPointOptions.forEach((option) => {
            if(option.socket){
                node.addOutput(new Output(option.value, option.label, option.socket))
            }
        })
    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {

        if (this.featuresCache === undefined) {
            this.featuresCache = await retrieveKewSamples(this.projectProps)
        }

        const features = this.featuresCache
        if (features === undefined) {
            return
        }

        const seasonyears = (node.data.Season as number[]).map(season => this.seasonYearOptions.find(s => s.id == season))

        const tileGrid = createXYZ()
        const outputTileRange = tileGrid.getTileRangeForExtentAndZ(this.projectProps.extent, this.projectProps.zoom)
        const mask = await maskFromExtentAndShape(this.projectProps.extent, this.projectProps.zoom, this.projectProps.maskLayer, this.projectProps.maskCQL, this.projectProps.mask)
      
        KewPointOptions.filter(opt => opt.socket).filter(opt => node.outputs[opt.value].connections.length > 0).forEach(option => {
            if(this.gridCache.has(option.value+seasonyears.join('_'))){
                outputs[option.value] = this.gridCache.get(option.value+seasonyears.join('_'))
            }else{  
                const grid = new NumericTileGrid(this.projectProps.zoom, outputTileRange.minX, outputTileRange.minY, outputTileRange.getWidth(), outputTileRange.getHeight())
                const r = applyFeaturesToGrid(features, grid, this.projectProps, seasonyears, option.value, mask)
                this.gridCache.set(option.value+option.value+seasonyears.join('_'), r)
                outputs[option.value] = r
            }
        })

    }
}