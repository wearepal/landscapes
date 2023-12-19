import * as React from "react"
import { ChartData } from "../subsection"
import * as d3 from "d3"


interface BarChartProps {
    chartData: ChartData
}
export const GenerateBarChart = ({ chartData }: BarChartProps) => {

    const [h, w, m, bar_pad] = [300, 300, { top: 30, bottom: 30, left: 10, right: 10 }, 0.5]
    const [bounds_w, bounds_h] = [(w - m.right - m.left), (h - m.top - m.bottom)]

    const data = Array.from(chartData.count, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5)

    const xScale = d3
        .scaleLinear()
        .domain([0, Math.max(...data.map(d => d.value))])
        .range([0, bounds_w])

    const yScale = d3
        .scaleBand()
        .range([0, bounds_h])
        .domain(data.map(d => d.name))
        .padding(bar_pad)

    const rects = data.map((d, i) => {
        const color = chartData.colors?.get(d.name) ?? [0,0,0]
        const y = yScale(d.name)
        if (y === undefined) { return null }

        return (
            <g key={i}>
                <rect
                    x={0}
                    y={y}
                    width={xScale(d.value)}
                    height={yScale.bandwidth()}
                    stroke="lightgrey"
                    fill={`rgb(${color[0]}, ${color[1]}, ${color[2]})`}
                    strokeWidth={1}
                    rx={1}
                />
            </g>
        )
    })

    const grid = xScale.ticks(5).map((d, i) => (
        <g key={i}>
            <line
                x1={xScale(d)}
                x2={xScale(d)}
                y1={0}
                y2={bounds_h}
                stroke="#e0e0e0"
                strokeWidth={1}
            />
            <text
                x={xScale(d)}
                y={bounds_h + 15}
                fontSize={10}
                textAnchor="middle"
                fill="black"
            >
                {d}
            </text>
        </g>
    ))

    return (
        <div>
            <svg width={w} height={h}>
                <g
                width={bounds_h}
                height={bounds_w}
                transform={`translate(${[m.left, m.top].join(",")})`}
                >
                    {grid}
                    {rects}
                    <text
                        x={bounds_w / 2}
                        y={bounds_h + m.bottom}
                        fontSize={12}
                        textAnchor="middle"
                        fill="black"
                    >
                    Area (km²)
                    </text>
                </g>
            </svg>
        </div>
    )
}