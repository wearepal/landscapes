import * as React from 'react'
import * as d3 from 'd3'

interface PieData {
  label: string;
  value: number;
}

interface PieChartProps {
  data: PieData[];
  width: number;
  height: number;
}

const PieChart: React.FC<PieChartProps> = ({ data, width, height }) => {
  const chartRef = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    const svg = d3.select(chartRef.current)
      .attr('width', width)
      .attr('height', height);

    const pie = d3.pie<PieData>()
      .value(d => d.value);

    const arc = d3.arc<d3.PieArcDatum<PieData>>()
      .innerRadius(0)
      .outerRadius(Math.min(width, height) / 2 - 10);

    const color = d3.scaleOrdinal<string>()
      .domain(data.map(d => d.label))
      .range(d3.schemeCategory10);

    const arcs = svg.selectAll<SVGGElement, d3.PieArcDatum<PieData>>('g.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(i.toString()));

    arcs.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('dy', '0.35em')
      .text(d => d.data.label);
  }, [data, width, height]);

  return <svg ref={chartRef}></svg>;
};

export default PieChart;
