import { Extent } from 'ol/extent'
import * as React from 'react'


interface AnalysisPanelProps {
    selectedArea: Extent | null
    setSelectedArea: (extent: Extent | null) => void
}
export const AnalysisPanel = ({selectedArea, setSelectedArea}: AnalysisPanelProps) => (

    <div className="bg-light border-right d-flex flex-column" style={{ minWidth: "450px" }}>
        <div className="px-3 py-2 border-top border-bottom d-flex align-items-center justify-content-between">
        Analyse Section
        <i className="fas fa-times" style={{ cursor: "pointer" }} onClick={ () => setSelectedArea(null) }/>
        </div>

        <div className="flex-grow-1" style={{ overflowY: "auto", flexBasis: "0px" }}>
            <section style={{height: 250}}>
                CHART
            </section>
            <section>
                DATA
            </section>
        </div>

    </div>
)