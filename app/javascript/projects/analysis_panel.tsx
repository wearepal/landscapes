import { Extent } from 'ol/extent'
import * as React from 'react'
import PieChart from './data_analysis_tools/pie_chart'


interface AnalysisPanelProps {
    selectedArea: Extent | null
    setSelectedArea: (extent: Extent | null) => void
}
export const AnalysisPanel = ({selectedArea, setSelectedArea}: AnalysisPanelProps) => (

    <div className="bg-light border-right d-flex flex-column" style={{ minWidth: "350px" }}>
        <div className="px-3 py-2 border-top border-bottom d-flex align-items-center justify-content-between">
        Analyse Section
        <i className="fas fa-times" style={{ cursor: "pointer" }} onClick={ () => setSelectedArea(null) }/>
        </div>

        <div className="flex-grow-1" style={{ overflowY: "auto", flexBasis: "0px" , backgroundColor: 'white'}}>
            <section style={{height: 300, width: 350, textAlign: 'center', paddingTop: 25}}>
                <PieChart 
                    data={[
                        {label: "A", value: 19},
                        {label: "B", value: 12},
                        {label: "C", value: 32},
                    ]}
                    width={250}
                    height={250}
                />
            </section>
        </div>

    </div>
)