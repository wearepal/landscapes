import { Extent } from 'ol/extent'
import * as React from 'react'
import { DatasetLayer, Layer, ModelOutputLayer } from './state'
import { BooleanTileGrid, CategoricalTileGrid, NumericTileGrid } from './modelling/tile_grid'
import { extentToChartData } from './analysis_panel_tools/subsection'

interface AnalysisPanelProps {
    setShowAP: () => void
    selectedArea: Extent | null
    selectedLayer: Layer | null
    layerStats: (layer: DatasetLayer | ModelOutputLayer) => BooleanTileGrid | NumericTileGrid | CategoricalTileGrid | null
}

export const AnalysisPanel = ({ selectedArea, setShowAP, selectedLayer, layerStats }: AnalysisPanelProps) => {

    let errorMsg: string = ""

    if (selectedArea === null) {
        errorMsg = "Please select an area to analyse."
    } else if (selectedLayer === null) {
        errorMsg = "Please select a suitable layer."
    } else {
        if (selectedLayer.type !== "DatasetLayer" && selectedLayer.type !== "ModelOutputLayer") {
            errorMsg = "Unsuitable layer type, please select a model output or dataset layer."
        } else {
            const data = layerStats(selectedLayer)
            if (data === null) {
                errorMsg = "Model is not yet available."
            } else {
                const chartData = extentToChartData(selectedLayer.colors, data, selectedArea)

                // visualise layer as chart
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
                    { errorMsg } &&
                    <div style={{ textAlign: "center", padding: 30 }}>{errorMsg}</div>
                }



            </div>

        </div>


    )
}