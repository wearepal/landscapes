import { Node, Output } from "rete"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data"
import { BaseComponent } from "./base_component"
import { SelectControl } from "../controls/select"
import { PreviewControl } from "../controls/preview"
import { NumericTileGrid } from "../tile_grid"
import { numericDataSocket } from "../socket_types"
import { createXYZ } from "ol/tilegrid"
import { TypedArray } from "d3"
import { retrieveModelDataWCS } from "../model_retrieval"
import { Extent } from "ol/extent"
import { maskFromExtentAndShape } from "../bounding_box"
import { ProjectProperties } from "."
import { ProjectPermissions } from "../../project_editor"

interface DigitalModel {
    id: number
    name: string
    source: string
    toolTip?: string
    toolTipURL?: string
    externalLink?: string
    permission?: string
}

//TODO: hardcoded scale factors, find an effective way of retrieving them from the geoserver?
const ModelList: Array<DigitalModel> = [
    {
        id: 0,
        name: 'Digital Surface Model',
        source: 'lidar:DSM_2m',
        permission: 'KewLidar'
    },
    {
        id: 1,
        name: 'Digital Terrian Model',
        source: 'lidar:DTM_5m',
        permission: 'KewLidar'
    },
    {
        id: 2,
        name: 'Feature Height',
        source: 'lidar:Depth',
        permission: 'KewLidar'
    },
    {
        id: 3,
        name: 'Canopy Height (Sentinel-2, Equal-Earth)',
        source: 'eth:ch',
        toolTip: '(Height) Global canopy top height map for the year 2020, visualized in Equal-Earth projection. The underlying data product, estimated from Sentinel-2 imagery, has 10 m ground sampling distance.',
        toolTipURL: 'https://langnico.github.io/globalcanopyheight/'
    },
    {
        id: 4,
        name: 'SD (Sentinel-2, Equal-Earth)',
        source: 'eth:sd',
        toolTip: '(Standard Deviation) Global canopy top height map for the year 2020, visualized in Equal-Earth projection. The underlying data product, estimated from Sentinel-2 imagery, has 10 m ground sampling distance.',
        toolTipURL: 'https://langnico.github.io/globalcanopyheight/'
    },
    {
        id: 5,
        name: "Digital Surface Model (National LIDAR Service 1m)",
        source: '9ba4d5ac-d596-445a-9056-dae3ddec0178:Lidar_Composite_Elevation_LZ_DSM_1m',
        externalLink: 'https://environment.data.gov.uk/spatialdata/lidar-composite-digital-surface-model-last-return-dsm-1m/',
        toolTipURL: "https://environment.data.gov.uk/dataset/9ba4d5ac-d596-445a-9056-dae3ddec0178"
    },
    {
        id: 6,
        name: "Digital Terrain Model (National LIDAR Service 1m)",
        source: '13787b9a-26a4-4775-8523-806d13af58fc:Lidar_Composite_Elevation_DTM_1m',
        externalLink: 'https://environment.data.gov.uk/spatialdata/lidar-composite-digital-terrain-model-dtm-1m/',
        toolTipURL: "https://environment.data.gov.uk/dataset/13787b9a-26a4-4775-8523-806d13af58fc"
    }
]

export class DigitalModelComponent extends BaseComponent {
    outputCache: Map<string, NumericTileGrid>
    projectZoom: number
    projectExtent: Extent
    maskMode: boolean
    maskLayer: string
    maskCQL: string
    permissions: ProjectPermissions
    constructor(projectProps: ProjectProperties, permissions: ProjectPermissions) {
        super("Digital Model")
        this.category = "Inputs"
        this.outputCache = new Map()
        this.projectExtent = projectProps.extent
        this.projectZoom = projectProps.zoom
        this.maskMode = projectProps.mask
        this.maskLayer = projectProps.maskLayer
        this.maskCQL = projectProps.maskCQL
        this.permissions = permissions
    }

    async builder(node: Node) {

        console.log(this.permissions)

        const dft = 'Digital models are generated via LIDAR or satellite data. They can be used to calculate canopy height, feature height, and more.'

        node.meta.toolTip = ModelList.find(a => a.id == node.data.sourceId)?.toolTip || dft
        node.meta.toolTipLink = ModelList.find(a => a.id == node.data.sourceId)?.toolTipURL || ''

        node.addControl(
            new SelectControl(
                this.editor,
                'sourceId',
                () => ModelList.filter(a => this.permissions[a.permission as keyof ProjectPermissions] || !a.permission),
                () => {
                    node.meta.toolTip = ModelList.find(a => a.id == node.data.sourceId)?.toolTip || dft
                    node.meta.toolTipLink = ModelList.find(a => a.id == node.data.sourceId)?.toolTipURL || ''
                },
                'Model'
            )
        )

        node.addControl(new PreviewControl(() =>
            node.meta.output as any || new NumericTileGrid(0, 0, 0, 1, 1)
        ))

        node.addOutput(new Output('dm', 'Output', numericDataSocket))


    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {

        const editorNode = this.editor?.nodes.find(n => n.id === node.id)
        if (editorNode === undefined) { return }

        let index = node.data.sourceId
        if (index === undefined) { index = 0 }

        const mask = await maskFromExtentAndShape(this.projectExtent, this.projectZoom, this.maskLayer, this.maskCQL, this.maskMode)

        let digitalModel = ModelList.find(a => a.id == index)

        if (digitalModel?.source) {

            if (this.outputCache.has(digitalModel.source)) {
                const out = editorNode.meta.output = outputs['dm'] = this.outputCache.get(digitalModel.source)
            } else {
                const tileGrid = createXYZ()
                const outputTileRange = tileGrid.getTileRangeForExtentAndZ(this.projectExtent, this.projectZoom)
                const geotiff = await retrieveModelDataWCS(this.projectExtent, digitalModel.source, outputTileRange, digitalModel.externalLink)

                const image = await geotiff.getImage()
                const rasters = await geotiff.readRasters({ bbox: this.projectExtent, width: outputTileRange.getWidth(), height: outputTileRange.getHeight() })

                const out = editorNode.meta.output = outputs['dm'] = new NumericTileGrid(this.projectZoom, outputTileRange.minX, outputTileRange.minY, outputTileRange.getWidth(), outputTileRange.getHeight())


                for (let i = 0; i < (rasters[0] as TypedArray).length; i++) {

                    let x = (outputTileRange.minX + i % image.getWidth()) 
                    let y = (outputTileRange.minY + Math.floor(i / image.getWidth()))

                    out.set(x, y, mask.get(x, y) === true ? ((rasters[0][i]) === -32767 || ((rasters[0][i]) === 255) && (digitalModel.source === 'eth:ch' || digitalModel.source === 'eth:sd'))  ? NaN : (rasters[0][i]) : NaN)

                }

                this.outputCache.set(digitalModel.source, out)

            }
            const previewControl: any = editorNode.controls.get('Preview')
            previewControl.update()
            editorNode.update()
        }

    }

}