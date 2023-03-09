import { Component, Output } from 'rete'
import { mapSocket } from '../sockets'
import { SelectControl } from '../controls/SelectControl'

export class DigitalModelComponent extends Component{

    constructor(){

        super("Digital model input")
        this.category = "Inputs & Outputs"
        this.modelsList = [
            { 
                id: 0, name: 'Digital Surface Model', source: 'LIDAR:116973-4_DSM_1SussexBiosphereAOI'
            }, 
            {
                id: 1, name: 'Digital Terrian Model', source: 'LIDAR:116973-5_DTM_1SussexBiosphereAOI'
            }
        ]
        this.geoServer = "http://localhost:8080/geoserver/wms?"

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

        node.addOutput(new Output('dm', 'Output', mapSocket))

    }

    calculateHeightWidth(bbox, zoom){

        //get height and width (n of tiles within bbox)

        return [50, 50]
    }

    async retrieveModelData(bbox){

        const [height, width] = this.calculateHeightWidth(bbox, 20)

        console.log(height,width)

        const response = await fetch(
            this.geoServer +
            new URLSearchParams(
                {
                    service: 'WMS',
                    version: '1.3.0',
                    request: 'GetMap',
                    layers: this.modelsList[0].source , //retrieve automically from modelsList
                    styles: '',
                    format: 'image/png',
                    transparent: 'true',
                    width,
                    height,
                    crs: 'EPSG:3857',
                    bbox
                }
            )
        )

        return response

        //convert results to a numerical tile grid to output.

    }

    async worker(node){

        const extent = [50.76364653543253, -0.18406888502598157, 51.10528489161894, 0.11633851511680972]
        const bbox = `${extent.join(",")},EPSG:3857`

        const x = await this.retrieveModelData(bbox)

        console.log(x)

        // display numerical tile grid as preview.

    }

}