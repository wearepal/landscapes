import { Extent } from 'ol/extent'
import * as React from 'react'
import { DatasetLayer, Layer, ModelOutputLayer } from './state'
import { BooleanTileGrid, CategoricalTileGrid, NumericTileGrid } from './modelling/tile_grid'
import { ChartData, extentToChartData } from './analysis_panel_tools/subsection'

type chartType = "pie" | "hist" | "bar"

const Chart = () => {
    return <>
        CHART
    </>
}

interface DropDownProps {
    layerType: BooleanTileGrid | NumericTileGrid | CategoricalTileGrid | null
}

const DropDown = ({ layerType }: DropDownProps) => {

    return <>
        <div className="d-flex align-items-center mt-3 ml-3 mr-3">
            <span style={{ width: "110px" }}>Chart type</span>
            <select className="custom-select">
                <option value="pie">Pie chart</option>
                <option value="bar">Bar chart</option>
                <option value="hist">Histogram</option>
            </select>
        </div>
    </>

}


interface AnalysisPanelProps {
    setShowAP: () => void
    selectedArea: Extent | null
    selectedLayer: Layer | null
    layerStats: (layer: DatasetLayer | ModelOutputLayer) => BooleanTileGrid | NumericTileGrid | CategoricalTileGrid | null
}

export const AnalysisPanel = ({ selectedArea, setShowAP, selectedLayer, layerStats }: AnalysisPanelProps) => {


    let errorMsg: string = ""
    let showChart: boolean = false
    let data: BooleanTileGrid | NumericTileGrid | CategoricalTileGrid | null = null

    if (selectedArea === null) {
        errorMsg = "Please select an area to analyse."
    } else if (selectedLayer === null) {
        errorMsg = "Please select a suitable layer."
    } else {
        if (selectedLayer.type !== "DatasetLayer" && selectedLayer.type !== "ModelOutputLayer") {
            errorMsg = "Unsuitable layer type, please select a model output or dataset layer."
        } else {
            data = layerStats(selectedLayer)
            if (data === null) {
                errorMsg = "Model is not yet available."
            } else {
                showChart = true
            }
        }
    }

    return (
        <div className="bg-light border-right d-flex flex-column" style={{ minWidth: "450px" }}>
            <div className="px-3 py-2 border-top border-bottom d-flex align-items-center justify-content-between">
                Analyse section
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
                        <div style={{ height: "350px" }}>
                            <Chart />
                        </div>
                        <div className="px-3 py-2 border-top border-bottom bg-light">Details</div>
                        <DropDown
                            layerType={data}
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