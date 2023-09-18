import * as React from "react"
import { ChartType } from "../../analysis_panel"
import { ChartData } from "../subsection"


interface BarChartProps {
    chartData: ChartData
    chartType: ChartType
}
export const GenerateBarChart = ({ chartData, chartType }: BarChartProps) => {

    return <>bar</>
}