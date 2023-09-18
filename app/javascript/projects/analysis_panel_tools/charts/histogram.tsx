import * as React from "react"
import { ChartType } from "../../analysis_panel"
import { ChartData } from "../subsection"


interface HistogramProps {
    chartData: ChartData
    chartType: ChartType
}
export const GenerateHistogram = ({ chartData, chartType }: HistogramProps) => {

    return <>histogram</>
}