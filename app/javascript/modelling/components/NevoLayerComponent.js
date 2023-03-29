import { Component, Output } from "rete"
import { SelectControl } from "../controls/SelectControl"
import GeoJSON from "ol/format/GeoJSON"
import { createXYZ } from "ol/tilegrid"
import { mapSocket } from "../sockets"
import { NumericTileGrid } from "../../projects/modelling/tile_grid"
import { PreviewControl } from "../controls/PreviewControl"
import { getArea } from "ol/sphere"
import { fromExtent } from "ol/geom/Polygon"
import { LayerProperties } from '../../projects/modelling/components/nevo_layer_component'


export class NevoLayerComponent extends Component {

    constructor() {
        super("Input NEVO layer")
        this.category = "Inputs & Outputs"
        this.geoServer = "https://geo.leep.exeter.ac.uk/geoserver/nevo/wfs?"
        this.nevoPropertyNames = LayerProperties
    }

    builder(node) {


        node.addOutput(new Output('out', 'Output', mapSocket))


        node.addControl(
            new SelectControl(
                'nevoLayerId',
                () => this.nevoPropertyNames,
                () => [],
                'Layer'
            )
        )

        node.addControl(new PreviewControl(() =>
            node.meta.output || new NumericTileGrid(0, 0, 0, 1, 1)
        ))


    }


    async retrieveLandCoverData(bbox) {

        const response = await fetch(
            this.geoServer +
            new URLSearchParams(
                {
                    outputFormat: 'application/json',
                    request: 'GetFeature',
                    typeName: 'nevo:explore_2km_rounded',
                    srsName: 'EPSG:3857',
                    bbox
                }
            )
        )

        if (!response.ok) throw new Error()

        return await response.json()
    }


    async worker(node, inputs, outputs) {


        const editorNode = this.editor.nodes.find(n => n.id === node.id)

        const extent = [-20839.008676500813, 6579722.087031, 12889.487811, 6640614.986501137]
        const bbox = `${extent.join(",")},EPSG:3857`


        const json = await this.retrieveLandCoverData(bbox)
        const features = new GeoJSON().readFeatures(json)

        const z = 20

        const tileGrid = createXYZ()
        const outputTileRange = tileGrid.getTileRangeForExtentAndZ(extent, z)

        const result = editorNode.meta.output = outputs['out'] = new NumericTileGrid(
            z,
            outputTileRange.minX,
            outputTileRange.minY,
            outputTileRange.getWidth(),
            outputTileRange.getHeight()
        )

        const code = this.nevoPropertyNames[node.data.nevoLayerId].code


        for (let feature of features) {

            const val = feature.values_[code]

            const geom = feature.getGeometry()

            const featureTileRange = tileGrid.getTileRangeForExtentAndZ(
                geom.getExtent(),
                z
            )

            const featureArea = getArea(geom)

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
                    const tileExtent = tileGrid.getTileCoordExtent([z, x, y])
                    if (geom.intersectsExtent(tileExtent)) {

                        const tileArea = getArea(fromExtent(tileExtent))

                        const factor = tileArea / featureArea

                        result.set(x, y, val * factor)
                    }
                }
            }
        }


        editorNode.controls.get('preview').update()


    }

}