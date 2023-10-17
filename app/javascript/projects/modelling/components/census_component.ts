import { Node, Output } from "rete"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { BaseComponent } from "./base_component"
import { numericDataSocket } from "../socket_types"
import { currentBbox , currentExtent} from "../bounding_box"
import GeoJSON from "ol/format/GeoJSON"
import { createXYZ } from "ol/tilegrid"
import { NumericTileGrid } from "../tile_grid"
import { random } from "lodash"

async function fetchCensusShapefilesFromExtent(bbox: string){

    const response =  await fetch(
        "https://landscapes.wearepal.ai/geoserver/wfs?" +
        new URLSearchParams(
          {
            outputFormat: 'application/json',
            request: 'GetFeature',
            typeName: ' shapefiles:OA_2021_EW_BGC_V2',
            srsName: 'EPSG:3857',
            bbox
          }
        )
      )
      if (!response.ok) throw new Error()

      return await response.json()
}

export class CensusComponent extends BaseComponent {
    DataCache: Map<any, any>

    constructor() {
        super("UK Census")
        this.category = "Inputs"
    }

    async builder(node: Node) {
        // controls, inputs, outputs
        node.addOutput(new Output('out', 'Census Data', numericDataSocket))
    }


    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {


        const editorNode = this.editor?.nodes.find(n => n.id === node.id)
        if (editorNode === undefined) { return }

        const zoom = 20

        const shapeFiles = await fetchCensusShapefilesFromExtent(currentBbox)
        const features = new GeoJSON().readFeatures(shapeFiles)

        const tileGrid = createXYZ()
        const outputTileRange = tileGrid.getTileRangeForExtentAndZ(currentExtent, zoom)

        const result = editorNode.meta.output = outputs['out'] =new NumericTileGrid(
            zoom,
            outputTileRange.minX,
            outputTileRange.minY,
            outputTileRange.getWidth(),
            outputTileRange.getHeight()
        )

        for (let feature of features) {

            const v = Math.random() * 1000
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
                  result.set(x, y, v)
                }
              }
            }
        }


        editorNode.update()





        // for each shape file, retrieve the relevant census data

        // create tile grid

        // return
    }

}