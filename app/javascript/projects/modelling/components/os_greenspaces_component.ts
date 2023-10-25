import { Node, Output } from "rete"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { BaseComponent } from "./base_component"
import { booleanDataSocket } from "../socket_types"
import { currentBbox, currentExtent, zoomLevel } from "../bounding_box"
import GeoJSON from "ol/format/GeoJSON"
import { createXYZ } from "ol/tilegrid"
import { BooleanTileGrid } from "../tile_grid"

interface GS_Source {
    source: string
    name: string
}

const GS_Sources: GS_Source[] =
    [
        {
            source: "nateng:greenspace_site",
            name: "Green space"
        },
        {
            source: "nateng:Brighton_PrivateGardens",
            name: "Private gardens"
        }
    ]

async function fetchGreenspacesFromExtent(bbox: string, source: string) {

    const response = await fetch(
        "https://landscapes.wearepal.ai/geoserver/wfs?" +
        new URLSearchParams(
            {
                outputFormat: 'application/json',
                request: 'GetFeature',
                typeName: source,
                srsName: 'EPSG:3857',
                bbox
            }
        )
    )
    if (!response.ok) throw new Error()

    return await response.json()
}

export class OSGreenSpacesComponent extends BaseComponent {
    cachedData: Map<string, BooleanTileGrid | undefined>

    constructor() {
        super('OS Green Spaces')
        this.category = 'Inputs'
        this.cachedData = new Map()
    }

    async builder(node: Node) {
        for (let i = 0; i < GS_Sources.length; i++) {
            node.addOutput(new Output(GS_Sources[i].name, GS_Sources[i].name, booleanDataSocket))
        }
    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
        const zoom = 23

        const editorNode = this.editor?.nodes.find(n => n.id === node.id)
        if (editorNode === undefined) { return }

        for (let i = 0; i < GS_Sources.length; i++) {

            if (node.outputs[GS_Sources[i].name].connections.length === 0) continue

            if (this.cachedData.has(GS_Sources[i].name)) {
                outputs[GS_Sources[i].name] = this.cachedData.get(GS_Sources[i].name)

            } else {
                const res = await fetchGreenspacesFromExtent(currentBbox, GS_Sources[i].source)
                const features = new GeoJSON().readFeatures(res)

                const tileGrid = createXYZ()
                const outputTileRange = tileGrid.getTileRangeForExtentAndZ(currentExtent, zoom)

                const result = editorNode.meta.output = outputs[GS_Sources[i].name] = new BooleanTileGrid(
                    zoom,
                    outputTileRange.minX,
                    outputTileRange.minY,
                    outputTileRange.getWidth(),
                    outputTileRange.getHeight()
                )

                result.name = `OS ${GS_Sources[i].name}`

                for (let feature of features) {

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
                                result.set(x, y, true)
                            }
                        }
                    }
                }

                this.cachedData.set(GS_Sources[i].name, result)
            }
        }

        editorNode.update()



    }

}