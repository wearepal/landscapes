import { Node, Output } from "rete"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { BaseComponent } from "./base_component"
import { numericDataSocket } from "../socket_types"
import GeoJSON from "ol/format/GeoJSON"
import { createXYZ } from "ol/tilegrid"
import { NumericTileGrid } from "../tile_grid"
import { SelectControl } from "../controls/select"
import { Feature } from "ol"
import { Geometry } from "ol/geom"
import { Extent } from "ol/extent"
import { bboxFromExtent, maskFromExtentAndShape } from "../bounding_box"

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
    {
        "code": "EmploymentHistory",
        "name": "Employment history",
        "id": 6,
        "options": [
            {
                "code": "EmploymentHistory_-8",
                "name": "Does not apply"
            },
            {
                "code": "EmploymentHistory_1",
                "name": "Not in employment: Worked in the last 12 months"
            },
            {
                "code": "EmploymentHistory_2",
                "name": "Not in employment: Not worked in the last 12 months"
            },
            {
                "code": "EmploymentHistory_3",
                "name": "Not in employment: Never worked"
            },

        ]
    },
    {
        "code": "HoursWorked",
        "name": "Hours worked",
        "id": 7,
        "options": [
            {
                "code": "HoursWorked_-8",
                "name": "Does not apply"
            },
            {
                "code": "HoursWorked_1",
                "name": "Part-time: 15 hours or less worked"
            },
            {
                "code": "HoursWorked_2",
                "name": "Part-time: 16 to 30 hours worked"
            },
            {
                "code": "HoursWorked_3",
                "name": "Full-time: 31 to 48 hours worked"
            },
            {
                "code": "HoursWorked_4",
                "name": "Full-time: 49 or more hours worked"
            },

        ]
    },
    {
        "code": "MethodUsedToTravelToWorkplace",
        "name": "Method used to travel to workplace",
        "id": 8,
        "options": [
            {
                "code": "MethodUsedToTravelToWorkplace_1",
                "name": "Work mainly at or from home"
            },
            {
                "code": "MethodUsedToTravelToWorkplace_2",
                "name": "Underground, metro, light rail, tram"
            },
            {
                "code": "MethodUsedToTravelToWorkplace_3",
                "name": "Train"
            },
            {
                "code": "MethodUsedToTravelToWorkplace_4",
                "name": "Bus, minibus or coach"
            },
            {
                "code": "MethodUsedToTravelToWorkplace_5",
                "name": "Taxi"
            },
            {
                "code": "MethodUsedToTravelToWorkplace_6",
                "name": "Motorcycle, scooter or moped"
            },
            {
                "code": "MethodUsedToTravelToWorkplace_7",
                "name": "Driving a car or van"
            },
            {
                "code": "MethodUsedToTravelToWorkplace_8",
                "name": "Passenger in a car or van"
            },
            {
                "code": "MethodUsedToTravelToWorkplace_9",
                "name": "Bicycle"
            },
            {
                "code": "MethodUsedToTravelToWorkplace_10",
                "name": "On foot"
            },
            {
                "code": "MethodUsedToTravelToWorkplace_11",
                "name": "Other method of travel to work"
            },
            {
                "code": "MethodUsedToTravelToWorkplace_12",
                "name": "Not in employment or aged 15 years and under"
            },

        ]
    },
    {
        "code": "NBedrooms",
        "name": "Number of Bedrooms",
        "id": 9,
        "options": [
            {
                "code": "NBedrooms_-9",
                "name": "Does not apply"
            },
            {
                "code": "NBedrooms_1",
                "name": "1 bedroom"
            },
            {
                "code": "NBedrooms_2",
                "name": "2 bedrooms"
            },
            {
                "code": "NBedrooms_3",
                "name": "3 bedrooms"
            },
            {
                "code": "NBedrooms_4",
                "name": "4 or more bedrooms"
            },

        ]
    },
    {
        "code": "NS-SeC",
        "name": "National Statistics Socio-economic Classification (NS-SeC)",
        "id": 10,
        "options": [
            {
                "code": "NS-SeC_-8",
                "name": "Does not apply"
            },
            {
                "code": "NS-SeC_1",
                "name": "L1, L2 and L3: Higher managerial, administrative and professional occupations"
            },
            {
                "code": "NS-SeC_2",
                "name": "L4, L5 and L6: Lower managerial, administrative and professional occupations"
            },

            {
                "code": "NS-SeC_3",
                "name": "L7: Intermediate occupations"
            },

            {
                "code": "NS-SeC_4",
                "name": "L8 and L9: Small employers and own account workers"
            },

            {
                "code": "NS-SeC_5",
                "name": "L10 and L11: Lower supervisory and technical occupations"
            },

            {
                "code": "NS-SeC_6",
                "name": "L12: Semi-routine occupations"
            },

            {
                "code": "NS-SeC_7",
                "name": "L13: Routine occupations"
            },

            {
                "code": "NS-SeC_8",
                "name": "L14.1 and L14.2: Never worked and long-term unemployed"
            },

            {
                "code": "NS-SeC_9",
                "name": "L15: Full-time students"
            }

        ]
    },
    {
        "code": "OccupancyRating",
        "name": "Occupancy rating for bedrooms",
        "id": 11,
        "options": [
            {
                "code": "OccupancyRating_-8",
                "name": "Does not apply"
            },
            {
                "code": "OccupancyRating_1",
                "name": "Occupancy rating of bedrooms: +2 or more"
            },
            {
                "code": "OccupancyRating_2",
                "name": "Occupancy rating of bedrooms: +1"
            },
            {
                "code": "OccupancyRating_3",
                "name": "Occupancy rating of bedrooms: 0"
            },
            {
                "code": "OccupancyRating_4",
                "name": "Occupancy rating of bedrooms: -1"
            },
            {
                "code": "OccupancyRating_5",
                "name": "Occupancy rating of bedrooms: -2 or less"
            }

        ]
    },
    {
        "code": "OccupationCurrent",
        "name": "Occupation (current)",
        "id": 12,
        "options": [
            {
                "code": "OccupationCurrent_-8",
                "name": "Does not apply"
            },
            {
                "code": "OccupationCurrent_1",
                "name": "Managers, directors and senior officials"
            },
            {
                "code": "OccupationCurrent_2",
                "name": "Professional occupations"
            },
            {
                "code": "OccupationCurrent_3",
                "name": "Associate professional and technical occupations"
            },
            {
                "code": "OccupationCurrent_4",
                "name": "Administrative and secretarial occupations"
            },
            {
                "code": "OccupationCurrent_5",
                "name": "Skilled trades occupations"
            },
            {
                "code": "OccupationCurrent_6",
                "name": "Caring, leisure and other service occupations"
            },
            {
                "code": "OccupationCurrent_7",
                "name": "Sales and customer service occupations"
            },
            {
                "code": "OccupationCurrent_8",
                "name": "Process, plant and machine operatives"
            },
            {
                "code": "OccupationCurrent_9",
                "name": "Elementary occupations"
            }

        ]
    },
    {
        "code": "SchoolChildren",
        "name": "Schoolchild or full-time student indicator",
        "id": 13,
        "options": [
            {
                "code": "SchoolChildren_-8",
                "name": "Does not apply"
            },
            {
                "code": "SchoolChildren_1",
                "name": "Student"
            },
            {
                "code": "SchoolChildren_2",
                "name": "Not a student"
            }

        ]
    },
    {
        "code": "SecondAddress",
        "name": "Second address indicator",
        "id": 14,
        "options": [
            {
                "code": "SecondAddress_1",
                "name": "No second address"
            },
            {
                "code": "SecondAddress_2",
                "name": "Second address is in the UK"
            },
            {
                "code": "SecondAddress_3",
                "name": "Second address is outside the UK"
            }

        ]
    },
    {
        "code": "SecondAddressType",
        "name": "Second address type",
        "id": 15,
        "options": [
            {
                "code": "SecondAddressType_-8",
                "name": "Does not apply"
            },
            {
                "code": "SecondAddressType_1",
                "name": "Armed forces base address"
            },
            {
                "code": "SecondAddressType_2",
                "name": "Another address when working away from home"
            },
            {
                "code": "SecondAddressType_3",
                "name": "Holiday home"
            },
            {
                "code": "SecondAddressType_4",
                "name": "Student's term-time address"
            },
            {
                "code": "SecondAddressType_5",
                "name": "Student's home address"
            },
            {
                "code": "SecondAddressType_6",
                "name": "Another parent or guardian's address"
            },
            {
                "code": "SecondAddressType_7",
                "name": "Partner's address"
            },
            {
                "code": "SecondAddressType_8",
                "name": "Other"
            },
            {
                "code": "SecondAddressType_9",
                "name": "Second address type not specified"
            }

        ]
    },
    {
        "code": "TenureOfHousehold",
        "name": "Tenure of household",
        "id": 16,
        "options": [
            {
                "code": "TenureOfHousehold_-8",
                "name": "Does not apply"
            },
            {
                "code": "TenureOfHousehold_0",
                "name": "Owned: Owns outright"
            },
            {
                "code": "TenureOfHousehold_1",
                "name": "Owned: Owns with a mortgage or loan"
            },
            {
                "code": "TenureOfHousehold_2",
                "name": "Shared ownership: Shared ownership"
            },
            {
                "code": "TenureOfHousehold_3",
                "name": "Social rented: Rents from council or Local Authority"
            },
            {
                "code": "TenureOfHousehold_4",
                "name": "Social rented: Other social rented"
            },
            {
                "code": "TenureOfHousehold_5",
                "name": "Private rented: Private landlord or letting agency"
            },
            {
                "code": "TenureOfHousehold_6",
                "name": "Private rented: Other private rented"
            },
            {
                "code": "TenureOfHousehold_7",
                "name": "Lives rent free"
            }

        ]
    }

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
    projectZoom: number
    projectExtent: Extent
    maskMode: boolean
    maskLayer: string
    maskCQL: string

    constructor(projectExtent: Extent, projectZoom: number, maskMode: boolean, maskLayer: string, maskCQL: string) {
        super("UK Census 2021")
        this.category = "Inputs"
        this.cachedData = undefined
        this.cachedOutput = new Map()
        this.projectExtent = projectExtent
        this.projectZoom = projectZoom
        this.maskMode = maskMode
        this.maskLayer = maskLayer
        this.maskCQL = maskCQL
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

        const features = this.cachedData ? this.cachedData : new GeoJSON().readFeatures(await fetchCensusShapefilesFromExtent(bboxFromExtent(this.projectExtent)))
        
        const mask = await maskFromExtentAndShape(this.projectExtent, this.projectZoom, this.maskLayer, this.maskCQL, this.maskMode)

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
                const outputTileRange = tileGrid.getTileRangeForExtentAndZ(this.projectExtent, this.projectZoom)

                const result = editorNode.meta.output = outputs[option.name] = new NumericTileGrid(
                    this.projectZoom,
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
                            const center = tileGrid.getTileCoordCenter([this.projectZoom, x, y])
                            if (geom.intersectsCoordinate(center) && mask.get(x, y) === true){
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