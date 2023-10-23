import { Node, Output } from "rete"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { BaseComponent } from "./base_component"
import { booleanDataSocket } from "../socket_types"
import { currentBbox , currentExtent} from "../bounding_box"
import GeoJSON from "ol/format/GeoJSON"
import { createXYZ } from "ol/tilegrid"
import { BooleanTileGrid } from "../tile_grid"

async function fetchGreenspacesFromExtent(bbox: string){

    const response =  await fetch(
        "https://landscapes.wearepal.ai/geoserver/wfs?" +
        new URLSearchParams(
          {
            outputFormat: 'application/json',
            request: 'GetFeature',
            typeName: 'nateng:greenspace_site',
            srsName: 'EPSG:3857',
            bbox
          }
        )
      )
      if (!response.ok) throw new Error()

      return await response.json()
}

export class OSGreenSpacesComponent extends BaseComponent {
    cachedData: BooleanTileGrid | undefined

    constructor(){
        super('OS Green Spaces')
        this.category = 'Inputs'
        this.cachedData = undefined
    }

    async builder(node: Node) {
        node.addOutput(new Output('out', 'Green spaces', booleanDataSocket))
    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
        const zoom = 20

        const editorNode = this.editor?.nodes.find(n => n.id === node.id)
        if (editorNode === undefined) { return }

        if(this.cachedData){
            editorNode.meta.output = outputs['out'] = this.cachedData
        }else{

            const res = await fetchGreenspacesFromExtent(currentBbox)
            const features = new GeoJSON().readFeatures(res)

            const tileGrid = createXYZ()
            const outputTileRange = tileGrid.getTileRangeForExtentAndZ(currentExtent, zoom)

            const result = editorNode.meta.output = outputs['out'] =new BooleanTileGrid(
                zoom,
                outputTileRange.minX,
                outputTileRange.minY,
                outputTileRange.getWidth(),
                outputTileRange.getHeight()
            )

            result.name = "OS Green Spaces"

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

            this.cachedData = result
        }


        editorNode.update()



    }

}