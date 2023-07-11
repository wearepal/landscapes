import * as React from 'react';
import * as d3 from 'd3';

interface PieChartProps {
  data: Map<any, number>;
  width: number;
  height: number;
  colors?: Map<any, [number, number, number, number]>;
}

const PieChart: React.FC<PieChartProps> = ({ data, width, height, colors }) => {
    const chartRef = React.useRef<SVGSVGElement | null>(null);
    const legendRef = React.useRef<SVGElement | null>(null);

  React.useEffect(() => {
    const svg = d3.select(chartRef.current)
      .attr('width', width)
      .attr('height', height);

    const legend = d3.select(legendRef.current)
      .attr('width', width)
      .attr('height', 30);

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
  }, [data, width, height, colors]);

  return (
    <div>
      <svg ref={chartRef}></svg>
    </div>
  )
}

export default PieChart;
