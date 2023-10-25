import { BaseComponent } from "./base_component"
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { Node, Output } from 'rete'
import { BooleanTileGrid } from "../tile_grid"
import { booleanDataSocket } from "../socket_types"
import { SelectControl } from "../controls/select"
import { PreviewControl } from "../controls/preview"
import { Extent } from "ol/extent"
import { createXYZ } from "ol/tilegrid"
import * as proj4 from "proj4"
import { Polygon } from "ol/geom"

import { currentExtent as extent, zoomLevel } from "../bounding_box"



interface LandUseCategory {
    code: string
    name: string
    id: number
}

interface OverpassCoord {
    lat: number
    lon: number
}

interface OverpassFeature {
    type: string
    id: number
    bounds: object
    tags: object
    geometry: Array<OverpassCoord>
}


export async function retrieveLandUseData(extent: Extent, landuse: string): Promise<any> {

    const [e0, e1] = [(proj4 as any).default('EPSG:3857', 'EPSG:4326', extent.slice(0, 2)), (proj4 as any).default('EPSG:3857', 'EPSG:4326', extent.slice(2, 4))]

    const query = `
        [out:json];
        way(${e0[1]}, ${e0[0]}, ${e1[1]}, ${e1[0]})${landuse};
        out geom;
     `;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    const response = await fetch(url)

    return await response.json()


}

export const LandUseCategories: LandUseCategory[] = [
    //ref: https://wiki.openstreetmap.org/wiki/Land_use

    //https://wiki.openstreetmap.org/wiki/Key:landuse
    {
        "code": "[aeroway=aerodrome]",
        "name": "Aerodrome",
        "id": 0
    },
    {
        "code": "[landuse=allotments]",
        "name": "Allotments",
        "id": 1
    },
    {
        "code": "[landuse=brownfield]",
        "name": "Brownfield",
        "id": 2
    },
    {
        "code": "[landuse=cemetery]",
        "name": "Cemetery",
        "id": 3
    },
    {
        "code": "[amenity=college]",
        "name": "College",
        "id": 4
    },
    {
        "code": "[landuse=commercial]",
        "name": "Commerical",
        "id": 5
    },
    {
        "code": "[landuse=construction]",
        "name": "Construction",
        "id": 6
    },
    {
        "code": "[landuse=farmland]",
        "name": "Farm Land",
        "id": 7
    },
    {
        "code": "[landuse=farmyard]",
        "name": "Farm Yard",
        "id": 8
    },
    {
        "code": "[landuse=forest]",
        "name": "Forest",
        "id": 9
    },
    {
        "code": "[leisure=garden]",
        "name": "Garden",
        "id": 10
    },
    {
        "code": "[leisure=garages]",
        "name": "Garages",
        "id": 11
    },
    {
        "code": "[landuse=meadow]",
        "name": "Grazing",
        "id": 12
    },
    {
        "code": "[landuse=greenfield]",
        "name": "Greenfield",
        "id": 13
    },
    {
        "code": "[landuse=greenhouse_horticulture]",
        "name": "Greenhouses",
        "id": 14
    },
    {
        "code": "[amenity=hospital]",
        "name": "Hospital",
        "id": 15
    },
    {
        "code": "[landuse=industrial]",
        "name": "Industrial",
        "id": 16
    },
    {
        "code": "[landuse=landfill]",
        "name": "Landfill",
        "id": 17
    },
    {
        "code": "[landuse=meadow]",
        "name": "Meadow / Pasture",
        "id": 18
    },
    {
        "code": "[landuse=military]",
        "name": "Military",
        "id": 19
    },
    {
        "code": "[landuse=quarry]",
        "name": "Mine (open pit) / Quarry",
        "id": 20
    },
    {
        "code": "[boundary=national_park]",
        "name": "National Park",
        "id": 21
    },
    {
        "code": "[boundary=nature_reserve]",
        "name": "Nature Reserve",
        "id": 22
    },
    {
        "code": "[landuse=orchard]",
        "name": "Orchard / Plantation",
        "id": 23
    },
    {
        "code": "[leisure=park]",
        "name": "Park",
        "id": 24
    },
    {
        "code": "[amenity=parking]",
        "name": "Parking",
        "id": 25
    },
    {
        "code": "[landuse=plant_nursery]",
        "name": "Plant Nursery",
        "id": 26
    },
    {
        "code": "[landuse=railway]",
        "name": "Railway",
        "id": 27
    },
    {
        "code": "[landuse=recreation_ground]",
        "name": "Recreation Ground",
        "id": 28
    },
    {
        "code": "[landuse=religious]",
        "name": "Religious",
        "id": 29
    },
    {
        "code": "[landuse=residential]",
        "name": "Residential",
        "id": 30
    },
    {
        "code": "[landuse=retail]",
        "name": "Retail",
        "id": 31
    },
    {
        "code": "[amenity=school]",
        "name": "School",
        "id": 32
    },
    {
        "code": "[landuse=salt_pond]",
        "name": "Salt Pond",
        "id": 33
    },
    {
        "code": "[amenity=university]",
        "name": "University",
        "id": 34
    },
    {
        "code": "[landuse=village_green]",
        "name": "Village Green",
        "id": 35
    },
    {
        "code": "[landuse=vineyard]",
        "name": "Vineyard",
        "id": 36
    },
    {
        "code": "[man_made=wastewater_plant]",
        "name": "Waste water treatment",
        "id": 37
    },
]

export class OSMLandUseComponent extends BaseComponent {
    osmOutput: null
    outputCache: Map<string, BooleanTileGrid>

    constructor() {
        super("OSM land use layer")
        this.category = "Inputs"

    }

    async builder(node: Node) {


        node.meta.toolTip = "This component uses OpenStreetMap API to generate boolean datasets for specific land use types. Further information about the land use types can be found on their wiki. [click here for more info]"
        node.meta.toolTipLink = "https://wiki.openstreetmap.org/wiki/Key:landuse"


        this.osmOutput = null
        this.outputCache = new Map()

        node.addOutput(new Output('out', 'Output', booleanDataSocket))

        node.addControl(
            new SelectControl(
                this.editor,
                'osmLandCategoryId',
                () => LandUseCategories,
                () => [],
                'Land Use Category'
            )
        )

        node.addControl(new PreviewControl(() =>
            node.meta.output as any || new BooleanTileGrid(0, 0, 0, 1, 1)
        ))
    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {

        const zoom = zoomLevel

        const editorNode = this.editor?.nodes.find(n => n.id === node.id)
        if (editorNode === undefined) { return }


        let index = node.data.osmLandCategoryId as number
        if (index === undefined) { index = 0 }

        const code = LandUseCategories[index].code
        const name = LandUseCategories[index].name

        if (this.outputCache.has(code)) {
            const result = editorNode.meta.output = outputs['out'] = this.outputCache.get(code)
        } else {

            const json = await retrieveLandUseData(extent, code)

            const features = json.elements as Array<OverpassFeature>

            const tileGrid = createXYZ()

            const outputTileRange = tileGrid.getTileRangeForExtentAndZ(extent, zoom)

            const result = editorNode.meta.output = outputs['out'] = new BooleanTileGrid(
                zoom,
                outputTileRange.minX,
                outputTileRange.minY,
                outputTileRange.getWidth(),
                outputTileRange.getHeight()
            )
            result.name = name

            features.forEach((feature) => {

                const geom = feature.geometry

                const epsg3857_geometry = geom.map((e) => (proj4 as any).default('EPSG:4326', 'EPSG:3857', [e.lon, e.lat]))

                const polygon = new Polygon([epsg3857_geometry])

                const featureTileRange = tileGrid.getTileRangeForExtentAndZ(
                    polygon.getExtent(),
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
                        const tileExtent = tileGrid.getTileCoordExtent([zoom, x, y])
                        if (polygon.intersectsExtent(tileExtent)) {

                            result.set(x, y, true)
                        }
                    }
                }


            })

            this.outputCache.set(code, result)
        }


        const previewControl: any = editorNode.controls.get('Preview')
        previewControl.update()
        editorNode.update()


    }
}