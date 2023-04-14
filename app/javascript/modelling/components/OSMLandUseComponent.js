import { LandUseCategories, retrieveLandUseData } from '../../projects/modelling/components/osm_land_use_component'
import { createXYZ } from "ol/tilegrid"
import { Polygon } from 'ol/geom'
import { Component, Output } from "rete"
import { setSocket } from "../sockets"
import { SelectControl } from '../controls/SelectControl'
import { PreviewControl } from '../controls/PreviewControl'
import { BooleanTileGrid } from "../../projects/modelling/tile_grid"
import * as proj4 from "proj4"



export class OSMLandUseComponent extends Component {
    constructor() {
        super("Input land use")
        this.category = "Inputs & Outputs"
    }


    builder(node) {
        node.addOutput(new Output('out', 'Output', setSocket))


        node.addControl(
            new SelectControl(
                'osmLandCategoryId',
                () => LandUseCategories,
                () => [],
                'Land Use Category'
            )
        )
        node.addControl(new PreviewControl(() =>
            node.meta.output || new BooleanTileGrid(0, 0, 0, 1, 1)
        ))
    }

    async worker(node, inputs, outputs) {


        const zoom = 20
        const extent = [-20839.008676500813, 6579722.087031, 12889.487811, 6640614.986501137]

        const editorNode = this.editor?.nodes.find(n => n.id === node.id)
        if (editorNode === undefined) { return }

        const index = node.data.osmLandCategoryId
        const code = LandUseCategories[index].code


        const json = await retrieveLandUseData(extent, code)

        const features = json.elements

        const tileGrid = createXYZ()

        const outputTileRange = tileGrid.getTileRangeForExtentAndZ(extent, zoom)

        const result = editorNode.meta.output = outputs['out'] = new BooleanTileGrid(
            zoom,
            outputTileRange.minX,
            outputTileRange.minY,
            outputTileRange.getWidth(),
            outputTileRange.getHeight()
        )


        features.forEach((feature) => {

            const geom = feature.geometry

            const epsg3857_geometry = geom.map((e) => proj4.default('EPSG:4326', 'EPSG:3857', [e.lon, e.lat]))

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


        result.name = node.data.name || 'Output'

        editorNode.controls.get('preview').update()

    }

}
