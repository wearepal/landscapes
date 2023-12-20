import * as React from "react"
import * as d3 from 'd3'
import { ChartData } from "../subsection"

interface HistogramProps {
    chartData: ChartData
}
export const GenerateHistogram = ({ chartData }: HistogramProps) => {


    const axesRef = React.useRef(null)
    const MARGIN = { top: 60, right: 30, bottom: 40, left: 50 }
    const BIN_PADDING = 0

    const data = chartData.count
    const cols = chartData.colors
    const { min, max, step } = chartData.numeric_stats ? chartData.numeric_stats : { min: 0, max: 0, step: 0 }

    const [width, height] = [400, 300]
    const [boundsWidth, boundsHeight] = [width - MARGIN.right - MARGIN.left, height - MARGIN.top - MARGIN.bottom]

    const xScale = d3
        .scaleLinear()
        .domain([min, max])
        .range([0, boundsWidth])

    const yScale = d3
        .scaleLinear()
        .range([boundsHeight, 0])
        .domain([0, Math.max(...Array.from(data.values())) * 1.1])

    const rects = Array.from(chartData.count).map((bin, i) => {

        let color = cols?.get(bin[0])
        color = color ? color : [255, 255, 255, 1]
        let bin_w = xScale(bin[0] + step) - xScale(bin[0]) - BIN_PADDING

        return <rect
            key={i}
            fill={`rgb(${color[0]}, ${color[1]}, ${color[2]})`}
            stroke="lightgrey"
            x={xScale(bin[0])}
            width={bin_w}
            y={yScale(bin[1])}
            height={boundsHeight - yScale(bin[1])}
        />
    })

    React.useEffect(() => {
        const svgElement = d3.select(axesRef.current);
        svgElement.selectAll("*").remove();

        const xAxisGenerator = d3.axisBottom(xScale);
        svgElement
            .append("g")
            .attr("transform", "translate(0," + boundsHeight + ")")
            .call(xAxisGenerator);

        const yAxisGenerator = d3.axisLeft(yScale);
        svgElement.append("g").call(yAxisGenerator);
    }, [xScale, yScale, boundsHeight]);


    return (
        <svg id="hist" width={width} height={height}>
            <g
                width={boundsWidth}
                height={boundsHeight}
                transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
            >
                {rects}
            </g>
            <g
                width={boundsWidth}
                height={boundsHeight}
                ref={axesRef}
                transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
            />
        </svg>
    );
}