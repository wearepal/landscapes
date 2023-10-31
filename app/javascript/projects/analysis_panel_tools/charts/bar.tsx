import * as React from "react"
import { ChartData } from "../subsection"
import * as d3 from "d3"


interface BarChartProps {
    chartData: ChartData
}
export const GenerateBarChart = ({ chartData }: BarChartProps) => {

    const [h, w, m, bar_pad] = [400, 400, { top: 30, bottom: 10, left: 10, right: 10 }, 0.5]
    const [bounds_w, bounds_h] = [(w - m.right - m.left), (h - m.top, m.bottom)]

    const data = Array.from(chartData.count, ([name, value]) => ({ name, value }))

    return (
        <div>
            {/* <svg width={w} height={h}>
            </svg> */}
        </div>
    )
}