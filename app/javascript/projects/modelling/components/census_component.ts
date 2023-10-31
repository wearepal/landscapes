import { Node, Output } from "rete"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { BaseComponent } from "./base_component"
import { numericDataSocket } from "../socket_types"
import { currentBbox, currentExtent, zoomLevel } from "../bounding_box"
import GeoJSON from "ol/format/GeoJSON"
import { createXYZ } from "ol/tilegrid"
import { NumericTileGrid } from "../tile_grid"
import { SelectControl } from "../controls/select"
import { Feature } from "ol"
import { Geometry } from "ol/geom"

interface CensusDataset {
    code: string
    name: string
    id: number
    options: CensusOption[]
}

interface CensusOption {
    code: string
    name: string
}

const censusDatasets: CensusDataset[] = [
    {
        "code": "HQual",
        "name": "Highest qualification",
        "id": 0,
        "options": [
            {
                "code": "HIGHEST_QUAL_0",
                "name": "No Qualifications"
            },
            {
                "code": "HIGHEST_QUAL_1",
                "name": "Level 1 and entry level"
            },
            {
                "code": "HIGHEST_QUAL_2",
                "name": "Level 2"
            },
            {
                "code": "HIGHEST_QUAL_3",
                "name": "Apprenticeship"
            },
            {
                "code": "HIGHEST_QUAL_4",
                "name": "Level 3 (A Level)"
            },
            {
                "code": "HIGHEST_QUAL_5",
                "name": "Level 4 (BSc/BA or higher)"
            },
            {
                "code": "HIGHEST_QUAL_6",
                "name": "Other"
            },
            {
                "code": "HIGHEST_QUAL_-8",
                "name": "Does not apply"
            }
        ]
    },
    {
        "code": "Accommodationtype",
        "name": "Accomodation type",
        "id": 1,
        "options": [
            {
                "code": "Accommodationtype_1",
                "name": "Detached"
            },
            {
                "code": "Accommodationtype_2",
                "name": "Semi-detached"
            },
            {
                "code": "Accommodationtype_3",
                "name": "Terraced"
            },
            {
                "code": "Accommodationtype_4",
                "name": "Purpose built flats or tenement"
            },
            {
                "code": "Accommodationtype_5",
                "name": "Part of a converted or shared house, including bedsits"
            },
            {
                "code": "Accommodationtype_6",
                "name": "Part of another converted building, for example, former school, church or warehouse"
            },
            {
                "code": "Accommodationtype_7",
                "name": "In a commercial building, for example, in an office building, hotel or over a shop"
            },
            {
                "code": "Accommodationtype_8",
                "name": "A caravan or other mobile or temporary structure"
            }
        ]
    },
    {
        "code": "CarVanHousehold",
        "name": "Cars or vans available per household",
        "id": 2,
        "options": [
            {
                "code": "CarVanHousehold_-8",
                "name": "Does not apply"
            },
            {
                "code": "CarVanHousehold_0",
                "name": "No cars or vans"
            },
            {
                "code": "CarVanHousehold_1",
                "name": "1 car or van"
            },
            {
                "code": "CarVanHousehold_2",
                "name": "2 cars or vans"
            },
            {
                "code": "CarVanHousehold_3",
                "name": "3 or more cars or vans"
            }
        ]
    },
    {
        "code": "CentralHeatingType",
        "name": "Type of central heating in household",
        "id": 3,
        "options": [
            {
                "code": "centralHeatingType_-9",
                "name": "Does not apply"
            },
            {
                "code": "centralHeatingType_1",
                "name": "No central heating"
            },
            {
                "code": "centralHeatingType_2",
                "name": "Mains gas only"
            },
            {
                "code": "centralHeatingType_3",
                "name": "Tank or bottled gas only"
            },
            {
                "code": "centralHeatingType_4",
                "name": "Electric only"
            },
            {
                "code": "centralHeatingType_5",
                "name": "Oil only"
            },
            {
                "code": "centralHeatingType_6",
                "name": "Wood only"
            },
            {
                "code": "centralHeatingType_7",
                "name": "Solid fuel only"
            },
            {
                "code": "centralHeatingType_8",
                "name": "Renewable energy only"
            },
            {
                "code": "centralHeatingType_9",
                "name": "District or communal heat networks only"
            },
            {
                "code": "centralHeatingType_10",
                "name": "Other central heating only"
            },
            {
                "code": "centralHeatingType_11",
                "name": "Two or more types of central heating (not including renewable energy)"
            },
            {
                "code": "centralHeatingType_12",
                "name": "Two or more types of central heating (including renewable energy)"
            },
        ]
    },
    {
        "code": "DistWork",
        "name": "Distance travelled to work",
        "id": 4,
        "options": [
            {
                "code": "DistWork_-8",
                "name": "Does not apply"
            },
            {
                "code": "DistWork_1",
                "name": "Less than 2km"
            },
            {
                "code": "DistWork_2",
                "name": "2km to less than 5km"
            },
            {
                "code": "DistWork_3",
                "name": "5km to less than 10km"
            },
            {
                "code": "DistWork_4",
                "name": "10km to less than 20km"
            },
            {
                "code": "DistWork_5",
                "name": "20km to less than 30km"
            },
            {
                "code": "DistWork_6",
                "name": "30km to less than 40km"
            },
            {
                "code": "DistWork_7",
                "name": "40km to less than 60km"
            },
            {
                "code": "DistWork_8",
                "name": "60km and over"
            },
            {
                "code": "DistWork_9",
                "name": "Works mainly from home"
            },
            {
                "code": "DistWork_10",
                "name": "Works mainly at an offshore installation, in no fixed place, or outside the UK"
            }
        ]
    },
    {
        "code": "EconomicActStatus",
        "name": "Economic activity status",
        "id": 5,
        "options": [
            {
                "code": "EconomicActStatus_-8",
                "name": "Does not apply"
            },
            {
                "code": "EconomicActStatus_1",
                "name": "Excluding FT Student, In employment: Employee: Part-time"
            },
            {
                "code": "EconomicActStatus_2",
                "name": "Excluding FT Student, In employment: Employee: Full-time"
            },
            {
                "code": "EconomicActStatus_3",
                "name": "Excluding FT Student, In employment: Self-employed with employees: Part-time"
            },
            {
                "code": "EconomicActStatus_4",
                "name": "Excluding FT Student, In employment: Self-employed with employees: Full-time"
            },
            {
                "code": "EconomicActStatus_5",
                "name": "Excluding FT Student, In employment: Self-employed without employees: Part-time"
            },
            {
                "code": "EconomicActStatus_6",
                "name": "Excluding FT Student, In employment: Self-employed without employees: Full-time"
            },
            {
                "code": "EconomicActStatus_7",
                "name": "Excluding FT Student, Unemployed: Seeking work or waiting to start a job already obtained: Available to start working within 2 weeks"
            },
            {
                "code": "EconomicActStatus_8",
                "name": "FT Student, In employment: Employee: Part-time"
            },
            {
                "code": "EconomicActStatus_9",
                "name": "FT Student, In employment: Employee: Full-time"
            },
            {
                "code": "EconomicActStatus_10",
                "name": "FT Student, In employment: Self-employed with employees: Part-time"
            },
            {
                "code": "EconomicActStatus_11",
                "name": "FT Student, In employment: Self-employed with employees: Full-time"
            },
            {
                "code": "EconomicActStatus_12",
                "name": "FT Student, In employment: Self-employed without employees: Part-time"
            },
            {
                "code": "EconomicActStatus_13",
                "name": "FT Student, In employment: Self-employed without employees: Full-time"
            },
            {
                "code": "EconomicActStatus_14",
                "name": "FT Student, Unemployed: Seeking work or waiting to start a job already obtained: Available to start working within 2 weeks"
            },
            {
                "code": "EconomicActStatus_15",
                "name": "Retired"
            },
            {
                "code": "EconomicActStatus_16",
                "name": "Student"
            },
            {
                "code": "EconomicActStatus_17",
                "name": "Looking after home or family"
            },
            {
                "code": "EconomicActStatus_18",
                "name": "Long-term sick or disabled"
            },
            {
                "code": "EconomicActStatus_19",
                "name": "Other"
            },
        ]
    },
]


async function fetchCensusShapefilesFromExtent(bbox: string) {

    const response = await fetch(
        "https://landscapes.wearepal.ai/geoserver/wfs?" +
        new URLSearchParams(
            {
                outputFormat: 'application/json',
                request: 'GetFeature',
                typeName: 'census:CensusDatav2',
                srsName: 'EPSG:3857',
                bbox
            }
        )
    )
    if (!response.ok) throw new Error()

    return await response.json()
}

export class CensusComponent extends BaseComponent {
    cachedData: Feature<Geometry>[] | undefined
    cachedOutput: Map<string, NumericTileGrid>

    constructor() {
        super("UK Census 2021")
        this.category = "Inputs"
        this.cachedData = undefined
        this.cachedOutput = new Map()
    }

    async builder(node: Node) {

        node.meta.toolTip = "Experimental Feature - Census data for highest education per Output Area. Returns percentage value."

        node.addControl(
            new SelectControl(
                this.editor,
                'censusDatasetId',
                () => censusDatasets,
                () => this.changeOutputs(node),
                'Dataset'
            )
        )

        this.updateOutputs(node)
    }

    changeOutputs(node: Node) {

        node.getConnections().forEach(c => {
            if (c.output.node !== node) {
                this.editor?.removeConnection(c)
            }
        })
        node.getConnections().forEach(c => this.editor?.removeConnection(c))

        Array.from(node.outputs.values()).forEach(output => node.removeOutput(output))

        this.updateOutputs(node)

    }

    updateOutputs(node: Node) {

        const datasetIndex = node.data.censusDatasetId ? node.data.censusDatasetId as number : 0

        const options = censusDatasets[datasetIndex].options

        for (let i = 0; i < options.length; i++) {
            node.addOutput(new Output(options[i].name, options[i].name, numericDataSocket))
        }

        node.update()

    }


    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {

        const editorNode = this.editor?.nodes.find(n => n.id === node.id)
        if (editorNode === undefined) { return }

        const features = this.cachedData ? this.cachedData : new GeoJSON().readFeatures(await fetchCensusShapefilesFromExtent(currentBbox))

        const datasetIndex = node.data.censusDatasetId ? node.data.censusDatasetId as number : 0
        const options = censusDatasets[datasetIndex].options

        options.filter(
            option => node.outputs[option.name].connections.length > 0
        ).forEach(option => {

            const code = censusDatasets[datasetIndex].code + "_" + option.code

            if (this.cachedOutput.has(code)) {
                outputs[option.name] = this.cachedOutput.get(code)
            } else {

                const tileGrid = createXYZ()
                const outputTileRange = tileGrid.getTileRangeForExtentAndZ(currentExtent, zoomLevel)

                const result = editorNode.meta.output = outputs[option.name] = new NumericTileGrid(
                    zoomLevel,
                    outputTileRange.minX,
                    outputTileRange.minY,
                    outputTileRange.getWidth(),
                    outputTileRange.getHeight()
                )

                for (let feature of features) {
                    const n = options.reduce((a, b) => a + +feature.get(censusDatasets[datasetIndex].code + "_" + b.code), 0)

                    const geom = feature.getGeometry()
                    if (geom === undefined) { continue }

                    const featureTileRange = tileGrid.getTileRangeForExtentAndZ(
                        geom.getExtent(),
                        zoomLevel
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
                            const center = tileGrid.getTileCoordCenter([zoomLevel, x, y])
                            if (geom.intersectsCoordinate(center)) {
                                result.set(x, y, feature.get(code) / n * 100)
                            }
                        }
                    }

                }

                this.cachedOutput.set(code, result)

            }

        })

        editorNode.update()

    }

}