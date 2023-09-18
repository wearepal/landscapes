import * as React from "react"
import { ChartType } from "../../analysis_panel"
import { ChartData } from "../subsection"


interface PieChartProps {
    chartData: ChartData
    chartType: ChartType
}
export const GeneratePieChart = ({ chartData, chartType }: PieChartProps) => {

    return <>pie</>
}