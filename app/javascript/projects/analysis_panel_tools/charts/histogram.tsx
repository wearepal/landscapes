import * as React from "react"
import * as d3 from 'd3'
import { ChartData } from "../subsection"
import { TileGridProps } from "../../modelling/tile_grid"
import { isEqual } from "lodash"

interface HistogramProps {
    chartData: ChartData
    props: TileGridProps | undefined
    cellArea: number
}

// Helper function to create stable fingerprint for chart data
const createDataFingerprint = (chartData: ChartData): string => {
    if (!chartData.numeric_stats) return "";
    
    try {
        // Only include the specific values that would affect visualization
        const bins = Array.from(chartData.count.keys()).map(Number).sort((a, b) => a - b);
        
        // Create pairs of bin:count that represent the histogram data
        const dataSignature = bins.map(bin => {
            const value = chartData.count.get(bin) || 0;
            return `${bin.toFixed(2)}:${value.toFixed(2)}`;
        }).join('|');
        
        // Include min/max/step to detect axis changes
        const statsSignature = `${chartData.numeric_stats.min.toFixed(2)}-${chartData.numeric_stats.max.toFixed(2)}-${chartData.numeric_stats.step.toFixed(2)}`;
        
        // Add explicit fill type detection
        const fillSignature = chartData.inputFillType || 'none';
        
        return `stats:${statsSignature}|data:${dataSignature}|fill:${fillSignature}`;
    } catch (e) {
        // Fallback if any errors occur
        return "";
    }
};

export const GenerateHistogram = React.memo((props: HistogramProps) => {
    const { chartData, props: tileProps, cellArea } = props;
    const svgRef = React.useRef(null);
    const axesRef = React.useRef(null);
    
    // Constants
    const MARGIN = { top: 60, right: 30, bottom: 40, left: 50 };
    const BIN_PADDING = 0;
    const [width, height] = [400, 300];
    const [boundsWidth, boundsHeight] = [width - MARGIN.right - MARGIN.left, height - MARGIN.top - MARGIN.bottom];

    // Calculate units and scales
    const maxCount = Math.max(...Array.from(chartData.count.values()));
    const units = maxCount < 0.1 ? "m²" : "km²";
    const { min, max, step } = chartData.numeric_stats ? chartData.numeric_stats : { min: 0, max: 0, step: 0 };
    
    const xScale = d3.scaleLinear()
        .domain([min, max])
        .range([0, boundsWidth]);

    const yScale = d3.scaleLinear()
        .range([boundsHeight, 0])
        .domain([0, units === "km²" ? maxCount : maxCount * (1000 ** 2)]);

    // Calculate the data for the bars once
    const barsData = React.useMemo(() => {
        return Array.from(chartData.count, ([name, value]) => ({ 
            name: Number(name), 
            value: units === "m²" ? value * (1000 ** 2) : value,
            width: xScale(Number(name) + step) - xScale(Number(name)) - BIN_PADDING,
            x: xScale(Number(name)),
            y: yScale(units === "m²" ? value * (1000 ** 2) : value),
            height: boundsHeight - yScale(units === "m²" ? value * (1000 ** 2) : value)
        }));
    }, [chartData.count, step, xScale, yScale, units, boundsHeight]);
    
    // Get color as string
    const getBarColor = (value: number): string => {
        if (chartData.colors && chartData.colors.has(value)) {
            const color = chartData.colors.get(value);
            return color ? "rgb(" + color.toString() + ")" : "#666666";
        }
        return "#666666";
    };
    
    // Draw bars with intelligent updates
    React.useEffect(() => {
        if (!svgRef.current) return;
        
        const svg = d3.select(svgRef.current);
        const t = d3.transition().duration(800);
        
        // Join data to elements (D3's enter/update/exit pattern)
        const bars = svg.selectAll("rect")
            .data(barsData, (d: any) => d.name);
        
        // Enter: Create new bars
        bars.enter()
            .append("rect")
            .attr("fill", d => getBarColor(d.name))
            .attr("stroke", "lightgrey")
            .attr("x", d => d.x)
            .attr("width", d => d.width)
            .attr("y", boundsHeight)
            .attr("height", 0)
            .transition(t)
            .delay((_, i) => i * 20)
            .attr("y", d => d.y)
            .attr("height", d => d.height);
        
        // Update: Update existing bars
        bars.transition(t)
            .attr("fill", d => getBarColor(d.name))
            .attr("x", d => d.x)
            .attr("width", d => d.width)
            .attr("y", d => d.y)
            .attr("height", d => d.height);
        
        // Exit: Remove bars no longer in the data
        bars.exit()
            .transition(t)
            .attr("y", boundsHeight)
            .attr("height", 0)
            .remove();
            
    }, [barsData, chartData.colors, boundsHeight]);

    // Draw axes
    React.useEffect(() => {
        if (!axesRef.current) return;
        
        const svgElement = d3.select(axesRef.current);
        svgElement.selectAll("*").remove();

        const xAxisGenerator = d3.axisBottom(xScale);
        svgElement
            .append("g")
            .attr("transform", `translate(0,${boundsHeight})`)
            .call(xAxisGenerator);

        const yAxisGenerator = d3.axisLeft(yScale).ticks(4);
        svgElement.append("g").call(yAxisGenerator);
    }, [xScale, yScale, boundsHeight]);

    return (
        <svg id="hist" width={width} height={height} style={{marginBottom: 15, overflow: "auto"}}>
            <g
                width={boundsWidth}
                height={boundsHeight}
                ref={svgRef}
                transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
            />
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
                {tileProps?.area && tileProps.unit ? `${tileProps.unit}/${tileProps.area}` : `value`}
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
}, (prevProps, nextProps) => {
    // Custom comparison function for React.memo
    // Only re-render if these specific props change
    return (
        createDataFingerprint(prevProps.chartData) === createDataFingerprint(nextProps.chartData)
    );
});