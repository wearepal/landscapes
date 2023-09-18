import * as React from "react"
import { ChartType } from "../../analysis_panel"
import { ChartData } from "../subsection"
import * as d3 from "d3"


interface PieChartProps {
    chartData: ChartData
}
export const GeneratePieChart = ({ chartData }: PieChartProps) => {

    const chartRef = React.useRef<SVGSVGElement | null>(null)
    const data = chartData.count
    const colors = chartData.colors

    React.useEffect(() => {

        const [width, height] = [350, 350]

        const svg = d3.select(chartRef.current)
            .attr('width', width)
            .attr('height', height);

        const pie = d3.pie<number>()
            .value(d => d);

        const arc = d3.arc<d3.PieArcDatum<number>>()
            .innerRadius(0)
            .outerRadius(Math.min(width, height) / 2 - 10);

        const defaultColors = d3.schemeCategory10;
        const color = d3.scaleOrdinal<string>()
            .domain(Array.from(data.keys()))
            .range(colors ? Array.from(colors.values()).map(rgba => `rgba(${rgba.join(',')})`) : defaultColors);

        const pieData = Array.from(data.values());

        const arcs = svg.selectAll<SVGGElement, d3.PieArcDatum<number>>('g.arc')
            .data(pie(pieData))
            .enter()
            .append('g')
            .attr('class', 'arc')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        arcs.append('path')
            .attr('d', arc)
            .attr('fill', (d, i) => color(i.toString()));
    }, [data, colors]);

    return (
        <div style={{ textAlign: 'center' }}>
            <svg ref={chartRef}></svg>
        </div>
    )
}