import { Node, Output } from "rete"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { BaseComponent } from "./base_component"
import { numericDataSocket } from "../socket_types"
import { currentBbox, currentExtent, zoomLevel } from "../bounding_box"
import GeoJSON from "ol/format/GeoJSON"
import { createXYZ } from "ol/tilegrid"
import { NumericTileGrid } from "../tile_grid"
import { SelectControl } from "../controls/select"

const censusOptions = [
    {
        "code": "output_modified_HIGHEST_QUAL_0",
        "name": "No Qualifications",
        "id": 0
    },
    {
        "code": "output_modified_HIGHEST_QUAL_1",
        "name": "Level 1 and entry level",
        "id": 1
    },
    {
        "code": "output_modified_HIGHEST_QUAL_2",
        "name": "Level 2",
        "id": 2
    },
    {
        "code": "output_modified_HIGHEST_QUAL_3",
        "name": "Apprenticeship",
        "id": 3
    },
    {
        "code": "output_modified_HIGHEST_QUAL_4",
        "name": "Level 3 (A Level)",
        "id": 4
    },
    {
        "code": "output_modified_HIGHEST_QUAL_5",
        "name": "Level 4 (BSc/BA or higher)",
        "id": 5
    },
    {
        "code": "output_modified_HIGHEST_QUAL_6",
        "name": "Other",
        "id": 6
    },
    {
        "code": "output_modified_HIGHEST_QUAL_-8",
        "name": "Does not apply",
        "id": 7
    }
]

async function fetchCensusShapefilesFromExtent(bbox: string) {

    const response = await fetch(
        "https://landscapes.wearepal.ai/geoserver/wfs?" +
        new URLSearchParams(
            {
                outputFormat: 'application/json',
                request: 'GetFeature',
                typeName: 'census:oa_2021_ew_bgc_v3_1294693978171420992__oa_2021_ew_bgc_v2',
                srsName: 'EPSG:3857',
                bbox
            }
        )
    )
    if (!response.ok) throw new Error()

    return await response.json()
}

export class CensusComponent extends BaseComponent {
    cachedData: NumericTileGrid | undefined

    constructor() {
        super("UK Census - Highest Education")
        this.category = "Inputs"
        this.cachedData = undefined
    }

    async builder(node: Node) {
        node.addOutput(new Output('out', 'Census Data', numericDataSocket))

        node.meta.toolTip = "Experimental Feature - Census data for highest education per Output Area. Returns percentage value."

        node.addControl(
            new SelectControl(
                this.editor,
                'censusOptionId',
                () => censusOptions,
                () => [],
                'Education Level'
            )
        )
    }


    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {


        const editorNode = this.editor?.nodes.find(n => n.id === node.id)
        if (editorNode === undefined) { return }

        if (this.cachedData) {
            editorNode.meta.output = outputs['out'] = this.cachedData
        } else {
            const zoom = zoomLevel

            const shapeFiles = await fetchCensusShapefilesFromExtent(currentBbox)
            const features = new GeoJSON().readFeatures(shapeFiles)

            const tileGrid = createXYZ()
            const outputTileRange = tileGrid.getTileRangeForExtentAndZ(currentExtent, zoom)

            const result = editorNode.meta.output = outputs['out'] = new NumericTileGrid(
                zoom,
                outputTileRange.minX,
                outputTileRange.minY,
                outputTileRange.getWidth(),
                outputTileRange.getHeight()
            )

            let index = node.data.censusOptionId as number
            if (index === undefined) { index = 0 }

            for (let feature of features) {

                let n =
                    +feature.get("output_modified_HIGHEST_QUAL_0") +
                    +feature.get("output_modified_HIGHEST_QUAL_1") +
                    +feature.get("output_modified_HIGHEST_QUAL_2") +
                    +feature.get("output_modified_HIGHEST_QUAL_3") +
                    +feature.get("output_modified_HIGHEST_QUAL_4") +
                    +feature.get("output_modified_HIGHEST_QUAL_5") +
                    +feature.get("output_modified_HIGHEST_QUAL_6") +
                    +feature.get("output_modified_HIGHEST_QUAL_-8")

                const geom = feature.getGeometry()
                if (geom === undefined) { continue }

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
                            result.set(x, y, feature.get(censusOptions[index].code) / n * 100)
                        }
                    }
                }
            }

            this.cachedData = result

        }


        editorNode.update()

    }

}