import { Extent } from 'ol/extent'
import * as React from 'react'
import { DatasetLayer, Layer, ModelOutputLayer } from './state'
import { BooleanTileGrid, CategoricalTileGrid, NumericTileGrid } from './modelling/tile_grid'
import { ChartData, extentToChartData } from './analysis_panel_tools/subsection'
import { GenerateChart } from './analysis_panel_tools/charts'
import './analysis_panel.css'


export type ChartType = "pie" | "hist" | "bar"

interface ChartProps {
    chartType: ChartType | undefined
    chartData: ChartData | undefined

}

const Chart = ({ chartType, chartData }: ChartProps) => {

    if (!chartType || !chartData) return <></>

    return <GenerateChart
        chartData={chartData}
        chartType={chartType}
    />
}

interface ChartSelectionProps {
    SourceType: string
    ChartTypeSelected: ChartType | undefined
    SetChartType: (type: ChartType) => void
}

const ChartSelection = ({ SourceType, ChartTypeSelected, SetChartType }: ChartSelectionProps) => {

    const typeArray = ChartTypeArray.get(SourceType) || []

    const options = [
        { value: "pie", label: "Pie chart", icon: "fa-chart-pie", disabled: false},
        { value: "bar", label: "Bar chart", icon: "fa-chart-bar", disabled: true },
        { value: "hist", label: "Histogram", icon: "fa-chart-bar", disabled: true },
    ].filter(option => (typeArray as string[]).includes(option.value))

    return (
        <div className="d-flex align-items-center mt-3 ml-3 mr-3">
            <div className="btn-group mr-2">
                {options.map(option => (
                    <button disabled={option.disabled} title={option.label} type="button" onClick={() => SetChartType(option.value as ChartType)} className={`btn ${ChartTypeSelected == option.value ? "btn-primary" : "btn-outline-primary"}`}><i className={`fas ${option.icon}`} /></button>
                ))}
            </div>

            <div className="btn-group mr-2">
                <button disabled title='Expand' type="button" className={`btn btn-outline-primary`}><i className="fas fa-expand"></i></button>
            </div>

            <div className="btn-group mr-2 ">
                <button disabled title='Download' type="button" className={`btn btn-outline-primary`}><i className="fas fa-download"></i></button>
            </div>
        </div>
    );
}

interface ChartLegendProps {
    chartData: ChartData | undefined
    sourceType: string
}

const ChartLegend = ({ chartData, sourceType }: ChartLegendProps) => {
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
        LegendItems = ""
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
    selectedLayer: Layer | null
    layerStats: (layer: DatasetLayer | ModelOutputLayer) => BooleanTileGrid | NumericTileGrid | CategoricalTileGrid | null
    currentTab: number
}

let dataSourceType: string = "null"

const ChartTypeArray: Map<string, ChartType[]> = new Map()
ChartTypeArray.set("BooleanTileGrid", ["pie", "bar"])
ChartTypeArray.set("CategoricalTileGrid", ["pie", "bar"])
ChartTypeArray.set("NumericTileGrid", ["hist"])



export const AnalysisPanel = ({ selectedArea, setShowAP, selectedLayer, layerStats, currentTab }: AnalysisPanelProps) => {

    const [chartType, setChartType] = React.useState<ChartType>()
    const [chartData, setChartData] = React.useState<ChartData>()

    console.log(chartType)

    let errorMsg: string = ""
    let showChart: boolean = false
    let data: BooleanTileGrid | NumericTileGrid | CategoricalTileGrid | null = null

    React.useEffect(() => {

        if (data !== null && selectedArea && (selectedLayer?.type == "ModelOutputLayer" || selectedLayer?.type == "DatasetLayer")) {

            setChartData(extentToChartData(selectedLayer.colors, data, selectedArea, selectedLayer.fill))

            const typeMap: { [key: string]: string } = {
                BooleanTileGrid: "BooleanTileGrid",
                NumericTileGrid: "NumericTileGrid",
                CategoricalTileGrid: "CategoricalTileGrid",
            }

            const dataType = typeMap[data.constructor.name]

            console.log(dataType)

            if (dataSourceType !== dataType || chartType === undefined) {
                dataSourceType = dataType
                const charts = ChartTypeArray.get(dataType)
                if (charts) setChartType(charts[0])
            }

        } else {
            setChartData(undefined)
        }

    }, [selectedArea, selectedLayer, data, currentTab])


    if (selectedArea === null) {
        errorMsg = "Please select an area to analyze."
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
                            />
                        </div>
                        <ChartLegend
                            chartData={chartData}
                            sourceType={dataSourceType}
                        />
                    </>
                }

            </div>

            <div className="px-3 py-2 border-top border-bottom bg-light">Selected coordinates (EPSG:3857)</div>

            <div className="px-3 py-2 border-top border-bottom bg-white text-center">

                <div>
                    <label style={{ width: 60 }} >Xmin</label>
                    <input
                        disabled
                        type="text"
                        value={selectedArea ? selectedArea[0] : 0}
                    />
                </div>
                <div>
                    <label style={{ width: 60 }}>Ymin</label>
                    <input
                        disabled
                        type="text"
                        value={selectedArea ? selectedArea[1] : 0}
                    />
                </div>
                <div>
                    <label style={{ width: 60 }}>Xmax</label>
                    <input
                        disabled
                        type="text"
                        value={selectedArea ? selectedArea[2] : 0}
                    />
                </div>
                <div>
                    <label style={{ width: 60 }}>Ymax</label>
                    <input
                        disabled
                        type="text"
                        value={selectedArea ? selectedArea[3] : 0}
                    />
                </div>
            </div>

        </div >


    )
}