
import { Component, Output } from "rete"
import { SelectControl } from "../controls/SelectControl"
import GeoJSON from "ol/format/GeoJSON"
import { createXYZ } from "ol/tilegrid"
import { mapSocket } from "../sockets"
import { NumericTileGrid } from "../TileGrid"
import { PreviewControl } from "../controls/PreviewControl"


export class NevoLayerComponent extends Component {

    constructor(){
        super("Input nevo layer")
        this.category = "Inputs & Outputs"
        this.geoServer = "https://geo.leep.exeter.ac.uk/geoserver/nevo/wfs?"

        this.nevoLayers = [
            {id: 0, code: "tot_area", name: "total hectare area of spatial unit"},
            {id: 1, code: "wood_ha", name: "woodland hectares"},
            {id: 2, code: "sngrass_ha", name: "semi-natural grassland hectares"},
            {id: 3, code: "urban_ha", name: "urban hectares"},
            {id: 4, code: "water_ha",name: "water hectares"},
            {id: 5, code: "farm_ha",name: "farmland hectares"},
            {id: 6, code: "ghg_broad_flow_",  
            name: "predicted annual greenhouse gas sequestration value from 100% broadleaf managed woodland in selected year", years: [
                {id: 0, code: "20", name: "2020s"},
                {id: 1, code: "30", name: "2030s"},
                {id: 2, code: "40", name: "2040s"},
                {id: 3, code: "50", name: "2050s"},
            ]},
            {id: 7, code: "ghg_conif_flow_", 
            name: "predicted annual greenhouse gas sequestration value from 100% coniferous managed woodland in selected year" , years: [
                {id: 0, code: "20", name: "2020s"},
                {id: 1, code: "30", name: "2030s"},
                {id: 2, code: "40", name: "2040s"},
                {id: 3, code: "50", name: "2050s"},
            ]},
            {id: 8, code: "ghg_mixed_flow_", 
            name: "predicted annual greenhouse gas sequestration value from 60% broadleaf 40% coniferous managed woodland in selected year" , years: [
                {id: 0, code: "20", name: "2020s"},
                {id: 1, code: "30", name: "2030s"},
                {id: 2, code: "40", name: "2040s"},
                {id: 3, code: "50", name: "2050s"},
            ]},
            {id: 9, code: "ghg_current_flow_", 
            name: "predicted annual greenhouse gas sequestration value from managed woodland from current broadleaf coniferous mix in selected year" , years: [
                {id: 0, code: "20", name: "2020s"},
                {id: 1, code: "30", name: "2030s"},
                {id: 2, code: "40", name: "2040s"},
                {id: 3, code: "50", name: "2050s"},
            ]},
            {id: 10, code: "fert_nitr_", 
            name: "predicted annual nitrate fertiliser use (kg) on farmland in selected year" , years: [
                {id: 0, code: "20", name: "2020s"},
                {id: 1, code: "30", name: "2030s"},
                {id: 2, code: "40", name: "2040s"},
                {id: 3, code: "50", name: "2050s"},
            ]}
        ]

    }

    builder(node){


        node.addOutput(new Output('out', 'Output', mapSocket))

        node.addControl(
            new SelectControl(
              'nevoLayerId',
              () => this.nevoLayers,
              () => this.updateNode(node),
              'Layer'
            )
        )


        node.addControl(new PreviewControl(() => 
            node.meta.output || new NumericTileGrid(0, 0, 0, 1, 1)
        ))


    }

    updateNode(node){

        const editorNode = this.editor.nodes.find(n => n.id === node.id)

        const selectedFeature = this.nevoLayers.find(a => a.id == editorNode.data.nevoLayerId)


        const nyear = node.controls.get('nevoYearId') 

        if (nyear) node.removeControl(nyear)

        if(selectedFeature.years){
            node.addControl(
                new SelectControl(
                'nevoYearId',
                () => selectedFeature.years,
                () => [],
                'Year'
                )
            )

            node.update()

        }



    }

    
    retrieveFeatureCode(node){

        const editorNode = this.editor.nodes.find(n => n.id === node.id)

        const selectedFeature = this.nevoLayers.find(a => a.id == editorNode.data.nevoLayerId)

        if (selectedFeature.years){
            return selectedFeature.code + selectedFeature.years.find(a => a.id == editorNode.data.nevoYearId).code
        }else{
            return selectedFeature.code
        }

    }



    async retrieveLandCoverData(bbox) {
        // When testing locally, disable CORS in browser settings
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


    async worker(node, inputs, outputs){


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

        const code = this.retrieveFeatureCode(node)
    
        
        for(let feature of features){

            const val = feature.values_[code]

            const geom = feature.getGeometry()
            const featureTileRange = tileGrid.getTileRangeForExtentAndZ(
                geom.getExtent(),
                z
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
                  const tileExtent = tileGrid.getTileCoordExtent([z, x, y])
                  if (geom.intersectsExtent(tileExtent)) {
                    result.set(x, y, val)
                  }
                }
            }
        }


        editorNode.controls.get('preview').update()


    }

}