import { Component, Output } from 'rete'
import { mapSocket } from '../sockets'
import { SelectControl } from '../controls/SelectControl'
import { PreviewControl } from '../controls/PreviewControl'
import { fromArrayBuffer } from 'geotiff'
import { getSize } from 'ol/extent'
import { NumericTileGrid } from '../TileGrid'
import { createXYZ } from "ol/tilegrid"

export class DigitalModelComponent extends Component{

    constructor(){

        super("Input digital model")
        this.category = "Inputs & Outputs"
        this.modelsList = [
            { 
                id: 0, name: 'Digital Surface Model', source: 'lidar:116807-4_DSM'
            }, 
            {
                id: 1, name: 'Digital Terrian Model', source: 'lidar:116807-5_DTM'
            }
        ]
        this.geoServer = "https://landscapes.wearepal.ai/geoserver/wms?"

    }

    builder(node){

      

        node.addControl(
            new SelectControl(
              'sourceId',
              () => this.modelsList,
              () => [],
              'Model'
            )
        )

        node.addControl(new PreviewControl(() => 
          node.meta.output || new NumericTileGrid(0, 0, 0, 1, 1)
        ))

        node.addOutput(new Output('dm', 'Output', mapSocket))

    }

    calculateHeightWidth(extent, zoom){

        let [width, height] = getSize(extent)

        return [Math.floor(width/50), Math.floor(height/50)]

    }

    async retrieveModelData(extent, source){

        const [width, height] = this.calculateHeightWidth(extent, 20)
        const bbox = `${extent.join(",")},EPSG:3857`

        const response = await fetch(
            this.geoServer +
            new URLSearchParams(
                {
                    service: 'WMS',
                    version: '1.3.0',
                    request: 'GetMap',
                    layers: source,
                    styles: '',
                    format: 'image/geotiff',
                    transparent: 'true',
                    width,
                    height,
                    crs: 'EPSG:3857',
                    bbox
                }
            )
        )

        const arrayBuffer = await response.arrayBuffer()
        const tiff = await fromArrayBuffer(arrayBuffer)


        return tiff

    }

    async worker(node, inputs, outputs){

        const editorNode = this.editor.nodes.find(n => n.id === node.id)

        const digitalModel = this.modelsList.find(a => a.id === node.data.sourceId)?.source

        if(digitalModel){

            const extent = [-20839.008676500813, 6579722.087031, 12889.487811, 6640614.986501137]
    
            const geotiff = await this.retrieveModelData(extent, digitalModel)

            const image = await geotiff.getImage()

            const tileGrid = createXYZ()
            const outputTileRange = tileGrid.getTileRangeForExtentAndZ(extent, 20)

            const rasters = await geotiff.readRasters()

            const out = editorNode.meta.output = outputs['dm'] = new NumericTileGrid(20, outputTileRange.minX, outputTileRange.minY, outputTileRange.getWidth(), outputTileRange.getHeight(), null)

            for (let i = 0; i < rasters[0].length; i++) {

                let y = (outputTileRange.minY + Math.floor(i / image.getWidth()))
                let x = (outputTileRange.minX + i % image.getWidth())


                out.set(x, y, rasters[0][i])
                
            }

            out.name = node.data.name || 'dm'

            editorNode.controls.get('preview').update()
        }

    }

}