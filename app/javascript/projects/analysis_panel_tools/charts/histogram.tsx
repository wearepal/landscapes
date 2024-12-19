import * as React from "react"
import * as d3 from 'd3'
import { ChartData } from "../subsection"
import { TileGridProps } from "../../modelling/tile_grid"

interface HistogramProps {
    chartData: ChartData
    props: TileGridProps | undefined
    cellArea: number
}

export const GenerateHistogram = ({ chartData, props, cellArea }: HistogramProps) => {


    const axesRef = React.useRef(null)
    const MARGIN = { top: 60, right: 30, bottom: 40, left: 50 }
    const BIN_PADDING = 0


    const maxCount = Math.max(...Array.from(chartData.count.values()))
    let units = "km²"
    if (maxCount < 0.1) units = "m²"
    const cols = chartData.colors
    const { min, max, step } = chartData.numeric_stats ? chartData.numeric_stats : { min: 0, max: 0, step: 0 }

    const [width, height] = [400, 300]
    const [boundsWidth, boundsHeight] = [width - MARGIN.right - MARGIN.left, height - MARGIN.top - MARGIN.bottom]

    //const cellCountArr = Array.from(chartData.count.values(), (value) => ((units === "m²" ? value : value * (1000 ** 2)) * cellArea))

    const domMax = Math.max(...Array.from(chartData.count.values()))

    const xScale = d3
        .scaleLinear()
        .domain([min, max])
        .range([0, boundsWidth])

    const yScale = d3
        .scaleLinear()
        .range([boundsHeight, 0])
        .domain([0, units == "km²" ? domMax : domMax * (1000 ** 2)])

    // const yRScale = d3
    //     .scaleLinear()
    //     .range([boundsHeight, 0])
    //     .domain([0, Math.max(...cellCountArr)])

    const rects = Array.from(chartData.count, ([name, value]) => ({ name, value: units === "m²" ? value * (1000 ** 2) : value })).map((bin, i) => {

        let color = cols?.get(bin.name)
        color = color ? color : [255, 255, 255, 1]
        let bin_w = xScale(bin.name + step) - xScale(bin.name) - BIN_PADDING

        return <rect
            key={i}
            fill={`rgb(${color[0]}, ${color[1]}, ${color[2]})`}
            stroke="lightgrey"
            x={xScale(bin.name)}
            width={bin_w}
            y={yScale(bin.value)}
            height={boundsHeight - yScale(bin.value)}
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

        const yAxisGenerator = d3.axisLeft(yScale).ticks(4)
        //const yAxisRightGenerator = d3.axisRight(yRScale).ticks(4)
        svgElement.append("g").call(yAxisGenerator)
        //svgElement.append("g").attr("transform", `translate(${boundsWidth}, 0)`).call(yAxisRightGenerator)
        
    }, [xScale, yScale, boundsHeight]);


    return (
        <svg id="hist" width={width} height={height} style={{marginBottom: 15, overflow: "auto"}}>
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
            <text
                x={width / 2}
                y={height - 5} 
                textAnchor="middle"
                fontSize="14px"
                fill="black"
            >
                {props?.area && props.unit ? `${props.unit}/${props.area}` : `value`}
            </text>
            <text
                x={-height / 2} 
                y={15}
                transform="rotate(-90)" 
                textAnchor="middle"
                fontSize="14px"
                fill="black"
            >
                {units}
            </text>
        </svg>
    );
}