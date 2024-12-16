import { Extent } from 'ol/extent'
import * as React from 'react'
import { DatasetLayer, Layer, ModelOutputLayer } from './state'
import { BooleanTileGrid, CategoricalTileGrid, NumericTileGrid, TileGridProps } from './modelling/tile_grid'
import { ChartData, extentToChartDataCached } from './analysis_panel_tools/subsection'
import { GenerateChart } from './analysis_panel_tools/charts'
import './analysis_panel.css'
import { getArea } from 'ol/sphere'
import { fromExtent } from 'ol/geom/Polygon'
import { TeamExtentData } from './project_editor'
import { getMedianCellSize } from './modelling/components/cell_area_component'

export type ChartType = "pie" | "hist" | "bar" | "kde"

interface ChartProps {
    chartType: ChartType | undefined
    chartData: ChartData | undefined
    props: TileGridProps | undefined
    cellArea: number
}

const Chart = ({ chartType, chartData, props, cellArea }: ChartProps) => {

    if (!chartType || !chartData) return <></>

    return <GenerateChart
        chartData={chartData}
        chartType={chartType}
        props={props}
        cellArea={cellArea}
    />
}

interface ChartSelectionProps {
    SourceType: string
    ChartTypeSelected: ChartType | undefined
    SetChartType: (type: ChartType) => void
}

function downloadChartAsPNG(ChartTypeSelected: ChartType | undefined) {
    if(!ChartTypeSelected) return

    const chart = document.getElementById(ChartTypeSelected) as HTMLCanvasElement
    const svgContent = new XMLSerializer().serializeToString(chart)

    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")

    const svgImage = new Image()

    svgImage.src = "data:image/svg+xml;base64," + btoa(svgContent)

    svgImage.onload = () => {
        canvas.width = svgImage.width
        canvas.height = svgImage.height
        context?.drawImage(svgImage, 0, 0)

        const url = canvas.toDataURL("image/png")

        const link = document.createElement("a")
        link.href = url
        link.download = `snapshot_${ChartTypeSelected}_${Date.now()}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }
}

const ChartSelection = ({ SourceType, ChartTypeSelected, SetChartType }: ChartSelectionProps) => {

    const typeArray = ChartTypeArray.get(SourceType) || []

    const options = [
        { value: "pie", label: "Pie chart", icon: "fa-chart-pie", disabled: false },
        { value: "bar", label: "Bar chart", icon: "fa-chart-bar", disabled: false },
        { value: "hist", label: "Histogram", icon: "fa-chart-bar", disabled: false },
    ].filter(option => (typeArray as string[]).includes(option.value))

    return (
        <div className="d-flex align-items-center mt-3 ml-3 mr-3">
            <div className="btn-group mr-2">
                {options.map(option => (
                    <button disabled={option.disabled} title={option.label} type="button" onClick={() => SetChartType(option.value as ChartType)} className={`btn ${ChartTypeSelected == option.value ? "btn-primary" : "btn-outline-primary"}`}><i className={`fas ${option.icon}`} /></button>
                ))}
            </div>

            <div className="btn-group mr-2 ">
                <button title='Download' onClick={() => downloadChartAsPNG(ChartTypeSelected)} type="button" className={`btn btn-outline-primary`}><i className="fas fa-download"></i></button>
            </div>
        </div>
    );
}

interface ChartLegendProps {
    chartData: ChartData | undefined
    sourceType: string
    props: TileGridProps | undefined
}

const ChartLegend = ({ chartData, sourceType, props }: ChartLegendProps) => {
    if (!chartData) {
        return null
    }

    let LegendItems

    if (sourceType !== "NumericTileGrid") {
        const totalCount = Array.from(chartData.count.values()).reduce((acc, count) => acc + count, 0)
        const sortedLegendItems = Array.from(chartData.count.entries()).sort((a, b) => b[1] - a[1])
        LegendItems = sortedLegendItems.map(([label, count], index) => (
            <div style={{ display: "flex", alignItems: "center", fontSize: ".8em" }}>
                <div
                    style={{ backgroundColor: `rgb(${chartData.colors?.get(label)?.slice(0, 3)?.join(",")})` }}
                    className="chart-legend-color"
                />
                {`${label} (${((count / totalCount) * 100).toFixed(2)}%)`}
            </div>
        ))
    } else {
        if (chartData.numeric_stats) {
            const NumStats = chartData.numeric_stats
            LegendItems = Object.keys(NumStats).map(key => (
                <div hidden={key === "step"}>
                    <label style={{ width: 60 }}>{
                        key[0].toUpperCase() + key.slice(1)
                    }</label>
                    <input
                        disabled
                        type="text"
                        value={NumStats[key]}
                    />
                    <input
                        type='text'
                        value={ key === "sum" ? (props?.unit ? props.unit : "No unit") : ((props?.unit && props?.area) ? `${props.unit}/${props.area}` : "No unit") }
                        style={{ width: 70, textAlign: 'center' }}
                        disabled
                    />
                </div>
            ))
        } else {
            LegendItems = ""
        }
    }


    return (
        <div className="chart-legend" style={{ display: "flex", flexDirection: "column", padding: "10px" }}>
            {LegendItems}
        </div>
    );
}

interface AnalysisPanelProps {
    setShowAP: () => void
    selectedArea: Extent | null
    setSelectedArea: (extent: Extent | null) => void
    selectedLayer: Layer | null
    layerStats: (layer: DatasetLayer | ModelOutputLayer) => BooleanTileGrid | NumericTileGrid | CategoricalTileGrid | null
    currentTab: number
    projectExtent: Extent
    ExtentList: TeamExtentData[]
}

let dataSourceType: string = "null"

const ChartTypeArray: Map<string, ChartType[]> = new Map()
ChartTypeArray.set("BooleanTileGrid", ["pie", "bar"])
ChartTypeArray.set("CategoricalTileGrid", ["pie", "bar"])
ChartTypeArray.set("NumericTileGrid", ["hist"])



export const AnalysisPanel = ({ selectedArea, setSelectedArea, setShowAP, selectedLayer, layerStats, currentTab, projectExtent, ExtentList }: AnalysisPanelProps) => {

    const [chartType, setChartType] = React.useState<ChartType>()
    const [chartData, setChartData] = React.useState<ChartData>()
    const [bins, setBins] = React.useState<number>(10) 
    const [colors, setColors] = React.useState<any>(null)

    let errorMsg: string = ""
    let showChart: boolean = false
    let data: BooleanTileGrid | NumericTileGrid | CategoricalTileGrid | null = null

    React.useEffect(() => {    
        if (data !== null && selectedArea && (selectedLayer?.type == "ModelOutputLayer" || selectedLayer?.type == "DatasetLayer")) {
            const datasetLayer = selectedLayer as DatasetLayer
            setColors(data instanceof NumericTileGrid ? datasetLayer.fill : datasetLayer.colors)
        }
    }, [selectedLayer])

    React.useEffect(() => {

        if (data !== null && selectedArea && (selectedLayer?.type == "ModelOutputLayer" || selectedLayer?.type == "DatasetLayer")) {

            setChartData(extentToChartDataCached(selectedLayer.colors, data, selectedArea, selectedLayer.fill, bins))

            let dataType: string | undefined = undefined

            if (data instanceof BooleanTileGrid) {
                dataType = "BooleanTileGrid"
            } else if (data instanceof NumericTileGrid) {
                dataType = "NumericTileGrid"
            } else if (data instanceof CategoricalTileGrid) {
                dataType = "CategoricalTileGrid"
            }
            if (dataType !== undefined) {
                if (dataSourceType !== dataType || chartType === undefined) {
                    dataSourceType = dataType
                    const charts = ChartTypeArray.get(dataType)
                    if (charts) setChartType(charts[0])
                }
            }
        } else {
            setChartData(undefined)
        }

    }, [selectedArea, selectedLayer, data, currentTab, bins, colors])


    if (selectedArea === null) {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC')>=0
        errorMsg = `${isMac ? "Press the command key and drag the mouse to select an area." : "Press the control key and drag the mouse to select an area."}`
    } else if (selectedLayer === null) {
        errorMsg = "Please select a suitable layer."
    } else if (selectedLayer.type !== "DatasetLayer" && selectedLayer.type !== "ModelOutputLayer") {
        errorMsg = "Unsuitable layer type, please select a model output or dataset layer."
    } else {
        data = layerStats(selectedLayer)
        if (data === null) {
            errorMsg = "Model is not yet available."
        } else {
            showChart = true
        }
    }

    return (
        <div className="bg-light border-right d-flex flex-column" style={{ minWidth: "450px", maxWidth: "450px" }}>
            <div className="px-3 py-2 border-top border-bottom d-flex align-items-center justify-content-between">
                Snapshot tool
                <i className="fas fa-times" style={{ cursor: "pointer" }} onClick={setShowAP} />
            </div>

            <div className="flex-grow-1" style={{ overflowY: "auto", flexBasis: "0px", backgroundColor: 'white' }}>

                {
                    errorMsg.split("drag the mouse").length > 1 &&
                    <i className="fas fa-mouse-pointer" style={{ fontSize: "2em", display: "block", textAlign: "center", padding: 20, paddingTop: 50 }} />
                }
                {
                    errorMsg.split("select a suitable layer").length > 1 &&
                    <i className="fas fa-hand-pointer" style={{ fontSize: "2em", display: "block", textAlign: "center", padding: 20, paddingTop: 50 }} />
                }
                {
                    errorMsg.split("Model is not yet available").length > 1 &&
                    <i className="fas fa-spinner" style={{ fontSize: "2em", display: "block", textAlign: "center", padding: 20, paddingTop: 50 }} />
                }
                {
                    errorMsg.split("Unsuitable layer type").length > 1 &&
                    <i className="fas fa-exclamation-triangle" style={{ fontSize: "2em", display: "block", textAlign: "center", padding: 20, paddingTop: 50 }} />
                }
                {
                    !!errorMsg &&
                    <div style={{ textAlign: "center", padding: 30 }}>{errorMsg}</div>
                }

                {
                    showChart &&
                    <>
                        <ChartSelection
                            SourceType={dataSourceType}
                            ChartTypeSelected={chartType}
                            SetChartType={setChartType}
                        />
                        <div style={{ textAlign: 'center' }}>
                            <Chart
                                chartType={chartType}
                                chartData={chartData}
                                props={data instanceof NumericTileGrid ? data.properties : undefined}
                                cellArea={data ? getMedianCellSize(data).area : 0}
                            />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            {
                                chartType == "hist"
                                &&
                                <>
                                    <label style={{ width: 60 }}>Bars</label>
                                    <input
                                        type="number"
                                        value={bins}
                                        onChange={(e) => setBins(+e.target.value)}
                                        min={1}
                                    />
                                </>
                            }
                            <ChartLegend
                                chartData={chartData}
                                sourceType={dataSourceType}
                                props={data instanceof NumericTileGrid ? data.properties : undefined}
                            />
                        </div>
                    </>
                }

            </div>

            <div className="px-3 py-2 border-top border-bottom bg-light">Selected coordinates (EPSG:3857)</div>

            <div className="px-3 py-2 border-top border-bottom bg-white text-center">

                <div style={{paddingBottom: 15}} > 
                    <label style={{ width: 60 }} >Area</label>
                    <input
                        disabled
                        type="text"
                        value={selectedArea ? `${(getArea(fromExtent(selectedArea)) / 1000000).toFixed(4)} km²` : "0 km²"}
                    />
                </div>
                
                <div className="row">
                    <div className="col-8">
                        <div>
                            <label style={{ width: 40 }} >Xmin</label>
                            <input
                                disabled
                                type="text"
                                value={selectedArea ? selectedArea[0] : 0}
                            />
                        </div>
                        <div>
                            <label style={{ width: 40 }}>Ymin</label>
                            <input
                                disabled
                                type="text"
                                value={selectedArea ? selectedArea[1] : 0}
                            />
                        </div>
                        <div>
                            <label style={{ width: 40 }}>Xmax</label>
                            <input
                                disabled
                                type="text"
                                value={selectedArea ? selectedArea[2] : 0}
                            />
                        </div>
                        <div>
                            <label style={{ width: 40 }}>Ymax</label>
                            <input
                                disabled
                                type="text"
                                value={selectedArea ? selectedArea[3] : 0}
                            />
                        </div>
                    </div>

                    <div className="col">
                        <div className="btn-group mr-2" style={{paddingBottom: 15}} data-toggle="modal" data-target="#extentModal">
                            <button className="btn btn-sm btn-outline-primary">
                                <i className="fas fa-square" /> Set extent
                            </button>
                        </div>          
                        <div className="btn-group mr-2" style={{paddingBottom: 15}} onClick={()=>{navigator.clipboard.writeText(selectedArea ? selectedArea.join(",") : ""); alert("Copied selected area to clipboard.")}}>
                            <button className="btn btn-sm btn-outline-primary">
                                <i className="fas fa-copy" /> Copy extent
                            </button>
                        </div>
                    </div>
                </div>

                

            </div>
            <div className="modal fade" id="extentModal" role="dialog" aria-labelledby="extentModalTitle" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="extentModalTitle">Select Extent</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className='row'>
                            <div className='col-8'>
                                <input
                                    id="extent-input"
                                    style={{width: '100%'}}
                                    type="text"
                                    placeholder='min x, min y, max x, max y'
                                    onChange={(e) => {
                                        let valid = false
                                        const extent = e.target.value.split(',').map(Number)
                                        valid = extent.length === 4 && extent.every((coord) => !isNaN(coord)) && extent[0] < extent[2] && extent[1] < extent[3]
                                        if(!valid){
                                            (document.getElementById('save-snapshot-extent-btn') as HTMLButtonElement).disabled = true
                                        }else{
                                            (document.getElementById('save-snapshot-extent-btn') as HTMLButtonElement).disabled = false
                                        }
                                    }}
                                />
                            </div>
                            <select onChange={(e) => 
                                    {
                                        const selectedIndex = Number(e.target.value)
                                        const selectedExtent = ExtentList[selectedIndex]
                                        if (selectedExtent) {
                                            document.getElementById('extent-input')!.setAttribute('value', selectedExtent.value.join(','))
                                        }
                                    }}
                                    className='form-select'>
                                <option value=''>Select project extent</option>
                                {ExtentList.map((extent, index) => (
                                    <option key={index} value={index}>{extent.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>

                        <button type='button' className='btn btn-primary' data-dismiss="modal" onClick={()=>setSelectedArea(projectExtent)}>Use project extent</button>
                        <button 
                            id="save-snapshot-extent-btn" 
                            type="button" 
                            data-dismiss="modal"
                            className="btn btn-primary"
                            onClick={()=>{
                                const extent = (document.getElementById('extent-input') as HTMLInputElement).value.split(',').map(Number)
                                if(extent.length === 4 && extent.every((coord) => !isNaN(coord)) && extent[0] < extent[2] && extent[1] < extent[3]){
                                    const extentFeature = fromExtent(extent)
                                    const extentArea = getArea(extentFeature)
                                    if(extentArea > 0){
                                        setSelectedArea(extent)
                                        
                                    }
                                }
                            }}
                            >Set as snapshot extent</button>
                    </div>
                    </div>
                </div>
            </div>
        </div >
    )
}