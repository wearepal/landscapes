import { Extent } from 'ol/extent'
import * as React from 'react'
import PieChart from './data_analysis_tools/pie_chart'
import { Layer } from './state'
import { ModelOutputCache } from './map_view'
import { ChartData, extentToChartData } from './data_analysis_tools/subsection'


interface AnalysisPanelProps {
    selectedArea: Extent | null
    setSelectedArea: (extent: Extent | null) => void
    selectedLayer: Layer | null
    modelOutputCache: ModelOutputCache
}

export const AnalysisPanel = ({selectedArea, setSelectedArea, selectedLayer, modelOutputCache}: AnalysisPanelProps) => {


    const [errorMsg, setErrorMsg] = React.useState<string>()
    const [model, setModel] = React.useState<ChartData>()


    React.useEffect(() => {

        if(!selectedArea) return

        setErrorMsg("")
        if(!selectedLayer) setErrorMsg("No layer selected.")
        else if(selectedLayer?.type !== "ModelOutputLayer") setErrorMsg("Analysis unavailable on this layer, please select type: ModelOutputLayer")
        else{
            const tilegrid = modelOutputCache[selectedLayer.nodeId]
            if(!tilegrid) setErrorMsg("Please run this model.")
            else{
                setModel(extentToChartData(selectedLayer.colors, tilegrid, selectedArea))
            }
        }

    }, [modelOutputCache, selectedLayer, selectedArea])

    return (

        <div className="bg-light border-right d-flex flex-column" style={{ minWidth: "450px" }}>
            <div className="px-3 py-2 border-top border-bottom d-flex align-items-center justify-content-between">
            Analyse Section
            <i className="fas fa-times" style={{ cursor: "pointer" }} onClick={ () => setSelectedArea(null) }/>
            </div>

            <div className="flex-grow-1" style={{ overflowY: "auto", flexBasis: "0px" , backgroundColor: 'white'}}>

                {
                    errorMsg
                }

                <section style={{height: 400, width: 450, textAlign: 'center', paddingTop: 25}}>
                    <PieChart 
                        data={model?.count ? model.count : new Map<any, number>()}
                        colors={model?.colors}
                        width={350}
                        height={350}
                    />
                </section>
                

            </div>

        </div>

    )

}