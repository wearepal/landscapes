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
import { Point, Polygon } from "ol/geom"
import { maskFromExtentAndShape } from "../bounding_box"
import { ProjectProperties } from "."



interface LandUseCategory {
    code: string
    name: string
    id: number
    type: "node" | "way" | "relation"
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
    lat: number
    lon: number
}


export async function retrieveLandUseData(extent: Extent, landuse: string, type: "node" | "way" | "relation"): Promise<any> {

    const [e0, e1] = [(proj4 as any).default('EPSG:3857', 'EPSG:4326', extent.slice(0, 2)), (proj4 as any).default('EPSG:3857', 'EPSG:4326', extent.slice(2, 4))]

    const query = `
        [out:json];
        ${type}(${e0[1]}, ${e0[0]}, ${e1[1]}, ${e1[0]})${landuse};
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
        "id": 0,
        "type": "way"
    },
    {
        "code": "[landuse=allotments]",
        "name": "Allotments",
        "id": 1,
        "type": "way"
    },
    {
        "code": "[landuse=brownfield]",
        "name": "Brownfield",
        "id": 2,
        "type": "way"
    },
    {
        "code": "[landuse=cemetery]",
        "name": "Cemetery",
        "id": 3,
        "type": "way"
    },
    {
        "code": "[amenity=college]",
        "name": "College",
        "id": 4,
        "type": "way"
    },
    {
        "code": "[landuse=commercial]",
        "name": "Commerical",
        "id": 5,
        "type": "way"
    },
    {
        "code": "[landuse=construction]",
        "name": "Construction",
        "id": 6,
        "type": "way"
    },
    {
        "code": "[landuse=farmland]",
        "name": "Farm Land",
        "id": 7,
        "type": "way"
    },
    {
        "code": "[landuse=farmyard]",
        "name": "Farm Yard",
        "id": 8,
        "type": "way"
    },
    {
        "code": "[landuse=forest]",
        "name": "Forest",
        "id": 9,
        "type": "way"
    },
    {
        "code": "[leisure=garden]",
        "name": "Garden",
        "id": 10,
        "type": "way"
    },
    {
        "code": "[leisure=garages]",
        "name": "Garages",
        "id": 11,
        "type": "way"
    },
    {
        "code": "[landuse=meadow]",
        "name": "Grazing",
        "id": 12,
        "type": "way"
    },
    {
        "code": "[landuse=greenfield]",
        "name": "Greenfield",
        "id": 13,
        "type": "way"
    },
    {
        "code": "[landuse=greenhouse_horticulture]",
        "name": "Greenhouses",
        "id": 14,
        "type": "way"
    },
    {
        "code": "[amenity=hospital]",
        "name": "Hospital",
        "id": 15,
        "type": "way"
    },
    {
        "code": "[landuse=industrial]",
        "name": "Industrial",
        "id": 16,
        "type": "way"
    },
    {
        "code": "[landuse=landfill]",
        "name": "Landfill",
        "id": 17,
        "type": "way"
    },
    {
        "code": "[landuse=meadow]",
        "name": "Meadow / Pasture",
        "id": 18,
        "type": "way"
    },
    {
        "code": "[landuse=military]",
        "name": "Military",
        "id": 19,
        "type": "way"
    },
    {
        "code": "[landuse=quarry]",
        "name": "Mine (open pit) / Quarry",
        "id": 20,
        "type": "way"
    },
    {
        "code": "[boundary=national_park]",
        "name": "National Park",
        "id": 21,
        "type": "way"
    },
    {
        "code": "[boundary=nature_reserve]",
        "name": "Nature Reserve",
        "id": 22,
        "type": "way"
    },
    {
        "code": "[landuse=orchard]",
        "name": "Orchard / Plantation",
        "id": 23,
        "type": "way"
    },
    {
        "code": "[leisure=park]",
        "name": "Park",
        "id": 24,
        "type": "way"
    },
    {
        "code": "[amenity=parking]",
        "name": "Parking",
        "id": 25,
        "type": "way"
    },
    {
        "code": "[landuse=plant_nursery]",
        "name": "Plant Nursery",
        "id": 26,
        "type": "way"
    },
    {
        "code": "[landuse=railway]",
        "name": "Railway",
        "id": 27,
        "type": "way"
    },
    {
        "code": "[landuse=recreation_ground]",
        "name": "Recreation Ground",
        "id": 28,
        "type": "way"
    },
    {
        "code": "[landuse=religious]",
        "name": "Religious",
        "id": 29,
        "type": "way"
    },
    {
        "code": "[landuse=residential]",
        "name": "Residential",
        "id": 30,
        "type": "way"
    },
    {
        "code": "[landuse=retail]",
        "name": "Retail",
        "id": 31,
        "type": "way"
    },
    {
        "code": "[amenity=school]",
        "name": "School",
        "id": 32,
        "type": "way"
    },
    {
        "code": "[landuse=salt_pond]",
        "name": "Salt Pond",
        "id": 33,
        "type": "way"
    },
    {
        "code": "[amenity=university]",
        "name": "University",
        "id": 34,
        "type": "way"
    },
    {
        "code": "[landuse=village_green]",
        "name": "Village Green",
        "id": 35,
        "type": "way"
    },
    {
        "code": "[landuse=vineyard]",
        "name": "Vineyard",
        "id": 36,
        "type": "way"
    },
    {
        "code": "[man_made=wastewater_plant]",
        "name": "Waste water treatment",
        "id": 37,
        "type": "way"
    },
    {
        "code": "[natural=tree]",
        "name": "Tree",
        "id": 38,
        "type": "node"
    },
]

export class OSMLandUseComponent extends BaseComponent {
    osmOutput: null
    outputCache: Map<string, BooleanTileGrid>
    projectZoom: number
    projectExtent: Extent
    maskMode: boolean
    maskLayer: string
    maskCQL: string

    constructor(projectProps: ProjectProperties) {
        super("OpenStreetMap Land Use")
        this.category = "Inputs"
        this.projectExtent = projectProps.extent
        this.projectZoom = projectProps.zoom
        this.maskMode = projectProps.mask
        this.maskLayer = projectProps.maskLayer
        this.maskCQL = projectProps.maskCQL

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

        const editorNode = this.editor?.nodes.find(n => n.id === node.id)
        if (editorNode === undefined) { return }


        let index = node.data.osmLandCategoryId as number
        if (index === undefined) { index = 0 }

        const code = LandUseCategories[index].code
        const name = LandUseCategories[index].name
        const type = LandUseCategories[index].type

        if (this.outputCache.has(code)) {
            const result = editorNode.meta.output = outputs['out'] = this.outputCache.get(code)
        } else {

            const mask = await maskFromExtentAndShape(this.projectExtent, this.projectZoom, this.maskLayer, this.maskCQL, this.maskMode)

            const json = await retrieveLandUseData(this.projectExtent, code, type)

            const features = json.elements as Array<OverpassFeature>

            const tileGrid = createXYZ()

            const outputTileRange = tileGrid.getTileRangeForExtentAndZ(this.projectExtent, this.projectZoom)

            const result = editorNode.meta.output = outputs['out'] = new BooleanTileGrid(
                this.projectZoom,
                outputTileRange.minX,
                outputTileRange.minY,
                outputTileRange.getWidth(),
                outputTileRange.getHeight()
            )
            result.name = name


            features.forEach((feature) => {

                if (feature.type === "node") {

                    const [x, y] = (proj4 as any).default('EPSG:4326', 'EPSG:3857', [feature.lon, feature.lat])

                    const p = new Point([x, y])

                    const featureTileRange = tileGrid.getTileRangeForExtentAndZ(
                        p.getExtent(),
                        this.projectZoom
                    )

                    result.set(featureTileRange.maxX, featureTileRange.minY, true)


                } else {

                    const geom = feature.geometry

                    const epsg3857_geometry = geom.map((e) => (proj4 as any).default('EPSG:4326', 'EPSG:3857', [e.lon, e.lat]))

                    const polygon = new Polygon([epsg3857_geometry])

                    const featureTileRange = tileGrid.getTileRangeForExtentAndZ(
                        polygon.getExtent(),
                        this.projectZoom
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
                            const tileExtent = tileGrid.getTileCoordExtent([this.projectZoom, x, y])
                            if (polygon.intersectsExtent(tileExtent)) {
                                result.set(x, y, mask.get(x, y) === true)
                            }
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