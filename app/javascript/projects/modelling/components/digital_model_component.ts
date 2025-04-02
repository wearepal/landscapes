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
        name: "Digital Surface Model Elevation (National LIDAR Service 1m)",
        source: '9ba4d5ac-d596-445a-9056-dae3ddec0178:Lidar_Composite_Elevation_LZ_DSM_1m',
        externalLink: 'https://environment.data.gov.uk/spatialdata/lidar-composite-digital-surface-model-last-return-dsm-1m/',
        toolTipURL: "https://environment.data.gov.uk/dataset/9ba4d5ac-d596-445a-9056-dae3ddec0178"
    },
    {
        id: 7,
        name: "Digital Surface Model Hillshade (National LIDAR Service 1m)",
        source: '9ba4d5ac-d596-445a-9056-dae3ddec0178:Lidar_Composite_Hillshade_LZ_DSM_1m',
        externalLink: 'https://environment.data.gov.uk/spatialdata/lidar-composite-digital-surface-model-last-return-dsm-1m/',
        toolTipURL: "https://environment.data.gov.uk/dataset/9ba4d5ac-d596-445a-9056-dae3ddec0178"
    },
    {
        id: 6,
        name: "Digital Terrain Model Elevation (National LIDAR Service 1m)",
        source: '13787b9a-26a4-4775-8523-806d13af58fc:Lidar_Composite_Elevation_DTM_1m',
        externalLink: 'https://environment.data.gov.uk/spatialdata/lidar-composite-digital-terrain-model-dtm-1m/',
        toolTipURL: "https://environment.data.gov.uk/dataset/13787b9a-26a4-4775-8523-806d13af58fc"
    },
    {
        id: 8,
        name: "Digital Terrain Model Hillshade (National LIDAR Service 1m)",
        source: '13787b9a-26a4-4775-8523-806d13af58fc:Lidar_Composite_Hillshade_DTM_1m',
        externalLink: 'https://environment.data.gov.uk/spatialdata/lidar-composite-digital-terrain-model-dtm-1m/',
        toolTipURL: "https://environment.data.gov.uk/dataset/13787b9a-26a4-4775-8523-806d13af58fc"
    },
    {
        id: 9,
        name: "Digital Surface Model Elevation (National LIDAR Service 2m)",
        source: 'f083c5dc-504f-4428-9811-a1b2519fa279:Lidar_Composite_Elevation_LZ_DSM_2m',
        externalLink: 'https://environment.data.gov.uk/spatialdata/lidar-composite-digital-surface-model-last-return-dsm-2m/',
        toolTipURL: "https://environment.data.gov.uk/dataset/f083c5dc-504f-4428-9811-a1b2519fa279"
    },
    {
        id: 10,
        name: "Digital Surface Model Hillshade (National LIDAR Service 2m)",
        source: 'f083c5dc-504f-4428-9811-a1b2519fa279:Lidar_Composite_Hillshade_LZ_DSM_2m',
        externalLink: 'https://environment.data.gov.uk/spatialdata/lidar-composite-digital-surface-model-last-return-dsm-2m/',
    },
    {
        id: 11,
        name: "Digital Terrain Model Elevation (National LIDAR Service 2m)",
        source: '09ea3b37-df3a-4e8b-ac69-fb0842227b04:Lidar_Composite_Elevation_DTM_2m',
        externalLink: 'https://environment.data.gov.uk/spatialdata/lidar-composite-digital-terrain-model-dtm-2m/',
        toolTipURL: "https://environment.data.gov.uk/dataset/09ea3b37-df3a-4e8b-ac69-fb0842227b04"
    },
    {
        id: 12,
        name: "Digital Terrain Model Hillshade (National LIDAR Service 2m)",
        source: '09ea3b37-df3a-4e8b-ac69-fb0842227b04:Lidar_Composite_Hillshade_DTM_2m',
        externalLink: 'https://environment.data.gov.uk/spatialdata/lidar-composite-digital-terrain-model-dtm-2m/',
        toolTipURL: "https://environment.data.gov.uk/dataset/09ea3b37-df3a-4e8b-ac69-fb0842227b04"
    },
    {
        id: 13,
        name: "Digital Surface Model First Return Elevation (National LIDAR Service 2m)",
        source: '54167602-36c8-4b2b-80ec-ebb6267b6b1e:Lidar_Composite_Elevation_FZ_DSM_2m',
        externalLink: 'https://environment.data.gov.uk/spatialdata/lidar-composite-digital-surface-model-first-return-dsm-2m/',
        toolTipURL: "https://environment.data.gov.uk/dataset/54167602-36c8-4b2b-80ec-ebb6267b6b1e"
    },
    {
        id: 14,
        name: "Digital Surface Model First Return Hillshade (National LIDAR Service 2m)",
        source: '54167602-36c8-4b2b-80ec-ebb6267b6b1e:Lidar_Composite_Hillshade_FZ_DSM_2m',
        externalLink: 'https://environment.data.gov.uk/spatialdata/lidar-composite-digital-surface-model-first-return-dsm-2m/',
        toolTipURL: "https://environment.data.gov.uk/dataset/54167602-36c8-4b2b-80ec-ebb6267b6b1e"
    },
    {
        id: 15,
        name: 'LIDAR Vegetation Object Model Elevation',
        source: 'ecae3bef-1e1d-4051-887b-9dc613c928ec:Vegetation_Object_Model_Elevation_2022',
        permission: 'KewLidar',
        externalLink: 'https://environment.data.gov.uk/spatialdata/vegetation-object-model/',
        toolTipURL: 'https://www.data.gov.uk/dataset/227ab487-e8f2-4cbb-b26a-9e6d3b662265/lidar-vegetation-object-model-vom#licence-info'
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

        node.addOutput(new Output('dm', 'Output [[m]]', numericDataSocket))


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

                out.properties['unit'] = 'm'

                this.outputCache.set(digitalModel.source, out)

            }
            const previewControl: any = editorNode.controls.get('Preview')
            previewControl.update()
            editorNode.update()
        }

    }

}