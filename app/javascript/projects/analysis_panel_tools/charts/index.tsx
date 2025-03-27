import * as React from "react"
import { ChartData } from "../subsection"
import { ChartType } from "../../analysis_panel"
import { GeneratePieChart } from "./pie"
import { GenerateHistogram } from "./histogram"
import { GenerateBarChart } from "./bar"
import { TileGridProps } from "../../modelling/tile_grid"

interface ChartProps {
    chartData: ChartData
    chartType: ChartType
    props: TileGridProps | undefined
    cellArea: number
    showStdDev?: boolean
}
export const GenerateChart = ({ chartData, chartType, props, cellArea, showStdDev }: ChartProps) => {
    switch (chartType) {
        case "pie":
            return <GeneratePieChart
                chartData={chartData}
            />
            break;
        case "hist":
            return <GenerateHistogram
                chartData={chartData}
                props={props}
                cellArea={cellArea}
                showStdDev={showStdDev}
            />
            break;
        case "bar":
            return <GenerateBarChart
                chartData={chartData}
            />
            break;
        default:
            return <>Error</>
            break;
    }

}

