import * as React from "react"
import * as d3 from 'd3'
import { ChartType } from "../../analysis_panel"
import { ChartData } from "../subsection"

interface HistogramProps {
    chartData: ChartData
}
export const GenerateHistogram = ({ chartData }: HistogramProps) => {

    const [width, height] = [500, 500]

    const svgRef = React.useRef(null)

    React.useEffect(() => {

        const svg = d3.select(svgRef.current)

        const dataValues = Object.values(chartData.count)

        console.log(chartData.count)

    }, [chartData, width, height]);

    return (
        <svg ref={svgRef} width={width} height={height}></svg>
    );
}