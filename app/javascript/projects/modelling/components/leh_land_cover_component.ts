import { Extent } from "ol/extent";
import { BaseComponent } from "./base_component";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { Node, Output, Socket } from "rete";
import { booleanDataSocket, categoricalDataSocket } from "../socket_types";
import { createXYZ } from "ol/tilegrid";
import { bboxFromExtent, maskFromExtentAndShape } from "../bounding_box";
import { GeoJSON } from "ol/format";
import { BooleanTileGrid, CategoricalTileGrid } from "../tile_grid";
import { find } from "lodash";

interface Habitat {
    name: string
    socket: Socket
    id: number
}

const habitats: Habitat[] = [
    { 
        name: "Acid, Calcareous, Neutral Grassland", 
        socket: booleanDataSocket,
        id: 1
    },
    { 
        name: "Arable and Horticultural", 
        socket: booleanDataSocket ,
        id: 2
    },
    {
        name: "Bare Ground",
        socket: booleanDataSocket,
        id: 3
    },
    {
        name: "Bare Sand",
        socket: booleanDataSocket,
        id: 4
    },
    {
        name: "Bog",
        socket: booleanDataSocket,
        id: 5
    },
    {
        name: "Bracken",
        socket: booleanDataSocket,
        id: 6
    },
    {
        name: "Broadleaved, Mixed and Yew Woodland",
        socket: booleanDataSocket,
        id: 7
    },
    {
        name: "Built-up Areas and Gardens",
        socket: booleanDataSocket,
        id: 8
    },
    {
        name: "Coastal Saltmarsh",
        socket: booleanDataSocket,
        id: 9
    },
    {
        name: "Coastal Sand Dunes",
        socket: booleanDataSocket,
        id: 10
    },
    {
        name: "Coniferous Woodland",
        socket: booleanDataSocket,
        id: 11
    },
    {
        name: "Dwarf Shrub Heath",
        socket: booleanDataSocket,
        id: 12
    },
    {
        name: "Fen, Marsh and Swamp",
        socket: booleanDataSocket,
        id: 13
    },
    {
        name: "Improved Grassland",
        socket: booleanDataSocket,
        id: 14
    },
    {
        name: "Scrub",
        socket: booleanDataSocket,
        id: 15
    },
    {
        name: "Unclassified",
        socket: booleanDataSocket,
        id: 16
    },
    {
        name: "Water",
        socket: booleanDataSocket,
        id: 17
    },
    { 
        name: "All", 
        socket: categoricalDataSocket, 
        id: 0
    },
]
  

async function renderCategoricalData(extent: Extent, zoom: number, maskMode: boolean, maskLayer: string, maskCQL: string) : Promise<CategoricalTileGrid> {

    const tileGrid = createXYZ()
    const outputTileRange = tileGrid.getTileRangeForExtentAndZ(extent, zoom)

    const response = await fetch(
        "https://landscapes.wearepal.ai/geoserver/wfs?" +
        new URLSearchParams(
          {
            outputFormat: 'application/json',
            request: 'GetFeature',
            typeName: 'ukceh:leh_habitat_p4',
            srsName: 'EPSG:3857',
            bbox : bboxFromExtent(extent),
          }
        )
    )
    if (!response.ok) throw new Error()

    
    const mask = await maskFromExtentAndShape(extent, zoom, maskLayer, maskCQL, maskMode)
  
    const features = new GeoJSON().readFeatures(await response.json())

    const result = new CategoricalTileGrid(
        zoom,
        outputTileRange.minX,
        outputTileRange.minY,
        outputTileRange.getWidth(),
        outputTileRange.getHeight()
    )


    for (let feature of features) {
        const geom = feature.getGeometry()
        if (geom === undefined) { continue }

        const val = feature.get("A_pred")
        if (val === undefined) { continue }

        const key = find(habitats, hab => hab.name === val)
        

        const featureTileRange = tileGrid.getTileRangeForExtentAndZ(
        geom.getExtent(),
        zoom
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
            const center = tileGrid.getTileCoordCenter([zoom, x, y])
            if (geom.intersectsCoordinate(center)) {
                result.set(x, y, mask.get(x, y) ? key?.id ?? 0 : 0)
            }
        }
        }
    }

    const labels = new Map()
    habitats.forEach(hab => {
        if(hab.id === 0) return
        labels.set(hab.id, hab.name)
    })
    result.setLabels(labels)

    return result
}

export class LehLandCoverComponent extends BaseComponent {
    projectExtent: Extent
    projectZoom: number
    categoricalData: CategoricalTileGrid | null
    outputCache: Map<number, BooleanTileGrid>
    maskMode: boolean
    maskLayer: string
    maskCQL: string

    constructor(projectExtent: Extent, projectZoom: number, maskMode: boolean, maskLayer: string, maskCQL: string) {
        super("Living England Land Cover")
        this.category = "Inputs"
        this.projectExtent = projectExtent
        this.projectZoom = projectZoom
        this.categoricalData = null
        this.outputCache = new Map()
        this.maskMode = maskMode
        this.maskLayer = maskLayer
        this.maskCQL = maskCQL
    }

  async builder(node: Node) {
    node.meta.toolTip = "Living England is a multi-year project which delivers a habitat probability map for the whole of England, created using satellite imagery, field data records and other geospatial data in a machine learning framework. The Living England habitat probability map shows the extent and distribution of broad habitats across England."
    node.meta.toolTipLink = "https://naturalengland.blog.gov.uk/2022/04/05/living-england-from-satellite-imagery-to-a-national-scale-habitat-map/"

    habitats.forEach(hab => {
      node.addOutput(new Output(hab.id.toString(), hab.name, hab.socket))
    })
  }

  async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {

    if (this.categoricalData === null) {
        this.categoricalData = await renderCategoricalData(this.projectExtent, this.projectZoom, this.maskMode, this.maskLayer, this.maskCQL)
    }
      const categoricalData = this.categoricalData!
  
      habitats.filter(
        habitat => node.outputs[habitat.id].connections.length > 0
      ).forEach(habitat => {

        console.log(habitat.id)
        if (habitat.id == 0) {

  
            outputs[habitat.id] = this.categoricalData
  
        } else {
            if (this.outputCache.has(habitat.id)) {
                outputs[habitat.id] = this.outputCache.get(habitat.id)
            }
            else {
                const out = outputs[habitat.id] = new BooleanTileGrid(categoricalData.zoom, categoricalData.x, categoricalData.y, categoricalData.width, categoricalData.height)
                out.name = habitat.name
    
                categoricalData.iterate((x, y, value) => out.set(x, y, value === habitat.id))
    
                this.outputCache.set(habitat.id, out)
            }
        }
      })
  }

}