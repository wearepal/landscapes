import { BaseComponent } from "./base_component"
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { Input, Node, Output, Socket } from 'rete'
import { ProjectProperties } from "."
import { Extent } from "ol/extent"
import { createXYZ } from "ol/tilegrid"
import { retrieveISRICData } from "../model_retrieval"
import { CategoricalTileGrid, NumericTileGrid } from "../tile_grid"
import { TypedArray } from "d3"
import { maskFromExtentAndShape } from "../bounding_box"
import { SelectControl } from "../controls/select"
import { SoilGrids, SoilGridOptions, ERBSoilTypes } from "../isric_soil_filters"

async function renderCategoricalData(extent: Extent, zoom: number, maskMode: boolean, maskLayer: string, maskCQL: string) {

    const tileGrid = createXYZ()
    const mask = await maskFromExtentAndShape(extent, zoom, maskLayer, maskCQL, maskMode)
    const outputTileRange = tileGrid.getTileRangeForExtentAndZ(extent, zoom)

    const geotiff = await retrieveISRICData(extent, 'MostProbable', 'wrb', outputTileRange)


    const rasters = await geotiff.readRasters({ bbox: extent, width: outputTileRange.getWidth(), height: outputTileRange.getHeight() })
    const image = await geotiff.getImage()


    const result = new CategoricalTileGrid(
        zoom,
        outputTileRange.minX,
        outputTileRange.minY,
        outputTileRange.getWidth(),
        outputTileRange.getHeight()
    )

    for (let i = 0; i < (rasters[0] as TypedArray).length; i++) {

        let x = (outputTileRange.minX + i % image.getWidth())
        let y = (outputTileRange.minY + Math.floor(i / image.getWidth()))
        result.set(x, y, mask.get(x, y) ? rasters[0][i]+1 : 255)

    }

    result.setLabels(new Map(ERBSoilTypes.map((soilType, index) => [index+1, soilType])))

    return result
}

async function renderNumericData(extent: Extent, zoom: number, maskMode: boolean, maskLayer: string, maskCQL: string, map: string, coverageId: string, factor: number = 1.0) {

    const tileGrid = createXYZ()
    const mask = await maskFromExtentAndShape(extent, zoom, maskLayer, maskCQL, maskMode)
    const outputTileRange = tileGrid.getTileRangeForExtentAndZ(extent, zoom)

    const geotiff = await retrieveISRICData(extent, coverageId, map, outputTileRange)

    const rasters = await geotiff.readRasters({ bbox: extent, width: outputTileRange.getWidth(), height: outputTileRange.getHeight() })
    const image = await geotiff.getImage()

    const result = new NumericTileGrid(
        zoom,
        outputTileRange.minX,
        outputTileRange.minY,
        outputTileRange.getWidth(),
        outputTileRange.getHeight()
    )

    for (let i = 0; i < (rasters[0] as TypedArray).length; i++) {

        let x = (outputTileRange.minX + i % image.getWidth())
        let y = (outputTileRange.minY + Math.floor(i / image.getWidth()))

        const value = rasters[0][i]
        result.set(x, y, mask.get(x, y) ? ((value === 255 || value < 0 || value === 32767) ? NaN : value / factor) : NaN)

    }

    return result
}

export class SoilComponent extends BaseComponent {
    projectZoom: number
    projectExtent: Extent
    maskMode: boolean
    maskLayer: string
    maskCQL: string


    constructor(projectProps: ProjectProperties) {
        super("ISRIC Soil Data")
        this.category = "Inputs"
        this.projectZoom = projectProps.zoom
        this.projectExtent = projectProps.extent
        this.maskMode = projectProps.mask
        this.maskLayer = projectProps.maskLayer
        this.maskCQL = projectProps.maskCQL
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

        const soilgridId = node.data.soilgridId || 0
        const soilGridOpts = SoilGridOptions.filter(opt => opt.SCOId == soilgridId)
        soilGridOpts.forEach(
            opt => node.addOutput(new Output(`${opt.name}-${opt.map}`, `${opt.name} ${opt.unit ? `[[${opt.unit}${opt.area && opt.area !== 'na' ? `/${opt.area}` : ''}]]` : ''}`, opt.outputSocket))
        )
        node.update()

    }

    async builder(node: Node) {

        node.meta.toolTip = "Data from ISRIC SoilGrids API."
        node.meta.toolTipLink = "https://www.isric.org/"

        node.addControl(
            new SelectControl(
                this.editor,
                'soilgridId',
                () => SoilGrids,
                () => this.changeOutputs(node),
                'Soil Grid'
            )
        )

        this.updateOutputs(node)

    }


    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {

        const soilgridId = node.data.soilgridId || 0
        const soilGrid = SoilGrids.find(opt => opt.id == soilgridId)
        const soilGridOpts = SoilGridOptions.filter(opt => opt.SCOId == soilgridId)
        let catData: CategoricalTileGrid | undefined = undefined

        const promises = soilGridOpts.filter(
            opt => node.outputs[`${opt.name}-${opt.map}`].connections.length > 0
        ).map(async opt => {
            if(soilGrid?.name == 'WRB (most probable)') {

                if(!catData) {
                    catData = await renderCategoricalData(this.projectExtent, this.projectZoom, this.maskMode, this.maskLayer, this.maskCQL)
                }

                switch(opt.name) {
                    case 'All':
                        outputs[`${opt.name}-${opt.map}`] = catData
                        break
                    default:
                        outputs[`${opt.name}-${opt.map}`] = catData?.getBoolFromLabel(opt.name)
                        break
                }
                
            }else{
                const res = await renderNumericData(this.projectExtent, this.projectZoom, this.maskMode, this.maskLayer, this.maskCQL, opt.map, opt.coverageId, opt.factor)
                res.properties = {
                    unit: opt.unit,
                    area: opt.area
                }
                outputs[`${opt.name}-${opt.map}`] = res
            }
        })

        await Promise.all(promises)

    }

}