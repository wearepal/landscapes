import * as React from "react"
import { ChartData } from "../subsection"
import * as d3 from "d3"


interface PieChartProps {
    chartData: ChartData
}
export const GeneratePieChart = ({ chartData }: PieChartProps) => {

    const data = chartData.count
    const colors = chartData.colors
    const [h, w] = [300, 300]
    const m = 30
    const radius = Math.min(h, w) / 2 - m

    const pieGenerator = d3.pie().value((d) => (d as any).value)
    const arrayOfObj = Array.from(data, ([name, value]) => ({ name, value }))
    const pie = pieGenerator(arrayOfObj as any)

    const arcPathGenerator = d3.arc()
    const arcs = pie.map((p, i) => ({
        path: arcPathGenerator({
            innerRadius: 0,
            outerRadius: radius,
            startAngle: p.startAngle,
            endAngle: p.endAngle,
        }),
        color: (colors ? Array.from(colors, ([i, j]) => j)[i] : [0, 0, 0, 0]) // TODO: no color exists, Boolean data, retrieve color from elsewhere.
    }));

    return (
        <div style={{ textAlign: 'center' }}>
            <svg width={w} height={h}>
                <g transform={`translate(${w / 2}, ${h / 2})`}>
                    {arcs.map((arc, i) => {
                        return <path key={i} d={arc.path as any} fill={`rgb(${arc.color[0]}, ${arc.color[1]}, ${arc.color[2]})`} />
                    })}
                </g>
            </svg>
        </div>
    )
}