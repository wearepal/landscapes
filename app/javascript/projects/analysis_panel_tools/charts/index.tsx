import * as React from "react"
import { ChartData } from "../subsection"
import { ChartType } from "../../analysis_panel"
import { GeneratePieChart } from "./pie"
import { GenerateHistogram } from "./histogram"
import { GenerateBarChart } from "./bar"

interface ChartProps {
    chartData: ChartData
    chartType: ChartType
}
export const GenerateChart = ({ chartData, chartType }: ChartProps) => {
    switch (chartType) {
        case "pie":
            return <GeneratePieChart
                chartData={chartData}
                chartType={chartType}
            />
            break;
        case "hist":
            return <GenerateHistogram
                chartData={chartData}
                chartType={chartType}
            />
            break;
        case "bar":
            return <GenerateBarChart
                chartData={chartData}
                chartType={chartType}
            />
            break;
        default:
            return <>Error</>
            break;
    }

}

